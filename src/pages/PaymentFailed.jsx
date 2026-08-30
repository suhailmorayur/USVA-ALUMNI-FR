import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

const PaymentFailed = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-6">
        
        {/* Failure Warning Icon */}
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto">
          <AlertOctagon className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Payment Unsuccessful</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            The transaction was cancelled, timed out, or rejected by your UPI provider. Don't worry, your profile registration is saved as a draft.
          </p>
        </div>

        {/* Support Alert Box */}
        <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 text-xs text-red-700 leading-normal text-left space-y-1">
          <span className="font-bold block">Important Notice:</span>
          <span>
            If the amount has been debited from your bank account but the status is showing failed here, please upload a screenshot of your payment receipt in the payment panel, and we will verify it manually.
          </span>
        </div>

        {/* Retry & Home Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <Link
            to="/payment"
            className="w-full inline-flex justify-center items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-bold py-3.5 px-6 rounded-xl shadow transition"
          >
            <RefreshCw className="w-4 h-4" /> Retry UPI Payment
          </Link>
          <Link
            to="/"
            className="w-full inline-flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3.5 px-6 rounded-xl border transition"
          >
            <Home className="w-4 h-4" /> Back to Campaign Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PaymentFailed;
