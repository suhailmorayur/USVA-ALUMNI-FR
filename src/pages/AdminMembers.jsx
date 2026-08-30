import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminNav from '../components/AdminNav';
import { Loader2, Search, Filter, RefreshCw, Eye, AlertCircle, Download, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminMembers = () => {
  const { adminToken } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  
  // Query parameters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sanad, setSanad] = useState('');
  const [place, setPlace] = useState('');
  const [appStatus, setAppStatus] = useState('');
  const [payStatus, setPayStatus] = useState('');
  
  const [triggerFetch, setTriggerFetch] = useState(0);

  const fetchMembers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/admin/members', {
        params: {
          page,
          limit: 15,
          search,
          sanad,
          place,
          appStatus,
          payStatus
        }
      });
      if (res.data.success) {
        setMembers(res.data.data.members);
        setTotal(res.data.data.total);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch members list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [page, triggerFetch]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;
    setDeleting(true);
    try {
      const response = await axios.delete(`/api/admin/members/${memberToDelete._id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (response.data.success) {
        setMembers(members.filter(m => m._id !== memberToDelete._id));
        setTotal(prev => prev - 1);
        setShowDeleteModal(false);
        setMemberToDelete(null);
        alert('Application deleted successfully.');
      } else {
        alert(response.data.message || 'Deletion failed.');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Server error deleting application.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setTriggerFetch(prev => prev + 1);
  };

  const handleReset = () => {
    setSearch('');
    setSanad('');
    setPlace('');
    setAppStatus('');
    setPayStatus('');
    setPage(1);
    setTriggerFetch(prev => prev + 1);
  };

  const parseSanadText = (sand) => {
    if (!sand || sand.length === 0) return '(empty)';
    if (sand.includes('umari') && sand.includes('faizy')) return 'Umari Faizy';
    if (sand.includes('umari')) return 'Umari';
    if (sand.includes('faizy')) return 'Faizy';
    return '';
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col md:flex-row">
      <AdminNav />

      {/* Main Panel */}
      <div className="flex-grow p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Applications Registry</h1>
            <p className="text-slate-500 text-sm">Review, verify, and approve member profiles</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="bg-white hover:bg-slate-50 border p-2 rounded-lg text-slate-600 transition"
              title="Reset Filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Filter Form */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone, ID..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/10 focus:border-teal-700 transition"
              />
            </div>

            {/* Place */}
            <div>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Place filter..."
                className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/10 focus:border-teal-700 transition"
              />
            </div>

            {/* Sanad */}
            <div>
              <select
                value={sanad}
                aria-label="Sanad Filter"
                onChange={(e) => setSanad(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/10 focus:border-teal-700 transition"
              >
                <option value="">All Sanads</option>
                <option value="umari">Umari</option>
                <option value="faizy">Faizy</option>
                <option value="none">No Sanad</option>
              </select>
            </div>

            {/* App Status */}
            <div>
              <select
                value={appStatus}
                aria-label="Application Status"
                onChange={(e) => setAppStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/10 focus:border-teal-700 transition"
              >
                <option value="">All App Status</option>
                <option value="under_review">Under Review</option>
                <option value="payment_pending">Payment Pending</option>
                <option value="payment_completed">Receipt Uploaded</option>
                <option value="approved">Approved</option>
                <option value="card_generated">Card Compiled</option>
                <option value="email_sent">Emailed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Actions */}
            <div>
              <button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-600 text-white font-bold py-2.5 rounded-lg text-sm shadow transition flex items-center justify-center gap-1.5"
              >
                <Filter className="w-4 h-4" /> Filter Registry
              </button>
            </div>

          </form>
        </div>

        {/* Members List Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
            <span className="text-sm font-bold text-slate-500 animate-pulse">Syncing registry records...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 border border-red-200 p-5 rounded-xl text-center text-sm">
            {error}
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border border-slate-200 text-center space-y-2">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-lg font-bold text-slate-700">No Applications Found</h2>
            <p className="text-slate-400 text-sm">No student registrations match the search filter query.</p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Responsive Table Container */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse text-left text-sm text-slate-500">
                  <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b">
                    <tr>
                      <th scope="col" className="px-6 py-4">Photo</th>
                      <th scope="col" className="px-6 py-4">Name</th>
                      <th scope="col" className="px-6 py-4">Sanad</th>
                      <th scope="col" className="px-6 py-4">Place</th>
                      <th scope="col" className="px-6 py-4">Ad. No</th>
                      <th scope="col" className="px-6 py-4">Phone</th>
                      <th scope="col" className="px-6 py-4">Status</th>
                      <th scope="col" className="px-6 py-4">Card ID</th>
                      <th scope="col" className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 border-t">
                    {members.map((member) => (
                      <tr key={member._id} className="hover:bg-slate-50/50">
                        
                        {/* Photo */}
                        <td className="px-6 py-3 shrink-0">
                          <img 
                            src={member.photoUrl} 
                            alt={member.fullName} 
                            className="w-10 h-10 object-cover rounded-md border shadow-sm"
                          />
                        </td>

                        {/* Name & Email */}
                        <td className="px-6 py-3 font-semibold text-slate-800 uppercase">
                          <div className="flex flex-col">
                            <span>{member.fullName}</span>
                            <span className="text-[10px] text-slate-400 lowercase font-normal">{member.email}</span>
                          </div>
                        </td>

                        {/* Sanad */}
                        <td className="px-6 py-3 font-medium text-slate-700 text-xs">
                          {parseSanadText(member.sand)}
                        </td>

                        {/* Place */}
                        <td className="px-6 py-3 font-medium text-slate-600">
                          {member.place}
                        </td>

                        {/* Admission No */}
                        <td className="px-6 py-3 font-mono font-semibold">
                          {member.admissionNumber}
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-3 text-xs">
                          {member.phone}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-3">
                          <div className="flex flex-col gap-1">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold inline-block text-center uppercase ${
                              member.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {member.paymentStatus}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold inline-block text-center uppercase ${
                              ['approved', 'card_generated', 'email_sent'].includes(member.applicationStatus)
                                ? 'bg-teal-50 text-teal-700'
                                : member.applicationStatus === 'rejected'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              {member.applicationStatus === 'email_sent' ? 'Emailed' : member.applicationStatus === 'card_generated' ? 'Compiled' : member.applicationStatus}
                            </span>
                          </div>
                        </td>

                        {/* Card ID */}
                        <td className="px-6 py-3 font-mono font-bold text-slate-800 text-xs">
                          {member.membershipId || '-'}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-3 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <Link
                              to={`/admin/members/${member._id}`}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1 transition"
                            >
                              <Eye className="w-3.5 h-3.5" /> Open
                            </Link>
                            {member.membershipId && (
                              <a
                                href={`${axios.defaults.baseURL || ''}/api/admin/members/${member._id}/download-landscape?token=${adminToken}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 font-bold px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1 transition"
                                title="Download Landscape Card"
                              >
                                <Download className="w-3.5 h-3.5" /> Landscape
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setMemberToDelete(member);
                                setShowDeleteModal(true);
                              }}
                              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1 transition"
                              title="Delete Application"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Simple Table Pagination */}
            <div className="flex justify-between items-center text-sm font-semibold text-slate-500 pt-2">
              <span>Total Registry: {total} records</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="bg-white border rounded px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Prev
                </button>
                <button
                  disabled={members.length < 15}
                  onClick={() => setPage(page + 1)}
                  className="bg-white border rounded px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">Delete Application</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Are you sure you want to permanently delete this application? This will also delete all uploaded files.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setShowDeleteModal(false);
                  setMemberToDelete(null);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-lg text-xs transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-lg text-xs transition flex justify-center items-center gap-1 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMembers;
