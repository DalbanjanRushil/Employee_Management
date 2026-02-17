import { getWorkerById, getWorkerStats, getWorkerWorkHistory, getWorkerMaterials } from '@/lib/data';
import WorkStatusUpdater from '@/components/WorkStatusUpdater';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function WorkerDetailPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    const worker = await getWorkerById(id) as any;
    const stats = await getWorkerStats(id);
    const workHistory = await getWorkerWorkHistory(id) as any[];
    const materialHistory = await getWorkerMaterials(id) as any[];

    if (!worker) {
        return <div className="p-5">Worker not found</div>;
    }

    return (
        <div className="p-5 pb-24 space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-slate-900">{worker.name}</h1>
                <p className="text-slate-500 text-sm">Joined {format(new Date(worker.joined_at), 'MMMM d, yyyy')}</p>
            </header>

            {/* Month Stats */}
            <div className="bg-indigo-600 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
                <h2 className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-4">This Month</h2>
                <div className="flex justify-between items-end">
                    <div>
                        <span className="text-3xl font-bold block">₹{stats.net_salary.toLocaleString()}</span>
                        <span className="text-indigo-200 text-xs">Net Payable</span>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-indigo-200">Production</div>
                        <div className="font-semibold">₹{stats.earnings.toLocaleString()}</div>
                        <div className="text-xs text-rose-300 mt-1">Materials</div>
                        <div className="font-semibold text-rose-200">- ₹{stats.deductions.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Work History */}
                <div>
                    <h3 className="font-bold text-slate-900 mb-3">Work History</h3>
                    <div className="space-y-3">
                        {workHistory.map((work) => (
                            <div key={work.id} className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between items-center text-sm">
                                <div>
                                    <div className="font-semibold">{work.quantity} pcs</div>
                                    <div className="text-slate-400 text-xs">{format(new Date(work.date), 'MMM d')}</div>
                                </div>
                                <div>
                                    <WorkStatusUpdater id={work.id} status={work.status} />
                                </div>
                            </div>
                        ))}
                        {workHistory.length === 0 && <p className="text-slate-400 text-xs">No work history.</p>}
                    </div>
                </div>

                {/* Material History */}
                <div>
                    <h3 className="font-bold text-slate-900 mb-3">Material Usage</h3>
                    <div className="space-y-3">
                        {materialHistory.map((mat) => (
                            <div key={mat.id} className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between items-center text-sm">
                                <div>
                                    <div className="font-semibold text-slate-700">{mat.name}</div>
                                    <div className="text-slate-400 text-xs">{format(new Date(mat.date), 'MMM d')}</div>
                                </div>
                                <div className="font-bold text-rose-500">
                                    - ₹{mat.cost}
                                </div>
                            </div>
                        ))}
                        {materialHistory.length === 0 && <p className="text-slate-400 text-xs">No materials used.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
