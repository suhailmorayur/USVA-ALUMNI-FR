import React, { useState } from 'react';
import axios from 'axios';
import { Search, Loader2, Award, Clock, CheckCircle2, ShieldAlert, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Status = () => {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!admissionNumber.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await axios.get(`/api/members/status-check?admissionNumber=${encodeURIComponent(admissionNumber.trim())}`);
      if (res.data.success) {
        setResult(res.data.data);
      } else {
        setError(res.data.message || 'Status search failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'No active registration found for this admission number.');
    } finally {
      setLoading(false);
    }
  };

  // Timeline render helpers
  const getStatusDetails = (appStatus, payStatus) => {
    switch (appStatus) {
      case 'draft':
        return {
          title: 'Draft Saved',
          color: 'text-slate-600 bg-slate-50 border-slate-200',
          desc: 'Your profile has been created, but payment has not been initiated. Please log in and complete your payment.'
        };
      case 'payment_pending':
        return {
          title: 'Payment Pending',
          color: 'text-amber-600 bg-amber-50 border-amber-200',
          desc: 'Registration profile saved. Awaiting secure UPI payment check. Click dashboard to pay.'
        };
      case 'payment_completed':
        return {
          title: 'Screenshot Submitted / Reviewing Payment',
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          desc: 'You submitted a payment receipt. Our admin board is manually verifying the transaction ledger.'
        };
      case 'under_review':
        return {
          title: 'Under Administrative Review',
          color: 'text-blue-700 bg-blue-50 border-blue-200',
          desc: 'Your payment is secured! The executive board is currently verifying your graduation and admission records.'
        };
      case 'approved':
      case 'card_generated':
      case 'email_sent':
        return {
          title: 'Membership Approved ✓',
          color: 'text-teal-700 bg-teal-50 border-teal-200',
          desc: 'Congratulations! Your alumni membership is approved. Your digital card has been sent to your email.'
        };
      case 'rejected':
        return {
          title: 'Application Rejected',
          color: 'text-red-700 bg-red-50 border-red-200',
          desc: 'Your application was rejected during review. Please log in to your student dashboard to see details and make corrections.'
        };
      default:
        return {
          title: 'Processing',
          color: 'text-slate-500 bg-slate-50 border-slate-200',
          desc: 'Awaiting status update.'
        };
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <Clock className="w-12 h-12 text-teal-700 mx-auto" />
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Track Application</h1>
          <p className="text-slate-500">Track your registration & card status instantly</p>
        </div>

        {/* Search Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="adNumber" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Academy Admission Number</label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    id="adNumber"
                    value={admissionNumber}
                    onChange={(e) => setAdmissionNumber(e.target.value)}
                    placeholder="Enter your admission number"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-teal-700 hover:bg-teal-600 text-white font-bold px-6 rounded-xl flex items-center justify-center gap-1.5 shadow transition shrink-0"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl text-center text-sm">
            {error}
          </div>
        )}

        {/* Results Panel */}
        {result && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Registered Scholar</span>
                <span className="text-lg font-black text-slate-800 uppercase">{result.fullName}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Submitted On</span>
                <span className="text-xs text-slate-600 font-semibold">{new Date(result.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Display block */}
            {(() => {
              const details = getStatusDetails(result.applicationStatus, result.paymentStatus);
              return (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border text-sm ${details.color}`}>
                    <span className="font-bold block text-base mb-1">{details.title}</span>
                    <p className="leading-relaxed opacity-95">{details.desc}</p>
                  </div>

                  {/* Horizontal Timeline Tracker */}
                  <div className="pt-4 flex justify-between items-center text-center relative max-w-sm mx-auto">
                    {/* Line behind */}
                    <div className="absolute left-[10%] right-[10%] top-[14px] h-[2px] bg-slate-200 -z-10"></div>
                    
                    {/* Step 1: Registered */}
                    <div className="flex flex-col items-center gap-1.5 flex-1">
                      <div className="w-8 h-8 rounded-full bg-teal-600 border border-white text-white flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">Register</span>
                    </div>

                    {/* Step 2: Paid */}
                    <div className="flex flex-col items-center gap-1.5 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm ${
                        result.paymentStatus === 'paid' 
                          ? 'bg-teal-600 border-white text-white' 
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold ${result.paymentStatus === 'paid' ? 'text-slate-600' : 'text-slate-400'}`}>Paid</span>
                    </div>

                    {/* Step 3: Verified */}
                    <div className="flex flex-col items-center gap-1.5 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm ${
                        ['approved', 'card_generated', 'email_sent'].includes(result.applicationStatus)
                          ? 'bg-teal-600 border-white text-white'
                          : result.applicationStatus === 'under_review' || result.applicationStatus === 'payment_completed'
                          ? 'bg-amber-500 border-white text-white animate-pulse'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold ${
                        ['approved', 'card_generated', 'email_sent', 'under_review', 'payment_completed'].includes(result.applicationStatus) 
                          ? 'text-slate-600' 
                          : 'text-slate-400'
                      }`}>Verify</span>
                    </div>

                    {/* Step 4: Card */}
                    <div className="flex flex-col items-center gap-1.5 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm ${
                        ['card_generated', 'email_sent'].includes(result.applicationStatus)
                          ? 'bg-teal-600 border-white text-white'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                        <Award className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold ${
                        ['card_generated', 'email_sent'].includes(result.applicationStatus) 
                          ? 'text-slate-600' 
                          : 'text-slate-400'
                      }`}>Card</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6 flex justify-center">
                    <Link
                      to="/download"
                      className="text-teal-700 hover:text-teal-800 text-xs font-bold inline-flex items-center gap-1 group"
                    >
                      Go to Card Download Page <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

      </div>
    </div>
  );
};

export default Status;
