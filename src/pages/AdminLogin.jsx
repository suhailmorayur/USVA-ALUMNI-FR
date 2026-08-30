import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const { admin, loginAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (admin) {
      navigate('/admin');
    }
  }, [admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLocalLoading(true);
    setError('');

    try {
      const result = await loginAdmin(email.trim(), password);
      if (!result.success) {
        setError(result.message || 'Invalid administrative credentials');
      }
    } catch (err) {
      setError('Administrative server connection error.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500 rounded-full opacity-5 blur-3xl"></div>

      <div className="max-w-md w-full bg-slate-800 rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden relative z-10">
        
        {/* Header */}
        <div className="bg-slate-950 p-6 text-white text-center border-b border-slate-800">
          <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-teal-400" />
          <h2 className="text-xl font-bold uppercase tracking-wide">USVA Console</h2>
          <p className="text-slate-500 text-xs mt-1">Administrative Access Panel</p>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs">
              <span className="font-bold">Access Denied:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@usva.org"
                  className="w-full bg-slate-700/40 border border-slate-600 focus:border-teal-500 text-slate-100 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/10 transition text-sm font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password font-semibold" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Security Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-700/40 border border-slate-600 focus:border-teal-500 text-slate-100 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/10 transition text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={localLoading || loading}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition flex justify-center items-center gap-1.5"
            >
              {(localLoading || loading) ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Authenticate Admin Session'
              )}
            </button>
          </form>

          <div className="border-t border-slate-700/60 pt-6 text-center text-xs">
            <Link to="/" className="text-slate-400 hover:text-slate-200 inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Campaign Website
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
