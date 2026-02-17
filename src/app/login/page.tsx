'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        await signIn('google', { callbackUrl: '/' });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="embroidery-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1" fill="#334155" />
                            <path d="M0 20 L40 20 M20 0 L20 40" stroke="#334155" strokeWidth="0.5" fill="none" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#embroidery-pattern)" />
                </svg>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-transparent to-slate-100/80 pointer-events-none" />

            <main className="z-10 w-full max-w-sm px-6 flex flex-col items-center text-center space-y-12">

                {/* Branding */}
                <div className="space-y-4 animate-fade-in-up">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-slate-200">
                        {/* Simple Logo Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Sanjay Dalbanjan<br />Embroidery
                    </h1>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                        Production Control Panel
                    </p>
                </div>

                {/* Emotional Hook */}
                <div className="space-y-2 animate-fade-in-up delay-100">
                    <p className="text-lg text-slate-700 font-medium leading-relaxed">
                        Track production. Control profit.<br />Reduce stress.
                    </p>
                </div>

                {/* Action */}
                <div className="w-full animate-fade-in-up delay-200">
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full group relative flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Connecting...</span>
                        ) : (
                            <>
                                <svg className="h-5 w-5 text-white/90" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span>Continue with Google</span>
                            </>
                        )}
                    </button>

                    <p className="mt-6 text-xs text-slate-400">
                        Secure Factory Access Only
                    </p>
                </div>

            </main>
        </div>
    );
}
