import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'Citizen': return '/citizen';
      case 'Volunteer': return '/volunteer';
      case 'Admin': return '/admin';
      default: return '/';
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0f1c]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <Link to={getDashboardLink()} className="flex-shrink-0 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShieldAlert className="h-5 w-5 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white hover:animate-glitch cursor-crosshair transition-all">ResQ<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Net</span></span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end hidden md:flex">
                  <span className="text-sm font-semibold text-slate-200">{user.name}</span>
                  <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full mt-1">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Central Dispatch Login
                </Link>
                <Link to="/register" className="relative overflow-hidden bg-white/10 hover:bg-white/20 border border-white/10 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-all hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]">
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent w-[200%]"></div>
                  <span className="relative z-10">Citizen SOS</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
