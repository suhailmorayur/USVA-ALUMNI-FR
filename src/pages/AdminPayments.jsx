import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from '../components/AdminNav';
import { Loader2, CreditCard, Search, RefreshCw, AlertCircle, Calendar } from 'lucide-react';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [triggerFetch, setTriggerFetch] = useState(0);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');
    try {
      // Find all payments
      const res = await axios.get('/api/admin/members?limit=100'); // We query members and map payments, or fetch payments directly
      // Let's write a backend endpoint if needed, or query members and extract paid transactions.
      // Wait, let's look at backend routes: we didn't specify a separate payments GET route, but we can query members and display their payment status,
      // OR we can add a route `GET /api/admin/payments` on the backend!
      // Wait! Let's check: in `adminRoutes.js`, did we mount `GET /admin/payments`?
      // Ah! In `adminRoutes.js`, we did NOT mount `GET /admin/payments`.
      // Can we add it? Yes, but wait! We can also just fetch all members and filter them on the client side, or we can add it to the backend.
      // Wait! Let's check if we can query member details. Yes, querying `/api/admin/members` lets us see `paymentStatus` and search/filter by it!
      // But having a direct backend route `GET /api/admin/payments` to query the `Payment` collection directly is extremely robust.
      // Let's check if we can implement a controller function `getPayments` in `adminController.js` and mount it:
      // Yes! In `adminController.js`, let's add `getPayments`:
      // ```javascript
      // const getPayments = async (req, res) => {
      //   try {
      //     const payments = await Payment.find().populate('memberId').sort({ createdAt: -1 });
      //     res.json({ success: true, data: payments });
      //   } catch (error) {
      //     res.status(500).json({ success: false, message: 'Failed to fetch payments ledger' });
      //   }
      // };
      // ```
      // This is super clean! Let's modify `adminController.js` and `adminRoutes.js` to support this.
      // Wait, let's see. If we write it client-side by querying members, it's also very easy. But direct database query is way better.
      // Let's check: since we have `adminController.js` already, let's add `getPayments` to it and add the route `GET /api/admin/payments` in `adminRoutes.js`!
      // Let's do that!
    } catch (err) {}
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col md:flex-row">
      <AdminNav />
      {/* Fallback layout: we can implement it by pulling from `/api/admin/members?payStatus=paid` which is extremely clean and already exists in our APIs! */}
      <div className="flex-grow p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Payments Ledger</h1>
          <p className="text-slate-500 text-sm">Secured campaign transaction records</p>
        </div>

        <PaymentsList />
      </div>
    </div>
  );
};

// Sub-component fetching paid/created members from `/api/admin/members`
const PaymentsList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(''); // paid, pending, failed

  const fetchRecords = async () => {
    setLoading(true);
    setError('');
    try {
      // Get all members, since our member list endpoint returns payment details, and allows filtering by paymentStatus
      const res = await axios.get('/api/admin/members', {
        params: {
          limit: 100,
          payStatus: filter
        }
      });
      if (res.data.success) {
        // Filter out those that have a payment record or payment pending/completed status
        setRecords(res.data.data.members.filter(m => m.paymentStatus !== 'pending' || m.applicationStatus === 'payment_completed'));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve transaction details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [filter]);

  return (
    <div className="space-y-6">
      
      {/* Filter Tabs */}
      <div className="flex bg-white p-1 rounded-lg border max-w-xs shadow-xs">
        <button
          onClick={() => setFilter('')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${
            filter === '' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All Paid
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${
            filter === 'paid' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          UPI Verified
        </button>
        <button
          onClick={() => setFilter('failed')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${
            filter === 'failed' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Failed Transactions
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
          <span className="text-sm font-bold text-slate-500 animate-pulse">Syncing payment records...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 border border-red-200 p-5 rounded-xl text-center text-sm">
          {error}
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white p-10 rounded-xl border border-slate-200 text-center space-y-2">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-lg font-bold text-slate-700">No Transactions Found</h2>
          <p className="text-slate-400 text-sm">No transaction audit rows fit the active filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse text-left text-sm text-slate-500">
              <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b">
                <tr>
                  <th scope="col" className="px-6 py-4">Student</th>
                  <th scope="col" className="px-6 py-4">Admission No</th>
                  <th scope="col" className="px-6 py-4">Payment Method</th>
                  <th scope="col" className="px-6 py-4">Receipt Proof</th>
                  <th scope="col" className="px-6 py-4">Payment Status</th>
                  <th scope="col" className="px-6 py-4">Verification State</th>
                  <th scope="col" className="px-6 py-4">Registration Date</th>
                  <th scope="col" className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 border-t">
                {records.map((member) => (
                  <tr key={member._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3 font-semibold text-slate-800 uppercase">
                      <div className="flex flex-col">
                        <span>{member.fullName}</span>
                        <span className="text-[10px] text-slate-400 lowercase font-normal">{member.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-mono font-semibold">{member.admissionNumber}</td>
                    <td className="px-6 py-3 text-xs">UPI checkout</td>
                    <td className="px-6 py-3 text-xs">
                      {member.applicationStatus === 'payment_completed' ? (
                        <span className="text-blue-700 font-bold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase">Screenshot Uploaded</span>
                      ) : (
                        <span className="text-slate-400 font-normal">Razorpay Verified</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        member.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>{member.paymentStatus}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-xs font-semibold uppercase">{member.applicationStatus === 'email_sent' ? 'Emailed' : member.applicationStatus === 'card_generated' ? 'Compiled' : member.applicationStatus}</span>
                    </td>
                    <td className="px-6 py-3 text-xs">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(member.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <Link
                        to={`/admin/members/${member._id}`}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1 transition"
                      >
                        Open Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
