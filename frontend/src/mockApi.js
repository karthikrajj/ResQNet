import axios from 'axios';

export const setupMockAdapter = () => {
  axios.defaults.adapter = async (config) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const url = config.url;
        
        let status = 200;
        let data = {};

        try {
          if (url.includes('/api/auth/login')) {
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
            const { email, password } = body;
            
            let role = 'Citizen';
            let name = 'Demo Citizen';
            
            if (email === 'admin@resqnet.com') { role = 'Admin'; name = 'System Administrator'; }
            else if (email === 'volunteer@resqnet.com') { role = 'Volunteer'; name = 'Demo Volunteer'; }
            else if (email !== 'citizen@resqnet.com') {
              const localUsers = JSON.parse(localStorage.getItem('resqnet_users') || '[]');
              const foundUser = localUsers.find(u => u.email === email && u.password === password);
              if (foundUser) {
                role = foundUser.role;
                name = foundUser.name;
              } else {
                return reject({ response: { data: { message: 'Invalid credentials. Please use demo protocols.' } } });
              }
            }
            
            data = { _id: Math.random().toString(36).substr(2, 9), name, email, role, token: 'mock-jwt-token' };
          } 
          else if (url.includes('/api/auth/register')) {
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
            const localUsers = JSON.parse(localStorage.getItem('resqnet_users') || '[]');
            localUsers.push(body);
            localStorage.setItem('resqnet_users', JSON.stringify(localUsers));
            
            data = { _id: Math.random().toString(36).substr(2, 9), ...body, token: 'mock-jwt-token' };
          }
          else if (url.includes('/api/admin/analytics')) {
            data = {
              summary: { activeEmergencies: 142, totalVolunteers: 84, totalCitizens: 1205, totalShelters: 12 },
              requestStats: [
                { _id: 'Pending', count: 45 },
                { _id: 'In Progress', count: 32 },
                { _id: 'Resolved', count: 65 }
              ]
            };
          }
          else if (url.includes('/api/admin/users')) {
            data = [
              { _id: 'v1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', role: 'Volunteer', isApproved: true },
              { _id: 'v2', name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', role: 'Volunteer', isApproved: false }
            ];
          }
          else if (url.includes('/api/citizen/requests')) {
            data = [
              { _id: 'r1', type: 'Medical', location: { coordinates: [0,0] }, description: 'Need immediate medical assistance', status: 'Pending', createdAt: new Date().toISOString() },
              { _id: 'r2', type: 'Rescue', location: { coordinates: [1,1] }, description: 'Flood rescue required', status: 'In Progress', createdAt: new Date().toISOString() }
            ];
          }
          else if (url.includes('/api/volunteer/requests')) {
            data = [
              { _id: 'r1', type: 'Medical', location: { coordinates: [0,0] }, description: 'Need immediate medical assistance', status: 'Pending', citizen: { name: 'Alice', phone: '555-0101' }, createdAt: new Date().toISOString() }
            ];
          }
          else {
            data = { message: 'Mock response' };
          }

          resolve({
            data,
            status,
            statusText: 'OK',
            headers: {},
            config,
            request: {}
          });
        } catch (error) {
          reject({ response: { data: { message: 'Mock Adapter Error' } } });
        }
      }, 600);
    });
  };
};
