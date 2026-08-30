import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Award, 
  Settings, 
  FileText, 
  Printer, 
  LogOut,
  ChevronRight
} from 'lucide-react';

const AdminNav = () => {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const menuItems = [
    { label: 'Stats Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Applications list', path: '/admin/members', icon: Users },
    { label: 'Payments Ledger', path: '/admin/payments', icon: CreditCard },
    { label: 'Card Versions', path: '/admin/cards', icon: Award },
    { label: 'Bulk Printing', path: '/admin/print', icon: Printer },
    { label: 'Export Reports', path: '/admin/reports', icon: FileText },
    { label: 'Campaign Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="bg-slate-900 text-slate-400 w-full md:w-64 md:min-h-screen flex flex-col justify-between shrink-0 no-print border-r border-slate-800">
      {/* Header Info */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <ShieldCheck className="w-6 h-6 text-teal-400" />
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wide">USVA Admin</span>
            <span className="text-[9px] text-slate-500 uppercase font-semibold">Campaign Console</span>
          </div>
        </div>
      </div>

      {/* Menu Links */}
      <nav className="flex-grow p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                isActive 
                  ? 'bg-teal-700 text-white shadow-md' 
                  : 'hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-teal-100" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Account */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center gap-2 px-2 text-xs">
          <div className="w-7 h-7 bg-teal-800 text-white font-bold flex items-center justify-center rounded-full text-xs">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-slate-300 font-bold leading-tight">{admin?.name || 'USVA Administrator'}</span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase">{admin?.role || 'admin'}</span>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-bold text-red-400 hover:bg-slate-800 hover:text-red-300 transition"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Sign Out</span>
        </button>
      </div>

    </div>
  );
};

export default AdminNav;
