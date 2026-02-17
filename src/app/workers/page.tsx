import Link from 'next/link';
import { getWorkers } from '@/lib/data';
import { UserPlus, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function WorkersPage() {
    const workers = await getWorkers();

    return (
        <div className="p-5 pb-24 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Workers</h1>
                <Link href="/workers/new" className="bg-indigo-600 text-white p-2 rounded-full shadow-lg active:scale-95 transition-transform">
                    <UserPlus size={24} />
                </Link>
            </div>

            <div className="grid gap-3">
                {workers.map((worker: any) => (
                    <Link key={worker.id} href={`/workers/${worker.id}`} className="block">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{worker.name}</h3>
                                    <p className="text-sm text-slate-500">Rate: ₹{worker.labour_rate}/pc</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${worker.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {worker.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
                {workers.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                        No workers found. Add one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
