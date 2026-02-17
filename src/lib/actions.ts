'use server';

import dbConnect from '@/lib/db';
import { Worker, WorkOrder, Material } from '@/lib/models';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createWorker(formData: FormData) {
    await dbConnect();

    const name = formData.get('name') as string;
    const labourRate = parseFloat(formData.get('labourRate') as string);

    if (!name || isNaN(labourRate)) {
        throw new Error("Invalid Input");
    }

    await Worker.create({
        name,
        labourRate,
        isActive: true
    });

    revalidatePath('/workers');
    redirect('/workers');
}

export async function createWorkOrder(formData: FormData) {
    await dbConnect();

    const workerId = formData.get('workerId') as string;
    const quantity = parseInt(formData.get('quantity') as string);
    const sellingPrice = parseFloat(formData.get('sellingPrice') as string);
    const labourRate = parseFloat(formData.get('labourRate') as string);

    if (!workerId || isNaN(quantity) || isNaN(sellingPrice) || isNaN(labourRate)) {
        throw new Error('Missing required fields');
    }

    await WorkOrder.create({
        workerId,
        quantity,
        sellingPrice,
        labourRate,
        status: 'PENDING'
    });

    revalidatePath('/');
    revalidatePath('/work');
    redirect('/work');
}

export async function markWorkStatus(id: string, status: string) {
    await dbConnect();

    const completedAt = status === 'COMPLETED' ? new Date() : undefined;
    // If reverting from completed? 
    // If status is not completed, completedAt should be unset?
    // Let's handle simple flow.

    const update: any = { status };
    if (status === 'COMPLETED') {
        update.completedAt = new Date();
    } else if (status === 'PENDING') {
        update.completedAt = null; // Unset
    }

    await WorkOrder.findByIdAndUpdate(id, update);

    revalidatePath('/work');
    revalidatePath('/');
    // revalidatePath(`/workers/${workerId}`); // We don't have workerId easily here without fetch. 
    // Ideally we should fetch and revalidate, but nextjs revalidates general layout usually?
    // Let's just revalidate global paths.
}

export async function createMaterialUsage(formData: FormData) {
    await dbConnect();

    const workerId = formData.get('workerId') as string;
    const name = formData.get('name') as string;
    const cost = parseFloat(formData.get('cost') as string);

    if (!workerId || !name || isNaN(cost)) {
        throw new Error("Invalid Input");
    }

    await Material.create({
        workerId,
        name,
        cost
    });

    revalidatePath('/ledger');
    redirect('/ledger');
}
