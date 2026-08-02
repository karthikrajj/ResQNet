import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, MapPin, Search, Activity, Wallet, Plus, HeartHandshake } from 'lucide-react';

const CitizenDashboard = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sosType, setSosType] = useState('Rescue');
  const [sosDescription, setSosDescription] = useState('');
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(1250.50);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get('/api/citizen/requests', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSOS = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const location = { lat: 37.77, lng: -122.41, address: 'Current Location' };
      await axios.post('/api/citizen/sos', { type: sosType, description: sosDescription, location, priority: 'High' }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessage('SOS broadcasted to nearby units.');
      setSosDescription('');
      fetchRequests();
    } catch (error) {
      setMessage('Broadcast failed.');
    }
  };

  const handleDonate = () => {
    if (balance >= 100) {
      setBalance(prev => prev - 100);
      alert('Successfully donated $100 to the global rescue fund!');
    } else {
      alert('Insufficient funds for this addon.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Citizen <span className="text-blue-400">Node</span></h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-semibold shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]">
            <Wallet className="w-4 h-4" />
            Balance: ${balance.toFixed(2)}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tactical SOS Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-red-500/5 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-red-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-red-500/20 transition-all"></div>
            
            <h2 className="text-xl font-semibold text-red-400 flex items-center gap-2 mb-6 relative z-10">
              <AlertCircle className="h-6 w-6 animate-pulse" />
              Emergency Broadcast
            </h2>
            
            {message && (
              <div className="mb-6 p-4 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-xl border border-emerald-500/20 relative z-10">
                {message}
              </div>
            )}
            
            <form onSubmit={handleSOS} className="space-y-5 relative z-10">
              <div>
                <label className="block text-xs font-semibold text-red-300 uppercase tracking-wider mb-2">Protocol Type</label>
                <select 
                  value={sosType}
                  onChange={(e) => setSosType(e.target.value)}
                  className="w-full rounded-xl border border-red-500/30 py-3 px-4 text-sm bg-black/40 text-red-100 focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all outline-none"
                >
                  <option value="Rescue" className="bg-slate-900">Immediate Rescue</option>
                  <option value="Medical" className="bg-slate-900">Medical Evac</option>
                  <option value="Food" className="bg-slate-900">Supplies Drop</option>
                  <option value="Shelter" className="bg-slate-900">Shelter Request</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-red-300 uppercase tracking-wider mb-2">Situation Report</label>
                <textarea 
                  rows={3}
                  value={sosDescription}
                  onChange={(e) => setSosDescription(e.target.value)}
                  className="block w-full rounded-xl border border-red-500/30 py-3 px-4 text-sm bg-black/40 text-red-100 placeholder:text-red-900/50 focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all outline-none"
                  placeholder="Specify critical details..."
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-red-600/90 text-white py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide hover:bg-red-500 shadow-[0_0_20px_-5px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_-5px_rgba(220,38,38,0.7)] transition-all flex justify-center items-center gap-2 group"
              >
                <AlertCircle className="w-5 h-5 group-hover:scale-110 transition-transform" /> INITIATE SOS
              </button>
            </form>
          </div>

          {/* Wallet / Addons Panel */}
          <div className="bg-blue-500/5 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-blue-500/20">
            <h2 className="text-lg font-semibold text-blue-400 flex items-center gap-2 mb-4">
              <HeartHandshake className="h-5 w-5" />
              Relief Funds & Addons
            </h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Use your secure balance to fund active rescue missions or request financial aid addons.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleDonate} className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 py-2.5 rounded-xl text-sm font-semibold transition-all">
                Donate $100
              </button>
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 py-2.5 rounded-xl text-sm font-semibold transition-all">
                Request Aid
              </button>
            </div>
          </div>
        </div>

        {/* Tactical Status Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/10 h-full">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
              Active Broadcasts
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-20"><Activity className="w-8 h-8 text-blue-500 animate-spin" /></div>
            ) : requests.length === 0 ? (
              <div className="text-center py-20 text-slate-500 border border-dashed border-white/10 rounded-xl bg-black/20">
                No active signals detected.
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map(req => (
                  <div key={req._id} className="p-5 border border-white/10 rounded-xl bg-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-white/5 transition-colors">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                          ${req.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                            req.status === 'Assigned' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                            req.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                            'bg-white/10 text-slate-300 border border-white/20'}`}>
                          {req.status}
                        </span>
                        <span className="font-semibold text-white text-lg">{req.type}</span>
                      </div>
                      <p className="text-sm text-slate-400 mt-2">{req.description || 'No description provided'}</p>
                      <p className="text-xs font-mono text-slate-500 mt-3 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-blue-400" /> {req.location?.address || 'COORDS: 37.77, -122.41'}
                      </p>
                    </div>
                    {req.volunteer && (
                      <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20 text-sm text-center sm:text-right min-w-[150px]">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-blue-400 mb-1">Dispatched Unit</p>
                        <p className="font-semibold text-white">{req.volunteer.name}</p>
                        <p className="text-slate-400 font-mono mt-1 text-xs">{req.volunteer.phone}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CitizenDashboard;
