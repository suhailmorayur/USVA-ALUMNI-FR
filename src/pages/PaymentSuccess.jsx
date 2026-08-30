import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, ArrowRight, Download, Mail, Award } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  
  // Extract state passed from redirection
  const { pdfUrl, membershipId, fullName, memberId } = location.state || {};

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
        
        {/* Success Icon */}
        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mx-auto">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Registration & Payment Secured!</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Your UPI payment proof has been successfully submitted and verified. Your USVA Alumni Membership has been auto-approved!
          </p>
        </div>

        {/* Card Generation Details Card */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-left space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Membership Card Details</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b pb-1.5 border-slate-200">
              <span className="text-slate-500 font-medium">Alumni Name:</span>
              <span className="font-bold text-slate-800">{fullName || 'Alumni Member'}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5 border-slate-200">
              <span className="text-slate-500 font-medium">Membership ID:</span>
              <span className="font-bold text-teal-700">{membershipId || 'ALUMNI-PENDING'}</span>
            </div>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
              <Mail className="w-4 h-4 text-teal-600 shrink-0" />
              <span>A high-resolution Portrait PDF copy has been sent to your registered email address.</span>
            </div>
          </div>
        </div>

        {/* Download PDF button */}
        {(memberId || pdfUrl) ? (
          <div className="space-y-3">
            <a
              href={memberId ? `${(axios.defaults.baseURL || '').replace(/\/$/, '')}/api/members/${memberId}/download-portrait` : pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex justify-center items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 text-lg"
            >
              <Download className="w-5 h-5" /> DOWNLOAD PORTRAIT PDF
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            <Link
              to="/download"
              className="w-full inline-flex justify-center items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition text-lg"
            >
              Go to Lookup Page <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}

        <div className="border-t pt-4">
          <Link
            to="/"
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition"
          >
            Back to Campaign Homepage
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;
