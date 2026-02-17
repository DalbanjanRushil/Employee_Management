import { createWorker } from '@/lib/actions';

export default function NewWorkerPage() {
    return (
        <div className="p-5 space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Add New Worker</h1>

            <form action={createWorker} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                        name="name"
                        type="text"
                        required
                        placeholder="e.g. Rushil Dalbanjan"
                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Labour Rate (per piece)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-slate-400">₹</span>
                        <input
                            name="labourRate"
                            type="number"
                            step="0.1"
                            required
                            defaultValue="6.0"
                            className="w-full p-3 pl-8 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">This is the default rate. Can be overridden per job.</p>
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-xl shadow-lg active:scale-95 transition-transform mt-4">
                    Save Worker
                </button>
            </form>
        </div>
    );
}
