import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, MapPin, Phone, AlertCircle } from 'lucide-react';

const VolunteerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pendingRes, tasksRes] = await Promise.all([
        axios.get('/api/volunteer/requests', { headers: { Authorization: `Bearer ${user.token}` } }),
        axios.get('/api/volunteer/tasks', { headers: { Authorization: `Bearer ${user.token}` } })
      ]);
      setPendingRequests(pendingRes.data);
      setMyTasks(tasksRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.put(`/api/volunteer/requests/${id}/accept`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchData();
    } catch (error) {
      alert('Failed to accept request');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/api/volunteer/requests/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (!user.isApproved) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Approval</h2>
        <p className="text-gray-600">Your volunteer account is currently being reviewed by an administrator. You will be able to accept requests once approved.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Active & Ready
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Active Tasks */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-secondary" />
            My Active Tasks
          </h2>
          
          {loading ? (
            <p>Loading...</p>
          ) : myTasks.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
              You have no active tasks. Accept a request from the pending list.
            </div>
          ) : (
            <div className="space-y-4">
              {myTasks.map(task => (
                <div key={task._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">{task.type}</span>
                    <span className="text-xs text-gray-500 font-medium">Status: {task.status}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{task.citizen?.name || 'Unknown Citizen'}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" /> {task.citizen?.phone || 'No phone'}
                    </p>
                    <p className="text-sm flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" /> {task.location?.address || 'Simulated Location'}
                    </p>
                  </div>
                  {task.description && (
                    <p className="mt-3 text-sm text-gray-700 bg-gray-50 p-2 rounded">{task.description}</p>
                  )}
                  
                  {task.status !== 'Completed' && (
                    <div className="mt-4 flex gap-2">
                      <select 
                        className="flex-1 text-sm rounded border-gray-300"
                        onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                        value={task.status}
                      >
                        <option value="Assigned">Assigned</option>
                        <option value="On the Way">On the Way</option>
                        <option value="Rescued">Rescued / Delivered</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Requests */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Nearby Emergency Requests
          </h2>
          
          {loading ? (
            <p>Loading...</p>
          ) : pendingRequests.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center text-gray-500">
              No pending emergency requests in your area.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map(req => (
                <div key={req._id} className="bg-red-50 p-5 rounded-xl border border-red-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold uppercase">{req.priority} Priority</span>
                    <span className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <h3 className="font-bold text-gray-900">{req.type}</h3>
                  <p className="text-sm flex items-center gap-1 text-gray-600 mt-1">
                    <MapPin className="h-4 w-4" /> {req.location?.address || 'Simulated Location'}
                  </p>
                  <p className="mt-2 text-sm text-gray-700">{req.description}</p>
                  
                  <button 
                    onClick={() => handleAccept(req._id)}
                    className="mt-4 w-full bg-primary text-white py-2 rounded font-medium hover:bg-primary-dark transition"
                  >
                    Accept & Respond
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
