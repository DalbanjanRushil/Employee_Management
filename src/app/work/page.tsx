import { getAllWorkOrders } from '@/lib/data';
import WorkStatusUpdater from '@/components/WorkStatusUpdater';
import { format } from 'date-fns';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function WorkListPage() {
    const orders = await getAllWorkOrders();

    return (
        <div className="p-5 pb-24 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Production Log</h1>
                <Link href="/work/new" className="bg-indigo-600 text-white p-2 rounded-full shadow-lg active:scale-95 transition-transform">
                    <Plus size={24} />
                </Link>
            </div>

            <div className="space-y-3">
                {orders.map((order: any) => (
                    <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs text-slate-400 font-medium">{format(new Date(order.date), 'MMM d, yyyy')}</span>
                                <h3 className="font-bold text-slate-900 text-lg">{order.worker_name}</h3>
                                <p className="text-sm text-slate-500">{order.quantity} pcs @ ₹{order.labour_rate}</p>
                            </div>
                            <WorkStatusUpdater id={order.id} status={order.status} />
                        </div>
                        <div className="flex justify-between items-center text-xs border-t border-slate-50 pt-3">
                            <span className="text-slate-400">Profit: <span className="text-emerald-600 font-semibold">₹{(order.quantity * (order.selling_price - order.labour_rate)).toFixed(0)}</span></span>
                            <span className="text-slate-400">Total Pay: ₹{(order.quantity * order.labour_rate).toFixed(0)}</span>
                        </div>
                    </div>
                ))}
                {orders.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                        No work found. Start assigning!
                    </div>
                )}
            </div>
        </div>
    );
}
