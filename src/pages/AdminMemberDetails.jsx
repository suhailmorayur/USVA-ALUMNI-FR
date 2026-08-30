import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AdminNav from '../components/AdminNav';
import CardPreview from '../components/CardPreview';
import { useAuth } from '../context/AuthContext';
import { 
  Loader2, 
  ArrowLeft, 
  Check, 
  X, 
  Mail, 
  Printer, 
  Download, 
  RefreshCw, 
  CreditCard, 
  ShieldCheck, 
  User, 
  FileText,
  AlertTriangle,
  Trash2
} from 'lucide-react';

const AdminMemberDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { admin, logoutAdmin, adminToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Action loaders
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [previewLayout, setPreviewLayout] = useState('portrait');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      const response = await axios.delete(`/api/admin/members/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (response.data.success) {
        alert('Application deleted successfully.');
        navigate('/admin/members');
      } else {
        alert(response.data.message || 'Deletion failed.');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Server error deleting application.');
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/admin/members/${id}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this membership? This will generate a unique ID, compile the PDF card, and email it to the student.')) return;
    
    setActionLoading(true);
    try {
      const res = await axios.post(`/api/admin/members/${id}/approve`);
      if (res.data.success) {
        alert(res.data.message);
        fetchDetails();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return;

    setActionLoading(true);
    try {
      const res = await axios.post(`/api/admin/members/${id}/reject`, {
        rejectionReason: rejectionReason.trim()
      });
      if (res.data.success) {
        alert('Application rejected.');
        setShowRejectModal(false);
        setRejectionReason('');
        fetchDetails();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!window.confirm('Are you sure you want to regenerate the card? This will compile a new PDF version using current settings.')) return;
    
    setActionLoading(true);
    try {
      const res = await axios.post(`/api/admin/members/${id}/generate-card`);
      if (res.data.success) {
        alert(res.data.message);
        fetchDetails();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Regeneration failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setActionLoading(true);
    try {
      const res = await axios.post(`/api/admin/members/${id}/resend-email`);
      if (res.data.success) {
        alert(res.data.message);
        fetchDetails();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Resending failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="bg-slate-100 min-h-screen flex flex-col md:flex-row">
        <AdminNav />
        <div className="flex-grow flex items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
          <span className="text-sm font-bold text-slate-500 animate-pulse">Syncing member details...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-slate-100 min-h-screen flex flex-col md:flex-row">
        <AdminNav />
        <div className="flex-grow p-8">
          <div className="bg-red-50 text-red-700 border border-red-200 p-5 rounded-xl text-center text-sm">
            {error || 'Member not found'}
          </div>
        </div>
      </div>
    );
  }

  const { member, payment, card, emailLogs } = data;
  const isApproved = ['approved', 'card_generated', 'email_sent'].includes(member.applicationStatus);

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col md:flex-row">
      <AdminNav />

      {/* Main Panel */}
      <div className="flex-grow p-6 sm:p-8 space-y-6">
        
        {/* Header - Hidden in Print */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4 no-print">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight uppercase leading-none">Review Application</h1>
            <p className="text-slate-500 text-sm">Verify scholar details and secure card delivery</p>
          </div>
          <Link
            to="/admin/members"
            className="bg-white hover:bg-slate-50 border p-2.5 rounded-lg text-slate-600 font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to List
          </Link>
        </div>

        {/* Action Panel - Hidden in Print */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Application State:</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-extrabold uppercase ${
                isApproved ? 'bg-teal-50 text-teal-700' : member.applicationStatus === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {member.applicationStatus === 'email_sent' ? 'Emailed' : member.applicationStatus === 'card_generated' ? 'Compiled' : member.applicationStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isApproved 
                ? `Approval complete. Card version ${card?.version || 1} generated.` 
                : 'Awaiting executive verification.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {actionLoading ? (
              <div className="flex items-center gap-2 px-4 py-2">
                <Loader2 className="w-5 h-5 text-teal-700 animate-spin" />
                <span className="text-xs font-bold text-slate-500">Processing action...</span>
              </div>
            ) : !isApproved ? (
              <>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1 transition"
                >
                  <X className="w-4 h-4" /> Reject Application
                </button>
                <button
                  onClick={handleApprove}
                  className="bg-teal-700 hover:bg-teal-600 text-white px-5 py-2 rounded-lg font-bold text-xs flex items-center gap-1 shadow transition"
                >
                  <Check className="w-4 h-4" /> Approve Membership
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleRegenerate}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1 transition"
                  title="Force re-generation of both portrait and landscape versions"
                >
                  <RefreshCw className="w-4 h-4" /> Recompile Cards
                </button>
                <button
                  onClick={handleResendEmail}
                  className="bg-teal-700 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1 shadow transition"
                  title="Resend portrait card to student email"
                >
                  <Mail className="w-4 h-4" /> Email Portrait Card
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1 transition border"
                  title="Print Landscape admin card"
                >
                  <Printer className="w-4 h-4" /> Print Landscape Card
                </button>
                <a
                  href={card?.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1 transition"
                  title="Download Portrait student card"
                >
                  <Download className="w-4 h-4" /> Download Portrait
                </a>
                <a
                  href={`${axios.defaults.baseURL || ''}/api/admin/members/${member._id}/download-landscape?token=${adminToken}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1 transition"
                  title="Download Landscape admin card (Direct)"
                >
                  <Download className="w-4 h-4" /> Download Landscape
                </a>
              </>
            )}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1 shadow transition"
              title="Permanently delete application and files"
            >
              <Trash2 className="w-4 h-4" /> Delete Application
            </button>
          </div>
        </div>

        {/* Detailed Panels - Hidden in Print */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
          
          {/* Column 1: Member Data */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 lg:col-span-2">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5 border-b pb-2"><User className="w-5 h-5 text-teal-700" /> Student Profile Details</h3>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <img 
                src={member.photoUrl} 
                alt={member.fullName} 
                className="w-32 aspect-[224/284] object-cover rounded-xl border shadow-sm mx-auto sm:mx-0 shrink-0"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm flex-grow">
                <div>
                  <span className="text-slate-400 font-bold block text-xs uppercase">Full Name</span>
                  <span className="text-slate-800 font-bold uppercase">{member.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-xs uppercase">Admission No</span>
                  <span className="text-slate-800 font-semibold">{member.admissionNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-xs uppercase">Sanad Course</span>
                  <span className="text-slate-800 font-semibold">
                    {member.sand && member.sand.length > 0
                      ? member.sand.map(s => s === 'umari' ? 'Umari' : 'Faizy').join(' / ')
                      : 'None'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-xs uppercase">Place</span>
                  <span className="text-slate-800 font-semibold">{member.place}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-xs uppercase">Phone</span>
                  <span className="text-slate-800 font-semibold">{member.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-xs uppercase">Email</span>
                  <span className="text-slate-800 font-semibold truncate block">{member.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Payment and email logs */}
          <div className="space-y-6">
            
            {/* Payment Panel */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5 border-b pb-2"><CreditCard className="w-5 h-5 text-teal-700" /> Payment Audit</h3>
              {payment ? (
                <div className="text-sm space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold">Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      payment.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>{payment.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold">Amount Paid:</span>
                    <span className="text-slate-800 font-bold">₹{payment.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold">Order ID:</span>
                    <span className="text-slate-700 font-mono text-xs">{payment.orderId}</span>
                  </div>
                  {payment.paymentId && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold">Transaction ID:</span>
                      <span className="text-slate-700 font-mono text-xs">{payment.paymentId}</span>
                    </div>
                  )}
                  {payment.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold">Secured Date:</span>
                      <span className="text-slate-600 font-semibold">{new Date(payment.paidAt).toLocaleString()}</span>
                    </div>
                  )}

                  {/* Manual proof image thumbnail */}
                  {payment.screenshotUrl && (
                    <div className="border-t pt-4 mt-2">
                      <span className="text-slate-400 font-bold block text-xs uppercase mb-2">Uploaded Screenshot:</span>
                      <a href={payment.screenshotUrl} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={payment.screenshotUrl} 
                          alt="Transaction Screenshot Receipt" 
                          className="w-full max-h-36 object-contain border rounded-lg hover:border-teal-700 transition"
                        />
                      </a>
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-400">
                  No payment record has been generated for this student.
                </div>
              )}
            </div>

            {/* Email Dispatch Logs */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5 border-b pb-2"><Mail className="w-5 h-5 text-teal-700" /> Notification Dispatch</h3>
              {emailLogs && emailLogs.length > 0 ? (
                <div className="space-y-3 custom-scrollbar max-h-48 overflow-y-auto">
                  {emailLogs.map((log) => (
                    <div key={log._id} className="text-xs p-2.5 bg-slate-50 border rounded-lg space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-600">{log.type === 'approval_card' ? 'Approval Dispatch' : log.type}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          log.status === 'sent' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>{log.status}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {log.sentAt ? new Date(log.sentAt).toLocaleString() : 'Pending'}
                      </div>
                      {log.errorMessage && (
                        <div className="text-[10px] text-red-500 font-mono break-words pt-1 border-t border-dashed mt-1 leading-normal">
                          Error: {log.errorMessage}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-400">
                  No email notification attempts recorded.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Visual Mock Card Preview Area - Hidden in Print */}
        {isApproved && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 no-print">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 gap-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5"><FileText className="w-5 h-5 text-teal-700" /> Visual Verification</h3>
              
              {/* Layout Toggle Tabs */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPreviewLayout('portrait')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md tracking-wider transition ${previewLayout === 'portrait' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Portrait Card
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLayout('landscape')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md tracking-wider transition ${previewLayout === 'landscape' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Landscape Admin Card
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <div className={previewLayout === 'portrait' ? "w-full max-w-xs" : "w-full max-w-lg"}>
                <span className="text-xs font-bold text-slate-400 block text-center uppercase mb-2">FRONT VIEW</span>
                <div className="border rounded-xl shadow-sm overflow-hidden bg-slate-50">
                  <CardPreview member={member} side="front" layout={previewLayout} />
                </div>
              </div>
              <div className={previewLayout === 'portrait' ? "w-full max-w-xs" : "w-full max-w-lg"}>
                <span className="text-xs font-bold text-slate-400 block text-center uppercase mb-2">BACK VIEW</span>
                <div className="border rounded-xl shadow-sm overflow-hidden bg-slate-50">
                  <CardPreview member={member} side="back" layout={previewLayout} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Printable Card Area - Visible ONLY when printing */}
        {isApproved && (
          <div className="hidden print-only flex flex-col gap-10 items-center justify-center p-0">
            {/* Front Page */}
            <div className="w-[1004px] h-[638px] print-page-break relative">
              <CardPreview member={member} side="front" />
            </div>
            {/* Back Page */}
            <div className="w-[1004px] h-[638px] print-page-break relative">
              <CardPreview member={member} side="back" />
            </div>
          </div>
        )}

      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs no-print">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100">
            <div className="bg-red-700 p-4 text-white font-bold flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5" />
                <span>Reject Application</span>
              </div>
              <button onClick={() => setShowRejectModal(false)} className="hover:text-red-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReject} className="p-6 space-y-4">
              <div className="space-y-1.5 text-sm">
                <label htmlFor="modalReason" className="font-bold text-slate-700 block">Rejection Reason</label>
                <textarea
                  id="modalReason"
                  rows="4"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this registration is being rejected (e.g. Invalid admission number, blurred image). The student will see this on their portal."
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 text-slate-700 leading-normal"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-red-700 text-white font-bold rounded-lg shadow-md hover:bg-red-600 flex items-center gap-1 transition"
                >
                  Confirm Reject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <AlertTriangle className="w-12 h-12 text-red-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">Delete Application</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Are you sure you want to permanently delete this application? This will also delete all uploaded files.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => {
                  setShowDeleteModal(false);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-lg text-xs transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-lg text-xs transition flex justify-center items-center gap-1 disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminMemberDetails;
