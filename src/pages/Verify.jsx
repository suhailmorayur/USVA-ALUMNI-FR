import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, XCircle, ShieldAlert, Award, Loader2, Calendar } from 'lucide-react';

const Verify = () => {
  const params = useParams();
  const location = useLocation();
  const rawId = params.membershipId || params['*'] || location.pathname.replace(/^\/verify\/?/, '');
  const membershipId = decodeURIComponent(rawId).trim();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const performVerification = async () => {
      setLoading(true);
      setError('');
      setResult(null);
      
      try {
        const res = await axios.get(`/api/verify/${encodeURIComponent(membershipId)}`);
        if (res.data.success) {
          setResult(res.data.data);
        } else {
          setError(res.data.message || 'Membership verification failed');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Membership Not Found');
      } finally {
        setLoading(false);
      }
    };

    if (membershipId) {
      performVerification();
    }
  }, [membershipId]);

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl border border-slate-700/80 shadow-2xl p-8 space-y-6 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-teal-500 rounded-full opacity-5 blur-3xl"></div>

        {/* Association branding */}
        <div className="text-center space-y-1">
          <Award className="w-10 h-10 text-teal-400 mx-auto" />
          <h1 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">USVA Verification</h1>
          <p className="text-[10px] text-slate-500">Umariyya Students Venerable Association</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
            <span className="text-sm font-bold text-slate-400 animate-pulse">Running verification check...</span>
          </div>
        ) : error ? (
          <div className="text-center py-6 space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white tracking-tight">{error}</h2>
              <p className="text-xs text-slate-500 leading-normal max-w-xs mx-auto">
                {error === 'Membership Inactive' 
                  ? 'This card is associated with a membership that is pending review, suspended, or expired.'
                  : 'The membership code scanned is invalid or not registered in our records.'}
              </p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2.5 rounded-xl inline-block font-semibold">
              Verification Failed
            </div>
          </div>
        ) : (
          <div className="space-y-6 pt-2">
            {/* Verification Success Banner */}
            <div className="text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white tracking-tight">Membership Verified ✓</h2>
                <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Active Member
                </span>
              </div>
            </div>

            {/* Verification Fields Card */}
            <div className="bg-slate-700/35 border border-slate-700 p-5 rounded-2xl space-y-3 text-sm">
              <div className="flex justify-between items-center border-b border-slate-700/60 pb-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Name</span>
                <span className="text-white font-extrabold uppercase">{result.fullName}</span>
              </div>
              
              {result.sand && (
                <div className="flex justify-between items-center border-b border-slate-700/60 pb-2">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Sanad</span>
                  <span className="text-teal-300 font-bold uppercase">{result.sand}</span>
                </div>
              )}

              <div className="flex justify-between items-center border-b border-slate-700/60 pb-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Membership ID</span>
                <span className="text-white font-bold font-mono">{result.membershipId}</span>
              </div>

              <div className="flex justify-between items-center pb-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Validity</span>
                <span className="text-white font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" /> {result.validity}
                </span>
              </div>
            </div>

            {/* Security footer disclaimer */}
            <div className="text-[10px] text-slate-500 text-center leading-normal">
              This verification record is retrieved securely in real-time from the USVA database registry. Protect student privacy.
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Verify;
