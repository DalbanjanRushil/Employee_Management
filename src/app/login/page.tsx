'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, X, User, Lock, Phone } from 'lucide-react';

export default function LoginPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (password !== mobile) {
            setIsLoading(false);
            setError("Invalid credentials. Please use your mobile number as password.");
            return;
        }

        try {
            const result = await signIn('credentials', {
                redirect: false,
                mobile,
                password,
                callbackUrl: '/'
            });

            if (result?.error) {
                setError('Access Denied. Incorrect Mobile Number.');
                setIsLoading(false);
            } else if (result?.ok) {
                // Successful login
                router.push('/');
                router.refresh();
            } else {
                // Unexpected state
                setIsLoading(false);
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            console.error("Login exception:", err);
            setError('Something went wrong. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
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
                        onClick={() => setIsModalOpen(true)}
                        className="w-full group relative flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                    >
                        <User className="w-5 h-5 text-indigo-300" />
                        <span>Secure Login</span>
                    </button>

                    <p className="mt-6 text-xs text-slate-400">
                        Authorized Personnel Only
                    </p>
                </div>

            </main>

            {/* Login Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsModalOpen(false)}
                    />

                    <div className="bg-white w-full max-w-xs rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6 text-center">
                            <h3 className="text-lg font-bold text-slate-900">Welcome Back</h3>
                            <p className="text-xs text-slate-500 mt-1">Enter your mobile number to continue</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700 ml-1">Mobile Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="tel"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        placeholder="Enter mobile number"
                                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-sm"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Hinting that password is same as mobile, or just asking for it? User said "same as mobile number". 
                   We will verify implicitly or explicitly. Let's ask for it to be explicit as a "Password" field for security feel, 
                   or just one field? "login with mobile number and same the mobile number as password" implies credentials check.
                   I'll hide the password complexity by just asking for "Mobile" and "Security Code (Mobile)" or just verifying mobile.
                   HOWEVER, standard auth requires a password field usually.
                   Let's asking for "Verify Mobile Number" as the second field to act as password.
               */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700 ml-1">Confirm Mobile Number</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Repeat mobile number"
                                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                                    <p className="text-xs text-rose-600 font-medium text-center">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Access System"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
