import { createWorkOrder } from '@/lib/actions';
import { getWorkers } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function NewWorkPage() {
    const workers = await getWorkers();

    return (
        <div className="p-5 space-y-6 pb-24">
            <h1 className="text-2xl font-bold text-slate-900">Assign New Work</h1>

            <form action={createWorkOrder} className="space-y-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Worker</label>
                    <select
                        name="workerId"
                        required
                        className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">-- Choose Worker --</option>
                        {workers.map((w: any) => (
                            <option key={w.id} value={w.id}>{w.name} (Rate: {w.labour_rate})</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantity (Pieces)</label>
                    <input
                        name="quantity"
                        type="number"
                        required
                        placeholder="0"
                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price /pc</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-slate-400">₹</span>
                            <input
                                name="sellingPrice"
                                type="number"
                                step="0.1"
                                required
                                placeholder="0.0"
                                className="w-full p-3 pl-7 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Labour Rate /pc</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-slate-400">₹</span>
                            <input
                                name="labourRate"
                                type="number"
                                step="0.1"
                                required
                                placeholder="Default"
                                // Ideally we auto-fill this based on worker selection using client generic JS or just let user type
                                // For simplicity, user types or we can make it dynamic client side.
                                // Let's rely on user inputting or default 6.0?
                                // Better: just input.
                                className="w-full p-3 pl-7 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg mt-6 active:scale-95 transition-transform">
                    Assign Work
                </button>
            </form>
        </div>
    );
}
