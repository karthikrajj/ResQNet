import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, AlertTriangle, CheckCircle, Target, Database, Activity, Map } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [systemFunds, setSystemFunds] = useState(145000.00);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get('/api/admin/analytics', { headers: { Authorization: `Bearer ${user.token}` } }),
        axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${user.token}` } })
      ]);
      setStats(statsRes.data);
      setVolunteers(usersRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, isApproved) => {
    alert(`Unit ${id} authorization: ${isApproved ? 'GRANTED' : 'REVOKED'}`);
  };

  if (loading || !stats) return <div className="p-8 text-center text-slate-400">Initializing Command Terminal...</div>;

  const pieData = {
    labels: stats.requestStats.map(s => s._id),
    datasets: [
      {
        data: stats.requestStats.map(s => s.count),
        backgroundColor: ['#eab308', '#3b82f6', '#10b981'],
        borderWidth: 0,
        hoverOffset: 4
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Global <span className="text-emerald-400">Command</span></h1>
          <p className="text-slate-400 text-sm mt-1">Admin Overwatch Terminal</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-semibold shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]">
            <Database className="w-4 h-4" />
            Treasury: ${systemFunds.toLocaleString(undefined, {minimumFractionDigits: 2})}
          </div>
        </div>
      </div>

      {/* Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Critical Incidents</p>
              <p className="text-4xl font-light text-red-400 font-mono">{stats.summary.activeEmergencies}</p>
            </div>
            <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-400"><AlertTriangle className="w-6 h-6 animate-pulse" /></div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Active Units</p>
              <p className="text-4xl font-light text-purple-400 font-mono">{stats.summary.totalVolunteers}</p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400"><Target className="w-6 h-6" /></div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Civilian Nodes</p>
              <p className="text-4xl font-light text-blue-400 font-mono">{stats.summary.totalCitizens}</p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400"><Users className="w-6 h-6" /></div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Secure Havens</p>
              <p className="text-4xl font-light text-emerald-400 font-mono">{stats.summary.totalShelters}</p>
            </div>
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400"><CheckCircle className="w-6 h-6" /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Telemetry Chart */}
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 lg:col-span-1 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Global Resolution Matrix
          </h2>
          <div className="flex-1 flex items-center justify-center min-h-[250px]">
            <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8' } } } }} />
          </div>
        </div>

        {/* Unit Management Grid */}
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 lg:col-span-2 overflow-hidden flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Map className="w-5 h-5 text-emerald-400" />
            Unit Authorization Protocols
          </h2>
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-white/10">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Operative</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Comm Link</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Clearance</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {volunteers.map((vol, i) => (
                  <tr key={vol._id} className="hover:bg-white/5 transition-colors animate-slide-in-right" style={{ animationDelay: `${i * 100}ms` }}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{vol.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{vol.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300 font-mono">
                      {vol.phone || 'ENCRYPTED'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-[10px] font-bold uppercase tracking-wider rounded-full border ${vol.isApproved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                        {vol.isApproved ? 'AUTHORIZED' : 'RESTRICTED'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {!vol.isApproved ? (
                        <button 
                          onClick={() => handleApprove(vol._id, true)}
                          className="text-emerald-400 hover:text-white bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-600 px-4 py-1.5 rounded-lg transition-all text-xs uppercase tracking-wider"
                        >
                          Approve
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleApprove(vol._id, false)}
                          className="text-red-400 hover:text-white bg-red-500/20 border border-red-500/30 hover:bg-red-600 px-4 py-1.5 rounded-lg transition-all text-xs uppercase tracking-wider"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
