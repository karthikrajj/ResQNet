import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setVolunteers(usersRes.data.filter(u => u.role === 'Volunteer'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, isApproved) => {
    try {
      await axios.put(`/api/admin/users/${id}/approve`, { isApproved }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchData();
    } catch (error) {
      alert('Failed to update approval status');
    }
  };

  if (loading || !stats) return <div className="p-8">Loading dashboard...</div>;

  const pieData = {
    labels: stats.requestStats.map(s => s._id),
    datasets: [
      {
        data: stats.requestStats.map(s => s.count),
        backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#6b7280'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Emergencies</p>
              <p className="text-3xl font-bold text-red-600">{stats.summary.activeEmergencies}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full text-red-600"><AlertTriangle /></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Volunteers</p>
              <p className="text-3xl font-bold text-primary">{stats.summary.totalVolunteers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-primary"><Users /></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Citizens</p>
              <p className="text-3xl font-bold text-gray-900">{stats.summary.totalCitizens}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full text-gray-600"><Users /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Shelters</p>
              <p className="text-3xl font-bold text-green-600">{stats.summary.totalShelters}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full text-green-600"><CheckCircle /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Status Distribution</h2>
          <div className="h-64 flex items-center justify-center">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Volunteer Approvals */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Approvals</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {volunteers.map(vol => (
                  <tr key={vol._id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{vol.name}</div>
                      <div className="text-sm text-gray-500">{vol.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vol.phone || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vol.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {vol.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {!vol.isApproved ? (
                        <button 
                          onClick={() => handleApprove(vol._id, true)}
                          className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded"
                        >
                          Approve
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleApprove(vol._id, false)}
                          className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded"
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
