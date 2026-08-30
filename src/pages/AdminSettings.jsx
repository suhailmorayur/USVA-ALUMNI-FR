import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from '../components/AdminNav';
import { Settings, Save, Loader2, Award, Mail, Phone, MapPin, DollarSign } from 'lucide-react';

const AdminSettings = () => {
  const [formData, setFormData] = useState({
    collegeName: '',
    alumniName: '',
    membershipFee: 500,
    currency: 'INR',
    membershipValidity: 'Mar 2028',
    contactEmail: '',
    contactPhone: '',
    address: '',
    emailSenderName: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/settings');
      if (res.data.success) {
        setFormData(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const res = await axios.put('/api/admin/settings', formData);
      if (res.data.success) {
        setSuccess('Campaign configurations saved successfully!');
        setFormData(res.data.data);
      } else {
        setError(res.data.message || 'Saving failed.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server error saving settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col md:flex-row">
      <AdminNav />

      {/* Main Panel */}
      <div className="flex-grow p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Campaign Settings</h1>
          <p className="text-slate-500 text-sm">Configure fee indices, card validity parameters, and mail contact details</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
            <span className="text-sm font-bold text-slate-500 animate-pulse">Syncing configurations...</span>
          </div>
        ) : (
          <div className="max-w-3xl">
            {success && (
              <div className="bg-teal-50 text-teal-800 border border-teal-200 p-4 rounded-xl mb-6 text-sm font-semibold">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              
              {/* College Branding */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2"><Award className="w-4 h-4 text-teal-700" /> Branding & Title</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="collegeName" className="text-xs font-bold text-slate-500">College Academy Name</label>
                    <input
                      type="text"
                      id="collegeName"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/10 focus:border-teal-700 font-semibold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="alumniName" className="text-xs font-bold text-slate-500">Alumni Association Name</label>
                    <input
                      type="text"
                      id="alumniName"
                      name="alumniName"
                      value={formData.alumniName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/10 focus:border-teal-700 font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Fee & Validity */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2"><DollarSign className="w-4 h-4 text-teal-700" /> Fee & Card Validity</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="membershipFee" className="text-xs font-bold text-slate-500">Membership Registration Fee (₹)</label>
                    <input
                      type="number"
                      id="membershipFee"
                      name="membershipFee"
                      value={formData.membershipFee}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/10 focus:border-teal-700 font-semibold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="membershipValidity" className="text-xs font-bold text-slate-500">Card Validity Label (e.g. Mar 2028)</label>
                    <input
                      type="text"
                      id="membershipValidity"
                      name="membershipValidity"
                      value={formData.membershipValidity}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/10 focus:border-teal-700 font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Mailing dispatch */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2"><Mail className="w-4 h-4 text-teal-700" /> Dispatcher Mail Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="emailSenderName" className="text-xs font-bold text-slate-500">Sender Office Name</label>
                    <input
                      type="text"
                      id="emailSenderName"
                      name="emailSenderName"
                      value={formData.emailSenderName}
                      onChange={handleChange}
                      placeholder="e.g. USVA Secretary"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/10 focus:border-teal-700 font-semibold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="contactEmail" className="text-xs font-bold text-slate-500">Official Contact Email</label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/10 focus:border-teal-700 font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Contact office details */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2"><MapPin className="w-4 h-4 text-teal-700" /> Office Contact details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="contactPhone" className="text-xs font-bold text-slate-500">Office Phone</label>
                    <input
                      type="text"
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/10 focus:border-teal-700 font-semibold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label htmlFor="address" className="text-xs font-bold text-slate-500">Office Physical Address</label>
                    <textarea
                      id="address"
                      name="address"
                      rows="3"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-700/10 focus:border-teal-700 text-sm font-semibold text-slate-800 leading-normal"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-4 border-t">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-teal-700 hover:bg-teal-600 text-white font-bold py-2.5 px-6 rounded-lg text-sm shadow transition flex items-center gap-1.5"
                >
                  {saving ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <><Save className="w-4.5 h-4.5" /> Save Configurations</>}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminSettings;
