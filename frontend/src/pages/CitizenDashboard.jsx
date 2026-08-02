import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, MapPin, Search } from 'lucide-react';

const CitizenDashboard = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sosType, setSosType] = useState('Rescue');
  const [sosDescription, setSosDescription] = useState('');
  const [message, setMessage] = useState('');

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
      // Simulate geolocation
      const location = {
        lat: 37.7749 + (Math.random() * 0.01),
        lng: -122.4194 + (Math.random() * 0.01),
        address: 'Current Simulated Location'
      };

      await axios.post('/api/citizen/sos', {
        type: sosType,
        description: sosDescription,
        location,
        priority: 'High'
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setMessage('SOS request sent successfully!');
      setSosDescription('');
      fetchRequests();
    } catch (error) {
      setMessage('Failed to send SOS.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Citizen Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOS Panel */}
        <div className="lg:col-span-1">
          <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-100">
            <h2 className="text-xl font-semibold text-red-800 flex items-center gap-2 mb-4">
              <AlertCircle className="h-6 w-6" />
              Emergency SOS
            </h2>
            {message && (
              <div className="mb-4 p-3 bg-white text-green-700 text-sm rounded border border-green-200">
                {message}
              </div>
            )}
            <form onSubmit={handleSOS} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-red-900 mb-1">Help Type</label>
                <select 
                  value={sosType}
                  onChange={(e) => setSosType(e.target.value)}
                  className="w-full rounded-md border-red-300 py-2 pl-3 pr-10 text-base focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm bg-white"
                >
                  <option value="Rescue">Rescue Needed</option>
                  <option value="Medical">Medical Emergency</option>
                  <option value="Food">Food / Water</option>
                  <option value="Shelter">Shelter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-red-900 mb-1">Description (Optional)</label>
                <textarea 
                  rows={3}
                  value={sosDescription}
                  onChange={(e) => setSosDescription(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-red-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
                  placeholder="Details about your emergency..."
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-red-600 text-white py-3 px-4 rounded-md font-bold text-lg hover:bg-red-700 shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2 animate-pulse"
              >
                <AlertCircle /> SEND SOS NOW
              </button>
            </form>
          </div>
        </div>

        {/* Status Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              My Requests Status
            </h2>
            
            {loading ? (
              <p>Loading...</p>
            ) : requests.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                You have no active emergency requests.
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map(req => (
                  <div key={req._id} className="p-4 border rounded-lg bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            req.status === 'Assigned' ? 'bg-blue-100 text-blue-800' : 
                            req.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {req.status}
                        </span>
                        <span className="font-semibold text-gray-900">{req.type}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{req.description || 'No description provided'}</p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {req.location?.address || 'Location simulated'}
                      </p>
                    </div>
                    {req.volunteer && (
                      <div className="bg-white p-3 rounded border text-sm text-center sm:text-right">
                        <p className="text-xs text-gray-500 mb-1">Assigned Volunteer</p>
                        <p className="font-semibold">{req.volunteer.name}</p>
                        <p className="text-gray-600">{req.volunteer.phone}</p>
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

// Add missing icon import
import { Activity } from 'lucide-react';

export default CitizenDashboard;
