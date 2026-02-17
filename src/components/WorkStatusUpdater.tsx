'use client';

import { markWorkStatus } from '@/lib/actions';
import { clsx } from 'clsx';
import { CheckCircle, Clock, SearchCheck } from 'lucide-react';
import { useTransition } from 'react';

export default function WorkStatusUpdater({ id, status }: { id: number, status: string }) {
    const [isPending, startTransition] = useTransition();

    const handleNextStatus = () => {
        let next = status;
        if (status === 'PENDING') next = 'COMPLETED';
        else if (status === 'COMPLETED') next = 'CHECKED';

        if (next !== status) {
            startTransition(() => {
                markWorkStatus(id, next);
            });
        }
    };

    const config = {
        'PENDING': { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, label: 'Pending' },
        'COMPLETED': { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: CheckCircle, label: 'Done' },
        'CHECKED': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: SearchCheck, label: 'Verified' },
    }[status] || { color: 'bg-gray-100', icon: Clock, label: status };

    const Icon = config.icon;

    return (
        <button
            onClick={handleNextStatus}
            disabled={isPending || status === 'CHECKED'}
            className={clsx(
                "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95",
                config.color,
                isPending && "opacity-50 cursor-wait"
            )}
        >
            <Icon size={14} />
            <span>{isPending ? 'Saving...' : config.label}</span>
        </button>
    );
}
