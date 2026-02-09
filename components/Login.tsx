
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase/supabaseClient';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 max-w-sm w-full"
      >
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-gray-900 to-gray-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
            <Lock size={24} />
          </div>
          <h2 className="text-2xl font-black text-black tracking-tight">Acceso Admin</h2>
          <p className="text-gray-400 text-[10px] mt-2 uppercase tracking-[0.2em] font-black">Mundo Mágico</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-gray-900 transition-all font-bold text-gray-700"
                placeholder="admin@ejemplo.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-gray-900 transition-all font-bold text-gray-700"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <p className="text-red-500 text-center text-[10px] font-bold uppercase tracking-wider">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white font-black text-xs py-5 rounded-2xl shadow-xl shadow-gray-200 hover:bg-black transition-all flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Entrar al Panel'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
