import { getDashboardStats } from '@/lib/data';
import Link from 'next/link';
import { PlusCircle, Users, Package, FileBarChart } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="p-5 space-y-8 pb-24">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
        <p className="text-slate-500 text-sm font-medium">Here's what's happening today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Completed Today</span>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-slate-900">{stats.piecesToday}</span>
            <span className="text-sm text-slate-400 mb-1">pcs</span>
          </div>
        </div>

        <div className="col-span-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
          <span className="text-amber-600 text-xs font-semibold uppercase tracking-wider">Pending</span>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-slate-900">{stats.pendingPieces}</span>
            <span className="text-sm text-slate-400 mb-1">pcs</span>
          </div>
        </div>

        <div className="col-span-2 bg-emerald-500 p-5 rounded-2xl shadow-lg relative overflow-hidden text-white">
          <div className="relative z-10">
            <span className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">Estimated Date Profit</span>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-4xl font-bold">₹{stats.profitToday.toLocaleString()}</span>
            </div>
          </div>
          <FileBarChart className="absolute -right-4 -bottom-4 w-32 h-32 text-emerald-400/30" />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/work/new" className="bg-indigo-600 active:bg-indigo-700 text-white p-4 rounded-xl flex flex-col items-center justify-center gap-2 shadow-indigo-200 shadow-md transition-transform active:scale-95">
            <PlusCircle size={28} strokeWidth={2.5} />
            <span className="font-semibold text-sm">New Work</span>
          </Link>

          <Link href="/materials/new" className="bg-white border border-slate-200 active:bg-slate-50 text-slate-700 p-4 rounded-xl flex flex-col items-center justify-center gap-2 shadow-sm transition-transform active:scale-95">
            <Package size={28} className="text-rose-500" />
            <span className="font-semibold text-sm">Add Material</span>
          </Link>

          <Link href="/workers" className="bg-white border border-slate-200 active:bg-slate-50 text-slate-700 p-4 rounded-xl flex flex-col items-center justify-center gap-2 shadow-sm transition-transform active:scale-95">
            <Users size={28} className="text-blue-500" />
            <span className="font-semibold text-sm">Workers</span>
          </Link>

          <Link href="/ledger" className="bg-white border border-slate-200 active:bg-slate-50 text-slate-700 p-4 rounded-xl flex flex-col items-center justify-center gap-2 shadow-sm transition-transform active:scale-95">
            <FileBarChart size={28} className="text-emerald-500" />
            <span className="font-semibold text-sm">Full Ledger</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
