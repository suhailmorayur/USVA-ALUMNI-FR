import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 mt-auto border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Organization Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Award className="w-8 h-8 text-teal-400" />
              <span className="font-bold text-lg tracking-tight">USVA Alumni Union</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Umariyya Students Venerable Association (USVA) is the official alumni union of Umarali Shihab Thangal Islamic Academy, Arimbra. Connecting scholars, fostering academic growth, and strengthening networks.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-teal-400 transition">Campaign Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition">About Association</Link>
              </li>
              <li>
                <Link to="/membership" className="hover:text-teal-400 transition">Campaign Info</Link>
              </li>
              <li>
                <Link to="/status" className="hover:text-teal-400 transition">Track Application</Link>
              </li>
              <li>
                <Link to="/download" className="hover:text-teal-400 transition">Download Card</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-slate-200 text-xs transition block mt-4 text-slate-600">Admin Console Access</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact USVA</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0" />
                <span>USVA Alumni Office, Umarali Shihab Thangal Islamic Academy, Arimbra, Malappuram, Kerala - 673638</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+91 73562 26704</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>info@usva-alumni.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} USVA (Umariyya Students Venerable Association). All rights reserved.</p>
          <p className="mt-1">Umarali Shihab Thangal Islamic Academy, Arimbra.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
