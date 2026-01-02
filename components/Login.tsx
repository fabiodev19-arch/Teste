import React, { useState } from 'react';
import { Lock, LogIn, ShieldAlert } from 'lucide-react';
import { UserRole, User } from '../types';
import { supabase } from '../lib/supabase';

interface LoginProps {
    onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isRegistering) {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (signUpError) throw signUpError;

                alert('Conta criada! Verifique seu e-mail ou faça login (se o e-mail não precisar de confirmação).');
                setIsRegistering(false);
            } else {
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (signInError) throw signInError;

                if (data.user) {
                    // Fetch profile to get role
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', data.user.id)
                        .single();

                    if (profileError) throw profileError;

                    const loggedUser: User = {
                        username: data.user.email || 'User',
                        role: profile?.role as UserRole || 'UNIVERSAL',
                    };

                    onLogin(loggedUser);
                }
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro.');
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans border-t-8 border-excalibur">
            <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
                {/* Branding */}
                <div className="text-center mb-10">
                    <div className="inline-block bg-white p-0 brutal-border mb-4 overflow-hidden">
                        <img src="/logo-excalibur.jpg" alt="Excalibur Logo" className="w-32 h-auto" />
                    </div>
                    <h1 className="text-5xl font-black italic tracking-tighter text-black uppercase leading-none">
                        EXCALIBUR
                    </h1>
                    <p className="font-mono text-xs font-bold text-gray-400 mt-2 tracking-widest uppercase">
                        SISTEMA DE GESTÃO DE MANUTENÇÃO
                    </p>
                </div>

                {/* Login Form */}
                <div className={`brutal-border p-8 bg-white shadow-brutal transition-all duration-300 ${error ? 'border-red-600 translate-x-1 translate-y-1 shadow-none' : ''}`}>
                    <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
                        <Lock className={error ? 'text-red-600' : 'text-excalibur'} size={24} />
                        <h2 className="text-2xl font-black uppercase italic">{isRegistering ? 'CRIAR CONTA' : 'ACESSO RESTRITO'}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block font-mono text-xs font-bold uppercase mb-2 text-gray-400"
                            >
                                E-MAIL
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full brutal-border p-4 font-bold text-lg focus:outline-none focus:bg-gray-50 uppercase"
                                placeholder="vagner@excalibur.com"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block font-mono text-xs font-bold uppercase mb-2 text-gray-400"
                            >
                                SENHA
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full brutal-border p-4 font-bold text-lg focus:outline-none focus:bg-gray-50 uppercase"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 animate-shake">
                                <ShieldAlert size={18} />
                                <span className="font-bold text-[10px] uppercase">{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white p-6 brutal-border shadow-brutal flex items-center justify-between hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
                        >
                            <span className="font-bold text-2xl uppercase italic tracking-tight">
                                {loading ? 'AGUARDE...' : isRegistering ? 'CADASTRAR' : 'ENTRAR'}
                            </span>
                            <LogIn size={32} strokeWidth={3} />
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="w-full text-center font-mono text-[10px] font-bold uppercase text-gray-400 hover:text-black transition-colors"
                        >
                            {isRegistering ? 'JÁ TEM CONTA? ENTRA AQUI' : 'NÃO TEM CONTA? CADASTRE-SE'}
                        </button>
                    </form>
                </div>

                {/* Footer info */}
                <div className="text-center pt-8">
                    <div className="inline-block bg-white brutal-border px-3 py-1 text-black font-mono text-[10px] font-black italic mt-4">
                        VERSÃO 1.0.42 | PROTOCOLO EXCALIBUR
                    </div>
                </div>
            </div>
        </div>
    );
};
