import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from '../components/AdminNav';
import { Loader2, Printer, CheckSquare, Square, Download, AlertCircle, RefreshCw } from 'lucide-react';

const AdminPrint = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Selection states
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState('');

  const fetchApprovedMembers = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch approved members (could have card generated or email sent status)
      const res = await axios.get('/api/admin/members?limit=200&appStatus=card_generated');
      const res2 = await axios.get('/api/admin/members?limit=200&appStatus=email_sent');
      const res3 = await axios.get('/api/admin/members?limit=200&appStatus=approved');
      
      if (res.data.success) {
        const list = [
          ...(res.data.data.members || []),
          ...(res2.data.data.members || []),
          ...(res3.data.data.members || [])
        ];
        
        // De-duplicate
        const unique = list.filter((val, index, self) => 
          self.findIndex(v => v._id === val._id) === index
        );

        setMembers(unique);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load approved members list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedMembers();
  }, []);

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleSelectAll = () => {
    const allIds = members.map(m => m._id);
    setSelectedIds(allIds);
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const handleBulkDownload = async () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one approved member card.');
      return;
    }

    setBulkLoading(true);
    setBulkProgress(`Compiling card layouts for ${selectedIds.length} members...`);

    try {
      const res = await axios.post('/api/admin/bulk-generate', {
        memberIds: selectedIds
      }, {
        responseType: 'blob'
      });

      setBulkProgress('PDF compiled successfully! Preparing file download...');

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `USVA_Bulk_Cards_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert('Bulk card compilation failed. Please verify selected items and try again.');
    } finally {
      setBulkLoading(false);
      setBulkProgress('');
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Bulk Card Printing</h1>
            <p className="text-slate-500 text-sm">Download composite print-ready PDF files for physical printing jobs</p>
          </div>
          <button
            onClick={fetchApprovedMembers}
            className="bg-white border rounded-lg p-2.5 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
            <span className="text-sm font-bold text-slate-500 animate-pulse">Syncing approved records...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 border border-red-200 p-5 rounded-xl text-center text-sm">
            {error}
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border border-slate-200 text-center space-y-2">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-lg font-bold text-slate-700">No Approved Members</h2>
            <p className="text-slate-400 text-sm">There are no approved member registrations ready for card printing.</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Control Panel */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={handleSelectAll}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition"
                >
                  Select All Approved ({members.length})
                </button>
                <button
                  onClick={handleClearAll}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-4 py-2 rounded-lg text-xs transition border"
                >
                  Clear Selection
                </button>
              </div>

              {bulkLoading ? (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 border p-2 rounded-lg">
                  <Loader2 className="w-4 h-4 text-teal-700 animate-spin" />
                  <span>{bulkProgress}</span>
                </div>
              ) : (
                <button
                  onClick={handleBulkDownload}
                  disabled={selectedIds.length === 0}
                  className={`px-5 py-2.5 rounded-lg font-bold text-xs shadow transition flex items-center gap-1.5 ${
                    selectedIds.length > 0 
                      ? 'bg-teal-700 hover:bg-teal-600 text-white cursor-pointer' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Download className="w-4.5 h-4.5" /> Download Selected Cards ({selectedIds.length})
                </button>
              )}
            </div>

            {/* Selector list table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse text-left text-sm text-slate-500">
                  <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b">
                    <tr>
                      <th scope="col" className="px-6 py-4 w-10 text-center">Select</th>
                      <th scope="col" className="px-6 py-4">Student</th>
                      <th scope="col" className="px-6 py-4">Membership ID</th>
                      <th scope="col" className="px-6 py-4">Admission No</th>
                      <th scope="col" className="px-6 py-4">Place</th>
                      <th scope="col" className="px-6 py-4 text-center">Card Page Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 border-t">
                    {members.map((member) => {
                      const isSelected = selectedIds.includes(member._id);
                      return (
                        <tr 
                          key={member._id} 
                          onClick={() => handleToggleSelect(member._id)}
                          className={`hover:bg-slate-50/50 cursor-pointer select-none ${isSelected ? 'bg-teal-50/20' : ''}`}
                        >
                          <td className="px-6 py-3 text-center">
                            <button type="button" aria-label={`Select member ${member.fullName}`} className="focus:outline-none">
                              {isSelected ? (
                                <CheckSquare className="w-5 h-5 text-teal-700" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-300" />
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-3 font-semibold text-slate-800 uppercase">{member.fullName}</td>
                          <td className="px-6 py-3 font-mono font-bold text-slate-900 text-xs">{member.membershipId}</td>
                          <td className="px-6 py-3 font-mono font-semibold">{member.admissionNumber}</td>
                          <td className="px-6 py-3">{member.place}</td>
                          <td className="px-6 py-3 text-center font-bold">2 Pages</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPrint;
