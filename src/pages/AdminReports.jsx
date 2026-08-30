import React, { useState } from 'react';
import axios from 'axios';
import AdminNav from '../components/AdminNav';
import { FileText, Download, Loader2, AlertCircle } from 'lucide-react';

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCSVExport = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch protected CSV endpoint as blob
      const res = await axios.get('/api/admin/export', {
        responseType: 'blob'
      });

      // Create blob link and trigger download in browser
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `USVA_Alumni_Registry_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      setError('Failed to compile CSV export file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col md:flex-row">
      <AdminNav />

      {/* Main Panel */}
      <div className="flex-grow p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Export Reports</h1>
          <p className="text-slate-500 text-sm">Download registered member spreadsheets and campaign details</p>
        </div>

        <div className="max-w-xl space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl text-sm flex gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Export Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-700 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">CSV Spreadsheets Export</h3>
                <p className="text-slate-400 text-xs mt-0.5 font-medium leading-normal">
                  Export all member details (Membership ID, Full Name, Sanad, Place, Admission Number, Phone, Email, Payment Status, Registration Date) into a formatted CSV spreadsheet.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs leading-normal text-slate-500">
                <span className="font-bold text-slate-700 block mb-1">Spreadsheet Columns Info:</span>
                <ul className="list-disc list-inside space-y-1">
                  <li>Membership ID (dynamically formatted sequence code)</li>
                  <li>Alumni qualifications (Umari, Faizy, Both, or empty)</li>
                  <li>Academic Admission numbers (unique indexes)</li>
                  <li>Registration timestamps and campaign application states</li>
                </ul>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-4 gap-2">
                  <Loader2 className="w-6 h-6 text-teal-700 animate-spin" />
                  <span className="text-xs font-bold text-slate-500">Compiling database rows...</span>
                </div>
              ) : (
                <button
                  onClick={handleCSVExport}
                  className="w-full bg-teal-700 hover:bg-teal-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-teal-900/10 transition flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" /> Download Member Spreadsheet (.csv)
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminReports;
