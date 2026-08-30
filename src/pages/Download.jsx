import React, { useState } from 'react';
import axios from 'axios';
import { Award, Search, Download as DownloadIcon, ArrowRight, ToggleLeft, ToggleRight, ShieldAlert } from 'lucide-react';
import CardPreview from '../components/CardPreview';

const Download = () => {
  const [searchType, setSearchType] = useState('email'); // 'email' or 'admissionNumber'
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // { member, card }
  const [side, setSide] = useState('front');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!searchValue.trim()) {
      setError('Please enter a search value.');
      return;
    }

    setLoading(true);

    try {
      const params = {};
      if (searchType === 'email') {
        params.email = searchValue.trim().toLowerCase();
      } else {
        params.admissionNumber = searchValue.trim();
      }

      const response = await axios.get('/api/members/search-card', { params });
      if (response.data.success) {
        setResult(response.data.data);
      } else {
        setError(response.data.message || 'Card not found.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'No approved member profile found matching those details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Search Header */}
        <div className="text-center space-y-2">
          <Award className="w-12 h-12 mx-auto text-teal-700 animate-pulse" />
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">USVA Alumni Card Download</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Retrieve your digital Portrait membership card by entering your registered email address or admission number.
          </p>
        </div>

        {/* Search Form Box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            
            {/* Search Type Selector */}
            <div className="flex gap-4 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setSearchType('email');
                  setSearchValue('');
                  setError('');
                }}
                className={`flex-1 text-center py-2 text-xs font-bold uppercase rounded-md tracking-wider transition ${searchType === 'email' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Search by Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchType('admissionNumber');
                  setSearchValue('');
                  setError('');
                }}
                className={`flex-1 text-center py-2 text-xs font-bold uppercase rounded-md tracking-wider transition ${searchType === 'admissionNumber' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Search by Ad. No
              </button>
            </div>

            {/* Input & Action */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={searchType === 'email' ? 'email' : 'text'}
                  required
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={searchType === 'email' ? 'e.g. suhail@example.com' : 'e.g. 1098'}
                  className="w-full bg-white border border-slate-200 focus:border-teal-700 text-slate-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700/10 transition text-sm font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-teal-700 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 shrink-0"
              >
                {loading ? 'Searching...' : <>Search Card <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>

          </form>

          {error && (
            <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-800 p-4 rounded-r-xl text-xs font-semibold flex items-start gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-amber-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Live Preview and Download Box */}
        {result && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn p-8 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{result.member.fullName}</h3>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block mt-0.5">
                  ID: {result.card.membershipId}
                </span>
              </div>

              {/* Layout splits toggle side and download */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSide(side === 'front' ? 'back' : 'front')}
                  className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-sm"
                >
                  {side === 'front' ? <ToggleRight className="w-5 h-5 text-teal-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                  <span>SHOW {side === 'front' ? 'BACK' : 'FRONT'}</span>
                </button>

                <a
                  href={result.card.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-md"
                >
                  <DownloadIcon className="w-4 h-4" /> DOWNLOAD PDF
                </a>
              </div>
            </div>

            {/* Portrait Layout View */}
            <div className="flex justify-center">
              <div className="w-[319px] aspect-[638/1004] bg-white rounded-2xl shadow-lg border relative overflow-hidden">
                <CardPreview 
                  member={result.member} 
                  validity="Mar 2028" 
                  side={side} 
                  layout="portrait" 
                />
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Download;
