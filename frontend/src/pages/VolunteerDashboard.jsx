import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, MapPin, Phone, AlertCircle, Crosshair, Radar, Target, MessageSquare, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, WMSTileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const VolunteerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState(350.00);
  const [chatMsg, setChatMsg] = useState({});

  const playPing = () => {
    const audio = new Audio('data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
    audio.play().catch(e => {}); 
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pendingRes, tasksRes] = await Promise.all([
        axios.get('/api/volunteer/requests', { headers: { Authorization: `Bearer ${user.token}` } }),
        axios.get('/api/citizen/requests', { headers: { Authorization: `Bearer ${user.token}` } }) // Reusing mock endpoints
      ]);
      const allRequests = pendingRes.data;
      setPendingRequests(allRequests.filter(r => r.status === 'Pending'));
      setMyTasks(allRequests.filter(r => r.status !== 'Pending'));
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
      toast.success('Mission assigned. +$50 compensation added.', { icon: '🚁' });
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to accept mission');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/api/volunteer/requests/${id}/status`, { status }, { headers: { Authorization: `Bearer ${user.token}` } });
      toast.success(`Status updated to: ${status}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendChat = async (reqId) => {
    const msg = chatMsg[reqId];
    if(!msg) return;
    try {
      await axios.post(`/api/requests/${reqId}/chat`, { sender: 'First Responder Unit', text: msg }, { headers: { Authorization: `Bearer ${user.token}` } });
      setChatMsg(prev => ({ ...prev, [reqId]: '' }));
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">First <span className="text-purple-400">Responder Unit</span></h1>
          <p className="text-slate-400 text-sm mt-1">Operational Dispatch Terminal</p>
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
              {myTasks.map((task, i) => (
                <div key={task._id} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all animate-slide-in-right" style={{ animationDelay: `${i * 100}ms` }}>
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
                  
                  {task.location?.lat && (
                    <div className="mt-4 h-32 w-full rounded-xl overflow-hidden border border-white/10 z-0 relative">
                      <MapContainer center={[task.location.lat, task.location.lng]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                        <WMSTileLayer url="https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi" layers="nexrad-n0r-900913" format="image/png" transparent={true} opacity={0.6} />
                        <Marker position={[task.location.lat, task.location.lng]} />
                      </MapContainer>
                    </div>
                  )}

                  {task.status !== 'Pending' && task.messages && (
                    <div className="mt-4 bg-black/50 border border-white/5 rounded-xl p-3">
                      <p className="text-xs text-slate-400 mb-2 font-semibold flex items-center gap-1"><MessageSquare className="w-3 h-3"/> Secure Comms Link</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto mb-2">
                        {task.messages.map((m, idx) => (
                          <div key={idx} className={`text-sm p-2 rounded-lg ${m.sender==='First Responder Unit' ? 'bg-purple-500/20 text-purple-100 ml-auto w-fit' : 'bg-white/10 text-slate-200 mr-auto w-fit'}`}>
                            <span className="text-[10px] opacity-50 block mb-0.5">{m.sender}</span>
                            {m.text}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={chatMsg[task._id] || ''} onChange={e=>setChatMsg(p=>({...p, [task._id]: e.target.value}))} placeholder="Send message to citizen..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-purple-500/50" />
                        <button onClick={() => handleSendChat(task._id)} className="bg-purple-500 hover:bg-purple-600 text-white p-1.5 rounded-lg"><Send className="w-4 h-4"/></button>
                      </div>
                    </div>
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
            <div className="space-y-4 relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 w-[200%] h-[200%] -top-[50%] -left-[50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(220,38,38,0.3)_360deg)] pointer-events-none animate-radar-spin z-50 rounded-full"></div>
              <div className="absolute inset-0 w-full h-[50px] bg-gradient-to-b from-transparent via-red-500/10 to-transparent pointer-events-none animate-scanline z-40 blur-sm"></div>
              {pendingRequests.map((req, i) => (
                <div key={req._id} className="bg-red-500/5 backdrop-blur-md p-6 rounded-2xl border border-red-500/20 relative overflow-hidden group animate-slide-in-right" style={{ animationDelay: `${i * 100}ms` }}>
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
                  
                  <p className="mt-3 text-sm text-slate-400 relative z-10">"{req.description}"</p>
                  
                  {req.location?.lat && (
                    <div className="mt-4 h-24 w-full rounded-xl overflow-hidden border border-red-500/20 z-10 relative opacity-80 hover:opacity-100 transition-opacity">
                      <MapContainer center={[req.location.lat, req.location.lng]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                        <WMSTileLayer url="https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi" layers="nexrad-n0r-900913" format="image/png" transparent={true} opacity={0.6} />
                        <Marker position={[req.location.lat, req.location.lng]} />
                      </MapContainer>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => handleAccept(req._id)}
                    className="mt-6 w-full bg-red-600/90 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-500 shadow-[0_0_15px_-3px_rgba(220,38,38,0.4)] transition-all relative z-10 animate-pulse-glow"
                  >
                    INTERCEPT & RESPOND
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* CCTV Feed Mock */}
          <div className="mt-8 bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/10 overflow-hidden relative group">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Crosshair className="h-5 w-5 text-red-400" />
              Live Sector Optics
            </h2>
            <div className="grid grid-cols-2 gap-2 relative">
              <div className="absolute inset-0 bg-blue-500/10 pointer-events-none animate-scanline z-10"></div>
              
              <div className="h-32 bg-black rounded-lg border border-white/10 relative overflow-hidden group-hover:border-blue-500/50 transition-colors">
                 <div className="absolute top-2 left-2 flex items-center gap-2 z-20"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div><span className="text-[10px] text-white font-mono bg-black/50 px-1 rounded">CAM-01 (DOWNTOWN)</span></div>
                 <img src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=400&q=80" alt="city" className="w-full h-full object-cover opacity-50 grayscale contrast-125" />
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
              </div>

              <div className="h-32 bg-black rounded-lg border border-white/10 relative overflow-hidden group-hover:border-blue-500/50 transition-colors">
                 <div className="absolute top-2 left-2 flex items-center gap-2 z-20"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div><span className="text-[10px] text-white font-mono bg-black/50 px-1 rounded">CAM-04 (HIGHWAY)</span></div>
                 <img src="https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?auto=format&fit=crop&w=400&q=80" alt="highway" className="w-full h-full object-cover opacity-50 grayscale contrast-125" />
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default VolunteerDashboard;
