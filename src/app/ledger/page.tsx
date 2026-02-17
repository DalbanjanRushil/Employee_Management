import { getMonthLedger } from '@/lib/data';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function LedgerPage() {
    const now = new Date(); // Default to current month
    const ledger = await getMonthLedger(now);

    return (
        <div className="p-5 pb-24 space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-slate-900">Monthly Ledger</h1>
                <p className="text-slate-500">{format(now, 'MMMM yyyy')}</p>
            </header>

            {/* Business Snapshot */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl">
                <h2 className="text-xs uppercase tracking-widest text-slate-400 mb-4">Business Performance</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <span className="text-slate-400 text-sm block mb-1">Total Revenue</span>
                        <span className="text-2xl font-bold">₹{ledger.business.revenue.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-slate-400 text-sm block mb-1">Net Profit</span>
                        <span className="text-2xl font-bold text-emerald-400">₹{ledger.business.profit.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-slate-400 text-sm block mb-1">Labour Payout</span>
                        <span className="text-xl font-semibold">₹{ledger.business.labour_cost.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-slate-400 text-sm block mb-1">Materials Recovered</span>
                        <span className="text-xl font-semibold text-rose-300">₹{ledger.business.material_cost.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Worker Payables */}
            <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Worker Payouts</h2>
                <div className="space-y-3">
                    {ledger.workers.map((w: any) => (
                        <div key={w.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-slate-900">{w.name}</span>
                                <span className="font-bold text-indigo-600">₹{w.net_pay.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
                                <span>Production: {w.pieces} pcs (₹{w.gross_pay})</span>
                                <span className="text-rose-500">- ₹{w.deduction} mat</span>
                            </div>
                        </div>
                    ))}
                    {ledger.workers.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            No activity this month.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
