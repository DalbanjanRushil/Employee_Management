'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function UserMenu({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                {user?.image ? (
                    <Image
                        src={user.image}
                        alt={user.name || "User"}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {user?.name?.[0] || 'A'}
                    </div>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                        <div className="px-4 py-3 border-b border-slate-50">
                            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="w-full text-left px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
