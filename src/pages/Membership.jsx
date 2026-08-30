import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Info, HelpCircle, Check, Award, AlertCircle } from 'lucide-react';

const Membership = () => {
  const [fee, setFee] = useState(500);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        if (res.data.success) {
          setFee(res.data.data.membershipFee);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <Info className="w-12 h-12 text-teal-700 mx-auto" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">Campaign Information</h1>
          <p className="text-slate-500">Official guidelines and requirements for registering</p>
        </div>

        {/* Campaign Info card */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-teal-600 animate-pulse" />
            <h2 className="text-2xl font-bold text-slate-800">USVA Card Benefits</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            The USVA Alumni Membership Card is the official digital and physical identification for former students of Umarali Shihab Thangal Islamic Academy, Arimbra. Holding a valid card offers:
          </p>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>Official recognition as a certified alumnus of the academy.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>Right to participate in USVA general body elections, executive board nominations, and campaigns.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>A printed card embedded with a unique QR code verifying membership status publicly.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>Instant access to alumni networks, events, and resources.</span>
            </li>
          </ul>
        </div>

        {/* Requirements Card */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Requirements & Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-xs">Membership Fee</span>
                <span className="text-2xl font-black text-slate-800">₹{fee} <span className="text-slate-500 font-normal text-sm">(UPI Only)</span></span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-xs">Required Photo Format</span>
                <span className="text-slate-700 leading-normal block">
                  A high-resolution passport-size photo. Must be cropped in a portrait ratio. Max upload limit is 10 MB. Supported: JPG, JPEG, PNG, WebP.
                </span>
              </div>
            </div>
            
            <div className="space-y-4 bg-teal-50/50 p-5 rounded-lg border border-teal-100/50">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-teal-700 shrink-0" />
                <div>
                  <h4 className="font-bold text-teal-800">Verification Steps</h4>
                  <p className="text-teal-700 text-xs mt-1 leading-relaxed">
                    Upon online fee payment verification, the application goes into "Under Review" state. The admin board cross-checks your Admission Number and details against academy records. 
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Link 
              to="/register" 
              className="bg-teal-700 hover:bg-teal-600 text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-teal-900/10 transition"
            >
              REGISTER FOR MEMBERSHIP NOW
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Membership;
