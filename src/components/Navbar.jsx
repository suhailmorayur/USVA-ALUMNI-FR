import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, User, ShieldAlert, Award } from 'lucide-react';

const Navbar = () => {
  const { admin, logoutAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Award className="w-8 h-8 text-teal-700" />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-800 tracking-tight leading-tight">USVA Alumni</span>
                <span className="text-[10px] text-slate-500">Umariyya Students Venerable Association</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-slate-600 hover:text-teal-700 font-medium text-sm transition">Home</Link>
            <Link to="/about" className="text-slate-600 hover:text-teal-700 font-medium text-sm transition">About</Link>
            <Link to="/membership" className="text-slate-600 hover:text-teal-700 font-medium text-sm transition">Info</Link>

            {admin ? (
              <>
                <Link to="/admin" className="text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 font-bold text-xs flex items-center gap-1.5 transition">
                  <ShieldAlert className="w-3.5 h-3.5" /> ADMIN CONSOLE
                </Link>
                <button 
                  onClick={handleAdminLogout}
                  className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1 transition"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/download" className="text-slate-600 hover:text-teal-700 font-medium text-sm transition">Download Card</Link>
                <Link to="/status" className="text-slate-600 hover:text-teal-700 font-medium text-sm transition">Track Status</Link>
                <Link 
                  to="/" 
                  className="bg-teal-700 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow transition"
                >
                  APPLY FOR CARD
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Menu Icon */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-teal-700 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-4 space-y-2 shadow-inner">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Home</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">About USVA</Link>
          <Link to="/membership" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Campaign Info</Link>

          {admin ? (
            <>
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-teal-700 bg-teal-50">Admin Console</Link>
              <button 
                onClick={handleAdminLogout} 
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                Logout Admin
              </button>
            </>
          ) : (
            <>
              <Link to="/download" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Download Card</Link>
              <Link to="/status" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Track Status</Link>
              <Link 
                to="/" 
                onClick={() => setIsOpen(false)} 
                className="block text-center bg-teal-700 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-bold text-base shadow"
              >
                APPLY FOR CARD
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
