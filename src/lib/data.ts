import db from '@/lib/db';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, format } from 'date-fns';

export async function getDashboardStats() {
  const now = new Date();
  const start = format(startOfDay(now), 'yyyy-MM-dd HH:mm:ss');
  const end = format(endOfDay(now), 'yyyy-MM-dd HH:mm:ss');

  // Today's Completed Pieces
  const completedToday = db.prepare(`
    SELECT SUM(quantity) as total 
    FROM work_orders 
    WHERE status = 'COMPLETED' 
    AND completed_at BETWEEN ? AND ?
  `).get(start, end) as { total: number };

  // Pending Work
  const pendingWork = db.prepare(`
    SELECT COUNT(*) as count, SUM(quantity) as total_qty
    FROM work_orders
    WHERE status = 'PENDING'
  `).get() as { count: number, total_qty: number };

  // Today's Profit (approx)
  // Profit = Revenue (selling_price * qty) - Labour (labour_rate * qty) - Materials (today?)
  const completedOrders = db.prepare(`
    SELECT quantity, selling_price, labour_rate
    FROM work_orders
    WHERE status = 'COMPLETED'
    AND completed_at BETWEEN ? AND ?
  `).all(start, end) as { quantity: number, selling_price: number, labour_rate: number }[];

  const revenue = completedOrders.reduce((sum, o) => sum + (o.quantity * o.selling_price), 0);
  const labourCost = completedOrders.reduce((sum, o) => sum + (o.quantity * o.labour_rate), 0);

  // Materials used today
  const materialCost = db.prepare(`
    SELECT SUM(cost) as total
    FROM materials
    WHERE date BETWEEN ? AND ?
  `).get(start, end) as { total: number };

  const profit = revenue - labourCost - (materialCost.total || 0);

  return {
    piecesToday: completedToday.total || 0,
    pendingOrders: pendingWork.count || 0,
    pendingPieces: pendingWork.total_qty || 0,
    profitToday: profit,
  };
}

export async function getWorkers() {
  return db.prepare('SELECT * FROM workers ORDER BY name ASC').all();
}

export async function getWorkHistory(limit = 10) {
  return db.prepare(`
        SELECT w.*, wk.name as worker_name 
        FROM work_orders w
        JOIN workers wk ON w.worker_id = wk.id
        ORDER BY w.created_at DESC 
        LIMIT ?
    `).all(limit);
}

export async function getWorkerById(id: number) {
  return db.prepare('SELECT * FROM workers WHERE id = ?').get(id);
}

export async function getWorkerStats(workerId: number) {
  // Aggregate all time or current month? User asked for "Monthly worker ledger view".
  // Let's get current month stats first.
  const now = new Date();
  const start = format(startOfMonth(now), 'yyyy-MM-dd HH:mm:ss');
  const end = format(endOfMonth(now), 'yyyy-MM-dd HH:mm:ss');

  const work = db.prepare(`
    SELECT SUM(quantity) as total_pieces, SUM(quantity * labour_rate) as total_earnings
    FROM work_orders
    WHERE worker_id = ? AND status = 'COMPLETED' AND completed_at BETWEEN ? AND ?
  `).get(workerId, start, end) as { total_pieces: number, total_earnings: number };

  const materials = db.prepare(`
    SELECT SUM(cost) as total_deductions
    FROM materials
    WHERE worker_id = ? AND date BETWEEN ? AND ?
  `).get(workerId, start, end) as { total_deductions: number };

  return {
    pieces: work.total_pieces || 0,
    earnings: work.total_earnings || 0,
    deductions: materials.total_deductions || 0,
    net_salary: (work.total_earnings || 0) - (materials.total_deductions || 0)
  };
}

export async function getAllWorkOrders() {
  return db.prepare(`
      SELECT wo.*, w.name as worker_name 
      FROM work_orders wo
      JOIN workers w ON wo.worker_id = w.id
      ORDER BY wo.created_at DESC
   `).all();
}

export async function getAllMaterials() {
  return db.prepare(`
      SELECT m.*, w.name as worker_name
      FROM materials m
      JOIN workers w ON m.worker_id = w.id
      ORDER BY m.date DESC
   `).all();
}

export async function getMonthLedger(date: Date) {
  const start = format(startOfMonth(date), 'yyyy-MM-dd HH:mm:ss');
  const end = format(endOfMonth(date), 'yyyy-MM-dd HH:mm:ss');

  // Business Totals
  const business = db.prepare(`
    SELECT 
      SUM(w.quantity * w.selling_price) as revenue,
      SUM(w.quantity * w.labour_rate) as labour_cost
    FROM work_orders w
    WHERE w.status = 'COMPLETED' 
    AND w.completed_at BETWEEN ? AND ?
  `).get(start, end) as { revenue: number, labour_cost: number };

  const materials = db.prepare(`
    SELECT SUM(cost) as total
    FROM materials
    WHERE date BETWEEN ? AND ?
  `).get(start, end) as { total: number };

  // Worker Breakdown
  const workers = db.prepare(`
    SELECT 
      wk.id, 
      wk.name,
      COALESCE(SUM(wo.quantity), 0) as pieces,
      COALESCE(SUM(wo.quantity * wo.labour_rate), 0) as gross_pay
    FROM workers wk
    LEFT JOIN work_orders wo ON wk.id = wo.worker_id 
      AND wo.status = 'COMPLETED' 
      AND wo.completed_at BETWEEN ? AND ?
    GROUP BY wk.id
  `).all(start, end) as any[];

  // Get material deductions per worker
  // Helper to attach deductions
  // Since SQLite simple join aggregation might duplicate if multiple materials, better to query separately or subquery.
  // Or just iterate workers.

  const workerStats = workers.map(w => {
    const mat = db.prepare(`
        SELECT SUM(cost) as total 
        FROM materials 
        WHERE worker_id = ? AND date BETWEEN ? AND ?
     `).get(w.id, start, end) as { total: number };

    const deduction = mat.total || 0;
    return {
      ...w,
      deduction,
      net_pay: w.gross_pay - deduction
    };
  });

  return {
    business: {
      revenue: business.revenue || 0,
      labour_cost: business.labour_cost || 0,
      material_cost: materials.total || 0,
      profit: (business.revenue || 0) - (business.labour_cost || 0) // Materials are paid by worker deduction, so business profit is simply Rev - GrossLabour? 
      // Wait, if business PAYS for material, and deducts from worker...
      // Cash Flow: Out(Material) + Out(NetLabour) = Out(Material) + Out(Gross - Material) = Out(Gross).
      // Profit = Revenue - GrossLabour.
      // Correct.
      // Unless material is "Shop Expense" not deducted. But user said "Deducted".
    },
    workers: workerStats
  };
}

export async function getWorkerWorkHistory(workerId: number) {
  return db.prepare(`
    SELECT * FROM work_orders 
    WHERE worker_id = ? 
    ORDER BY created_at DESC
  `).all(workerId);
}

export async function getWorkerMaterials(workerId: number) {
  return db.prepare(`
    SELECT * FROM materials 
    WHERE worker_id = ? 
    ORDER BY date DESC
  `).all(workerId);
}
