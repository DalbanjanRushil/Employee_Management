'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Briefcase, FileText } from 'lucide-react';
import clsx from 'clsx';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', href: '/', icon: LayoutDashboard },
        { name: 'Workers', href: '/workers', icon: Users },
        { name: 'Work', href: '/work', icon: Briefcase },
        { name: 'Ledger', href: '/ledger', icon: FileText },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                'flex flex-col items-center justify-center w-full h-full space-y-1',
                                isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                            )}
                        >
                            <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
