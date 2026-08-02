import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, MapPin, Phone, AlertCircle, Crosshair, Radar, Target } from 'lucide-react';

const VolunteerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState(350.00);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pendingRes, tasksRes] = await Promise.all([
        axios.get('/api/volunteer/requests', { headers: { Authorization: `Bearer ${user.token}` } }),
        axios.get('/api/citizen/requests', { headers: { Authorization: `Bearer ${user.token}` } }) // Reusing mock endpoints
      ]);
      setPendingRequests(pendingRes.data);
      setMyTasks(tasksRes.data); // Mocking active tasks using same array
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.put(`/api/volunteer/requests/${id}/accept`, {}, { headers: { Authorization: `Bearer ${user.token}` } });
      setEarnings(prev => prev + 50);
      alert('Signal accepted. Mission assigned. +$50 compensation added to your balance.');
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Failed to accept mission');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/api/volunteer/requests/${id}/status`, { status }, { headers: { Authorization: `Bearer ${user.token}` } });
      alert(`Status updated to: ${status}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Response <span className="text-purple-400">Unit</span></h1>
          <p className="text-slate-400 text-sm mt-1">Operational Command Terminal</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-semibold shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]">
            Compensation: ${earnings.toFixed(2)}
          </div>
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-xl text-sm font-semibold shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            Unit Active
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Active Missions */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-400" />
            Assigned Missions
          </h2>
          
          {loading ? (
             <div className="flex justify-center py-10"><AlertCircle className="w-8 h-8 text-purple-500 animate-spin" /></div>
          ) : myTasks.length === 0 ? (
            <div className="bg-white/5 p-8 rounded-2xl border border-dashed border-white/10 text-center text-slate-500">
              No active missions. Awaiting dispatch.
            </div>
          ) : (
            <div className="space-y-4">
              {myTasks.map(task => (
                <div key={task._id} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{task.type}</span>
                    <span className="text-xs text-slate-400 font-mono bg-black/40 px-2 py-1 rounded">STATUS: {task.status}</span>
                  </div>
                  <h3 className="font-bold text-white text-lg">{task.citizen?.name || 'Unknown Citizen'}</h3>
                  <div className="mt-3 space-y-2">
                    <p className="text-sm flex items-center gap-2 text-slate-300 font-mono">
                      <Phone className="h-4 w-4 text-purple-400" /> {task.citizen?.phone || 'Encrypted Channel'}
                    </p>
                    <p className="text-sm flex items-center gap-2 text-slate-300 font-mono">
                      <MapPin className="h-4 w-4 text-blue-400" /> {task.location?.address || 'COORDS: 37.77, -122.41'}
                    </p>
                  </div>
                  {task.description && (
                    <p className="mt-4 text-sm text-slate-400 bg-black/40 p-3 rounded-xl border border-white/5">{task.description}</p>
                  )}
                  
                  {task.status !== 'Completed' && (
                    <div className="mt-5 flex gap-3">
                      <select 
                        className="flex-1 text-sm rounded-xl border border-white/10 bg-black/50 text-white px-3 py-2 outline-none focus:border-purple-500/50"
                        onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                        value={task.status}
                      >
                        <option value="Assigned" className="bg-slate-900">En Route</option>
                        <option value="On the Way" className="bg-slate-900">Arrived</option>
                        <option value="Completed" className="bg-slate-900">Mission Accomplished</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Radar */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Radar className="h-5 w-5 text-red-500" />
            Local Distress Signals
          </h2>
          
          {loading ? (
             <div className="flex justify-center py-10"><AlertCircle className="w-8 h-8 text-red-500 animate-spin" /></div>
          ) : pendingRequests.length === 0 ? (
            <div className="bg-white/5 p-8 rounded-2xl border border-dashed border-white/10 text-center text-slate-500">
              No distress signals detected in your sector.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map(req => (
                <div key={req._id} className="bg-red-500/5 backdrop-blur-md p-6 rounded-2xl border border-red-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-red-500/20 transition-all"></div>
                  
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <Crosshair className="w-3 h-3" /> HIGH PRIORITY
                    </span>
                    <span className="text-xs text-slate-400 font-mono bg-black/40 px-2 py-1 rounded">T-00:05:22</span>
                  </div>
                  
                  <h3 className="font-bold text-white text-xl relative z-10">{req.type}</h3>
                  <p className="text-sm flex items-center gap-2 text-slate-300 font-mono mt-2 relative z-10">
                    <MapPin className="h-4 w-4 text-red-400" /> {req.location?.address || 'COORDS: 37.80, -122.42'}
                  </p>
                  
                  <p className="mt-3 text-sm text-slate-400 relative z-10">{req.description}</p>
                  
                  <button 
                    onClick={() => handleAccept(req._id)}
                    className="mt-6 w-full bg-red-600/90 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-500 shadow-[0_0_15px_-3px_rgba(220,38,38,0.4)] transition-all relative z-10"
                  >
                    INTERCEPT & RESPOND
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default VolunteerDashboard;
