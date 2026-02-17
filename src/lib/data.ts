import dbConnect from './db';
import { WorkOrder, Worker, Material } from './models';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, format } from 'date-fns';

// Helper to stringify ObjectId for client consumption if needed
// function serialize(obj: any) {
//    return JSON.parse(JSON.stringify(obj));
// }

export async function getDashboardStats() {
  await dbConnect();

  const now = new Date();
  const start = startOfDay(now);
  const end = endOfDay(now);

  // Today's Completed Pieces
  const completedToday = await WorkOrder.aggregate([
    { $match: { status: 'COMPLETED', completedAt: { $gte: start, $lte: end } } },
    { $group: { _id: null, total: { $sum: '$quantity' } } }
  ]);

  // Pending Work
  const pendingWork = await WorkOrder.aggregate([
    { $match: { status: 'PENDING' } },
    { $group: { _id: null, count: { $sum: 1 }, total_qty: { $sum: '$quantity' } } }
  ]);

  // Today's Profit
  const completedOrders = await WorkOrder.find({
    status: 'COMPLETED',
    completedAt: { $gte: start, $lte: end }
  });

  const revenue = completedOrders.reduce((sum, o) => sum + (o.quantity * o.sellingPrice), 0);
  const labourCost = completedOrders.reduce((sum, o) => sum + (o.quantity * o.labourRate), 0);

  // Materials used today
  const materialCost = await Material.aggregate([
    { $match: { date: { $gte: start, $lte: end } } },
    { $group: { _id: null, total: { $sum: '$cost' } } }
  ]);

  const matTotal = materialCost[0]?.total || 0;
  const profit = revenue - labourCost - matTotal;

  return {
    piecesToday: completedToday[0]?.total || 0,
    pendingOrders: pendingWork[0]?.count || 0,
    pendingPieces: pendingWork[0]?.total_qty || 0,
    profitToday: profit,
  };
}


export async function getWorkers() {
  await dbConnect();
  const workers = await Worker.find({}).sort({ name: 1 }).lean();
  return workers.map((w: any) => ({ ...w, id: w._id.toString() }));
}

export async function getWorkerById(id: string) {
  await dbConnect();
  // Validate ObjectId if strictly needed, but let mongoose handle it
  const worker = await Worker.findById(id).lean();
  if (!worker) return null;
  return { ...worker, id: worker._id.toString() };
}

export async function getWorkerStats(workerId: string) {
  await dbConnect();
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  // Convert string ID to ObjectId for aggregation
  const mongoose = await import('mongoose');
  const oId = new mongoose.Types.ObjectId(workerId);

  const work = await WorkOrder.aggregate([
    {
      $match: {
        workerId: oId,
        status: 'COMPLETED',
        completedAt: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: null,
        total_pieces: { $sum: '$quantity' },
        total_earnings: { $sum: { $multiply: ['$quantity', '$labourRate'] } }
      }
    }
  ]);

  const material = await Material.aggregate([
    { $match: { workerId: oId, date: { $gte: start, $lte: end } } },
    { $group: { _id: null, total: { $sum: '$cost' } } }
  ]);

  const earnings = work[0]?.total_earnings || 0;
  const deductions = material[0]?.total || 0;

  return {
    pieces: work[0]?.total_pieces || 0,
    earnings: earnings,
    deductions: deductions,
    net_salary: earnings - deductions
  };
}

export async function getAllWorkOrders() {
  await dbConnect();
  const orders = await WorkOrder.find({})
    .populate('workerId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return orders.map((o: any) => ({
    ...o,
    id: o._id.toString(),
    worker_name: o.workerId?.name || 'Unknown'
  }));
}

export async function getAllMaterials() {
  await dbConnect();
  const mats = await Material.find({})
    .populate('workerId', 'name')
    .sort({ date: -1 })
    .lean();

  return mats.map((m: any) => ({
    ...m,
    id: m._id.toString(),
    worker_name: m.workerId?.name || 'Unknown'
  }));
}

export async function getMonthLedger(date: Date) {
  await dbConnect();
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  // Business Totals
  // Can assume business profit = (Rev - Labour) for all COMPLETED work in range
  // - Material costs in range?
  const completedOrders = await WorkOrder.find({
    status: 'COMPLETED',
    completedAt: { $gte: start, $lte: end }
  }).lean();

  const revenue = completedOrders.reduce((sum, o: any) => sum + (o.quantity * o.sellingPrice), 0);
  const labourCost = completedOrders.reduce((sum, o: any) => sum + (o.quantity * o.labourRate), 0);

  const materials = await Material.aggregate([
    { $match: { date: { $gte: start, $lte: end } } },
    { $group: { _id: null, total: { $sum: '$cost' } } }
  ]);
  const matCost = materials[0]?.total || 0;

  // Worker Breakdown
  const workers = await Worker.find({}).lean();
  const workerStats = await Promise.all(workers.map(async (w: any) => {
    const wId = w._id;

    const wWork = await WorkOrder.aggregate([
      { $match: { workerId: wId, status: 'COMPLETED', completedAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, pcs: { $sum: '$quantity' }, pay: { $sum: { $multiply: ['$quantity', '$labourRate'] } } } }
    ]);

    const wMat = await Material.aggregate([
      { $match: { workerId: wId, date: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: '$cost' } } }
    ]);

    const gross = wWork[0]?.pay || 0;
    const ded = wMat[0]?.total || 0;

    return {
      id: wId.toString(),
      name: w.name,
      pieces: wWork[0]?.pcs || 0,
      gross_pay: gross,
      deduction: ded,
      net_pay: gross - ded
    };
  }));

  // Filter out workers with zero activity if desired? No, nice to see list.
  // Sort by name?
  workerStats.sort((a, b) => a.name.localeCompare(b.name));

  return {
    business: {
      revenue,
      labour_cost: labourCost,
      material_cost: matCost,
      profit: revenue - labourCost // See prev logic: Material is recovered from worker
    },
    workers: workerStats
  };
}

export async function getWorkerWorkHistory(workerId: string) {
  await dbConnect();
  const orders = await WorkOrder.find({ workerId })
    .sort({ createdAt: -1 })
    .lean();
  return orders.map((o: any) => ({ ...o, id: o._id.toString() }));
}

export async function getWorkerMaterials(workerId: string) {
  await dbConnect();
  const mats = await Material.find({ workerId })
    .sort({ date: -1 })
    .lean();
  return mats.map((m: any) => ({ ...m, id: m._id.toString() }));
}
