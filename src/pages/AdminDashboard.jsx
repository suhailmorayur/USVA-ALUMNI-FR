import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from '../components/AdminNav';
import { 
  Users, 
  CreditCard, 
  Clock, 
  UserCheck, 
  UserX, 
  Award, 
  Mail, 
  Loader2,
  TrendingUp,
  FileCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('/api/admin/dashboard');
        if (res.data.success) {
          setStats(res.data.data);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error(err);
        setError('Server error loading dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col md:flex-row">
      <AdminNav />

      {/* Main dashboard panel */}
      <div className="flex-grow p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Stats Dashboard</h1>
          <p className="text-slate-500 text-sm">Real-time statistics of USVA Alumni Campaign</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
            <span className="text-sm font-bold text-slate-500 animate-pulse">Gathering campaign details...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 border border-red-200 p-5 rounded-xl text-center text-sm">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Stats count grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Total Applications */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Total Submissions</span>
                  <span className="text-2xl font-black text-slate-800 leading-none">{stats?.totalApplications}</span>
                </div>
              </div>

              {/* Paid Applications */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Secured Payments</span>
                  <span className="text-2xl font-black text-slate-800 leading-none">{stats?.paidApplications}</span>
                </div>
              </div>

              {/* Pending Review */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-700 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Pending Review</span>
                  <span className="text-2xl font-black text-slate-800 leading-none">{stats?.pendingReview}</span>
                </div>
              </div>

              {/* Approved Members */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-700 shrink-0">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Approved Members</span>
                  <span className="text-2xl font-black text-slate-800 leading-none">{stats?.approvedMembers}</span>
                </div>
              </div>

              {/* Rejected Applications */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-700 shrink-0">
                  <UserX className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Rejected Profiles</span>
                  <span className="text-2xl font-black text-slate-800 leading-none">{stats?.rejectedApplications}</span>
                </div>
              </div>

              {/* Cards Generated */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-700 shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Cards Compiled</span>
                  <span className="text-2xl font-black text-slate-800 leading-none">{stats?.cardsGenerated}</span>
                </div>
              </div>

              {/* Emails Sent */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-700 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Cards Emailed</span>
                  <span className="text-2xl font-black text-slate-800 leading-none">{stats?.emailsSent}</span>
                </div>
              </div>

            </div>

            {/* General info block */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5 border-b pb-2"><TrendingUp className="w-5 h-5 text-teal-700" /> Active Operations Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 border rounded-lg">
                    <span className="font-semibold text-slate-600">Verification Rate</span>
                    <span className="font-extrabold text-teal-700">
                      {stats?.totalApplications > 0 ? Math.round((stats.approvedMembers / stats.totalApplications) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 border rounded-lg">
                    <span className="font-semibold text-slate-600">Email Delivery Rate</span>
                    <span className="font-extrabold text-teal-700">
                      {stats?.approvedMembers > 0 ? Math.round((stats.emailsSent / stats.approvedMembers) * 100) : 0}%
                    </span>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-500 space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1 text-xs uppercase"><FileCheck className="w-4 h-4 text-teal-700" /> Action Panel Tips</div>
                  <ul className="list-disc list-inside space-y-1.5">
                    <li>Open <strong>Applications list</strong> to review pending student records.</li>
                    <li>Verify payment screenshots manually under the detailed views.</li>
                    <li>Update campaign validity dates and fee indices in <strong>Campaign Settings</strong>.</li>
                    <li>Use <strong>Bulk Printing</strong> to assemble and download multi-card PDF prints.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
