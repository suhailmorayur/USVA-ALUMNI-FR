import React, { useState } from 'react';
import axios from 'axios';
import { Search, Loader2, Award, Clock, CheckCircle2, ShieldAlert, XCircle, ArrowRight, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Status = () => {
  const [searchType, setSearchType] = useState('admissionNumber'); // 'admissionNumber' or 'email'
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const paramName = searchType === 'email' ? 'email' : 'admissionNumber';
      const res = await axios.get(`/api/members/status-check?${paramName}=${encodeURIComponent(searchValue.trim())}`);
      if (res.data.success) {
        setResult(res.data.data);
      } else {
        setError(res.data.message || 'Status search failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'No active registration found matching the search details.');
    } finally {
      setLoading(false);
    }
  };

  // Timeline render helpers
  const getStatusDetails = (appStatus, payStatus) => {
    if (payStatus === 'failed') {
      return {
        title: 'Payment Failed',
        color: 'text-red-700 bg-red-50 border-red-200',
        desc: 'Payment failed. Please try again.'
      };
    }

    switch (appStatus) {
      case 'draft':
        return {
          title: 'Draft Saved',
          color: 'text-slate-600 bg-slate-50 border-slate-200',
          desc: 'Your profile has been created, but payment has not been initiated. Please complete your payment.'
        };
      case 'payment_pending':
        return {
          title: 'Payment Pending',
          color: 'text-amber-600 bg-amber-50 border-amber-200',
          desc: 'Registration profile saved. Awaiting secure payment confirmation. Click below to complete your payment.'
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
          desc: 'Congratulations! Your alumni membership is approved. Your digital card is ready.'
        };
      case 'rejected':
        return {
          title: 'Application Rejected',
          color: 'text-red-700 bg-red-50 border-red-200',
          desc: 'Your application was rejected during review. Please contact administration for further details.'
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
            
            {/* Search Type Selector */}
            <div className="flex gap-4 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setSearchType('admissionNumber');
                  setSearchValue('');
                  setError('');
                }}
                className={`flex-1 text-center py-2 text-xs font-bold uppercase rounded-md tracking-wider transition ${searchType === 'admissionNumber' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                By Ad. No
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchType('email');
                  setSearchValue('');
                  setError('');
                }}
                className={`flex-1 text-center py-2 text-xs font-bold uppercase rounded-md tracking-wider transition ${searchType === 'email' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                By Email
              </button>
            </div>

            <div className="space-y-1">
              <label htmlFor="searchValue" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {searchType === 'email' ? 'Registered Email Address' : 'Academy Admission Number'}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type={searchType === 'email' ? 'email' : 'text'}
                    id="searchValue"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={searchType === 'email' ? 'e.g. suhail@example.com' : 'e.g. 1098'}
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
              const isPaymentPending = result.paymentStatus === 'pending' || result.applicationStatus === 'payment_pending';
              const isPaymentFailed = result.paymentStatus === 'failed';
              const isApproved = ['approved', 'card_generated', 'email_sent'].includes(result.applicationStatus);

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
                          : isPaymentFailed
                          ? 'bg-red-600 border-white text-white'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                        {isPaymentFailed ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <span className={`text-[10px] font-bold ${
                        result.paymentStatus === 'paid' 
                          ? 'text-slate-600' 
                          : isPaymentFailed
                          ? 'text-red-600'
                          : 'text-slate-400'
                      }`}>
                        {isPaymentFailed ? 'Failed' : 'Paid'}
                      </span>
                    </div>

                    {/* Step 3: Verified */}
                    <div className="flex flex-col items-center gap-1.5 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm ${
                        isApproved
                          ? 'bg-teal-600 border-white text-white'
                          : result.applicationStatus === 'under_review' || result.applicationStatus === 'payment_completed'
                          ? 'bg-amber-500 border-white text-white animate-pulse'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold ${
                        isApproved || result.applicationStatus === 'under_review' || result.applicationStatus === 'payment_completed' 
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

                  {/* Actions Area */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    {(isPaymentPending || isPaymentFailed) && result._id && (
                      <Link
                        to={`/payment?id=${result._id}`}
                        className="w-full bg-teal-700 hover:bg-teal-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition flex justify-center items-center gap-2 text-sm uppercase tracking-wider"
                      >
                        <CreditCard className="w-4 h-4" />
                        {isPaymentFailed ? 'REPAY NOW' : 'COMPLETE PAYMENT / REPAY NOW'}
                      </Link>
                    )}

                    {isApproved && (
                      <Link
                        to="/download"
                        className="w-full bg-teal-700 hover:bg-teal-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition flex justify-center items-center gap-2 text-sm uppercase tracking-wider"
                      >
                        <Award className="w-4 h-4" />
                        Download Membership Card
                      </Link>
                    )}

                    <div className="flex justify-center pt-2">
                      <Link
                        to="/download"
                        className="text-teal-700 hover:text-teal-800 text-xs font-bold inline-flex items-center gap-1 group"
                      >
                        Go to Card Download Page <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                      </Link>
                    </div>
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
