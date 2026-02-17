'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createWorker(formData: FormData) {
    const name = formData.get('name') as string;
    const labourRate = parseFloat(formData.get('labourRate') as string);

    if (!name || isNaN(labourRate)) {
        throw new Error("Invalid Input");
    }

    db.prepare('INSERT INTO workers (name, labour_rate) VALUES (?, ?)').run(name, labourRate);

    revalidatePath('/workers');
    redirect('/workers');
}

export async function createWorkOrder(formData: FormData) {
    const workerId = parseInt(formData.get('workerId') as string);
    const quantity = parseInt(formData.get('quantity') as string);
    const sellingPrice = parseFloat(formData.get('sellingPrice') as string);
    const labourRate = parseFloat(formData.get('labourRate') as string);

    if (!workerId || isNaN(quantity) || isNaN(sellingPrice) || isNaN(labourRate)) {
        throw new Error('Missing required fields');
    }

    db.prepare(`
    INSERT INTO work_orders (worker_id, quantity, selling_price, labour_rate, status)
    VALUES (?, ?, ?, ?, 'PENDING')
  `).run(workerId, quantity, sellingPrice, labourRate);

    revalidatePath('/');
    revalidatePath('/work');
    redirect('/work');
}

export async function markWorkStatus(id: number, status: string) {
    const completedAt = status === 'COMPLETED' ? new Date().toISOString() : null;

    db.prepare(`
    UPDATE work_orders 
    SET status = ?, completed_at = ?
    WHERE id = ?
  `).run(status, completedAt, id);

    revalidatePath('/work');
    revalidatePath('/');
}

export async function createMaterialUsage(formData: FormData) {
    const workerId = parseInt(formData.get('workerId') as string);
    const name = formData.get('name') as string;
    const cost = parseFloat(formData.get('cost') as string);

    if (!workerId || !name || isNaN(cost)) {
        throw new Error("Invalid Input");
    }

    db.prepare(`
    INSERT INTO materials (worker_id, name, cost)
    VALUES (?, ?, ?)
  `).run(workerId, name, cost);

    revalidatePath('/ledger');
    redirect('/ledger');
}
