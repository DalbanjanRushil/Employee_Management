import { createMaterialUsage } from '@/lib/actions';
import { getWorkers } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function NewMaterialPage() {
    const workers = await getWorkers();

    return (
        <div className="p-5 space-y-6 pb-24">
            <h1 className="text-2xl font-bold text-slate-900">Record Material Usage</h1>

            <form action={createMaterialUsage} className="space-y-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Worker</label>
                    <select
                        name="workerId"
                        required
                        className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">-- Choose Worker --</option>
                        {workers.map((w: any) => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Material Name</label>
                    <input
                        name="name"
                        type="text"
                        required
                        placeholder="e.g. Thread, Ring, Oil"
                        list="material-suggestions"
                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <datalist id="material-suggestions">
                        <option value="Thread Box" />
                        <option value="Machine Oil" />
                        <option value="Ring 10 inch" />
                        <option value="Needles Packet" />
                    </datalist>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cost (Deduction)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-slate-400">₹</span>
                        <input
                            name="cost"
                            type="number"
                            step="0.1"
                            required
                            className="w-full p-3 pl-7 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <button type="submit" className="w-full bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg mt-6 active:scale-95 transition-transform">
                    Deduct & Save
                </button>
            </form>
        </div>
    );
}
