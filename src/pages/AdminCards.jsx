import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminNav from '../components/AdminNav';
import { Loader2, Award, Calendar, Eye, Download, RefreshCw, AlertCircle } from 'lucide-react';

const AdminCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCardRecords = async () => {
    setLoading(true);
    setError('');
    try {
      // Query members who are approved/card generated
      const res = await axios.get('/api/admin/members?limit=100&appStatus=card_generated');
      const res2 = await axios.get('/api/admin/members?limit=100&appStatus=email_sent');
      const res3 = await axios.get('/api/admin/members?limit=100&appStatus=approved');
      
      if (res.data.success) {
        const list = [
          ...(res.data.data.members || []),
          ...(res2.data.data.members || []),
          ...(res3.data.data.members || [])
        ];
        
        // Remove duplicates if any
        const uniqueList = list.filter((value, index, self) => 
          self.findIndex(v => v._id === value._id) === index
        );

        setCards(uniqueList);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch compiled card records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardRecords();
  }, []);

  const handleRegenerate = async (id) => {
    if (!window.confirm('Recompile card? This will increment the card version.')) return;
    
    setActionLoading(true);
    try {
      const res = await axios.post(`/api/admin/members/${id}/generate-card`);
      if (res.data.success) {
        alert(res.data.message);
        fetchCardRecords();
      }
    } catch (err) {
      console.error(err);
      alert('Regeneration failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col md:flex-row">
      <AdminNav />

      {/* Main Panel */}
      <div className="flex-grow p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Membership Cards</h1>
            <p className="text-slate-500 text-sm">Monitor generated card assets, versions, and public verification links</p>
          </div>
          <button
            onClick={fetchCardRecords}
            className="bg-white border rounded-lg p-2 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
            <span className="text-sm font-bold text-slate-500 animate-pulse">Syncing compiled card list...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 border border-red-200 p-5 rounded-xl text-center text-sm">
            {error}
          </div>
        ) : cards.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border border-slate-200 text-center space-y-2">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-lg font-bold text-slate-700">No Cards Compiled</h2>
            <p className="text-slate-400 text-sm">No approved membership card records exist yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse text-left text-sm text-slate-500">
                <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b">
                  <tr>
                    <th scope="col" className="px-6 py-4">Student</th>
                    <th scope="col" className="px-6 py-4">Membership ID</th>
                    <th scope="col" className="px-6 py-4">Admission No</th>
                    <th scope="col" className="px-6 py-4">Card Status</th>
                    <th scope="col" className="px-6 py-4">Created Date</th>
                    <th scope="col" className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 border-t">
                  {cards.map((member) => (
                    <tr key={member._id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-3 font-semibold text-slate-800 uppercase">
                        <div className="flex flex-col">
                          <span>{member.fullName}</span>
                          <span className="text-[10px] text-slate-400 lowercase font-normal">{member.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 font-mono font-bold text-slate-900 text-xs">{member.membershipId}</td>
                      <td className="px-6 py-3 font-mono font-semibold">{member.admissionNumber}</td>
                      <td className="px-6 py-3 text-xs">
                        <span className="text-teal-700 font-bold bg-teal-50 border border-teal-100 px-2 py-0.5 rounded uppercase">Active Compiled</span>
                      </td>
                      <td className="px-6 py-3 text-xs">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(member.updatedAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/admin/members/${member._id}`}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1 transition"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>
                          <button
                            onClick={() => handleRegenerate(member._id)}
                            disabled={actionLoading}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1 border transition"
                            title="Recompile card layout"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Recompile
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminCards;
