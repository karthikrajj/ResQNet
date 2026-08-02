import axios from 'axios';

const getInitialRequests = () => {
  const saved = localStorage.getItem('resqnet_requests');
  if (saved) return JSON.parse(saved);
  
  const initial = [
    { 
      _id: 'REQ-1', 
      citizenId: 'CIT-123', 
      type: 'Medical', 
      description: 'Severe trauma reported. Need immediate medevac.', 
      location: { lat: 37.7749, lng: -122.4194, address: 'Sector 4 - Downtown' },
      status: 'Pending',
      createdAt: new Date().toISOString()
    },
    { 
      _id: 'REQ-2', 
      citizenId: 'CIT-456', 
      type: 'Rescue', 
      description: 'Trapped in flooded building. Water rising.', 
      location: { lat: 37.7849, lng: -122.4094, address: 'Sector 2 - Riverside' },
      status: 'In Progress', 
      volunteer: { name: 'Fire Battalion 7', phone: 'DISPATCH-FREQ-44.1' },
      messages: [
        { sender: 'Citizen', text: 'Water is up to the second floor!' },
        { sender: 'First Responder Unit', text: 'Hold tight. Aerial rescue inbound in 2 mikes.' }
      ],
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ];
  localStorage.setItem('resqnet_requests', JSON.stringify(initial));
  return initial;
};

export const setupMockAdapter = () => {
  axios.defaults.adapter = async (config) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const url = config.url;
        const method = config.method?.toUpperCase();
        
        let status = 200;
        let data = {};

        try {
          // --- AUTH ROUTES ---
          if (url.includes('/api/auth/login')) {
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
            const { email, password } = body;
            
            let role = 'Citizen';
            let name = 'Demo Citizen';
            let phone = '555-1234';
            
            if (email === 'admin@resqnet.com') { role = 'Admin'; name = 'System Administrator'; }
            else if (email === 'volunteer@resqnet.com') { role = 'Volunteer'; name = 'Demo Volunteer'; phone = '555-0303'; }
            else if (email !== 'citizen@resqnet.com') {
              const localUsers = JSON.parse(localStorage.getItem('resqnet_users') || '[]');
              const foundUser = localUsers.find(u => u.email === email && u.password === password);
              if (foundUser) {
                role = foundUser.role;
                name = foundUser.name;
                phone = foundUser.phone;
              } else {
                return reject({ response: { data: { message: 'Invalid credentials. Please use demo protocols.' } } });
              }
            }
            
            data = { _id: Math.random().toString(36).substr(2, 9), name, email, role, phone, token: 'mock-jwt-token' };
          } 
          else if (url.includes('/api/auth/register')) {
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
            const localUsers = JSON.parse(localStorage.getItem('resqnet_users') || '[]');
            localUsers.push(body);
            localStorage.setItem('resqnet_users', JSON.stringify(localUsers));
            
            data = { _id: Math.random().toString(36).substr(2, 9), ...body, token: 'mock-jwt-token' };
          }
          
          // --- REQUEST ROUTES (Citizen & Volunteer) ---
          else if (url.includes('/api/citizen/sos') && method === 'POST') {
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
            const requests = getInitialRequests();
            
            const newReq = {
              _id: Math.random().toString(36).substr(2, 9),
              type: body.type,
              description: body.description,
              location: body.location || { address: 'Current Location' },
              priority: body.priority || 'High',
              status: 'Pending',
              citizen: { name: 'Demo Citizen', phone: '555-1234' },
              createdAt: new Date().toISOString()
            };
            
            requests.unshift(newReq); // Add to top
            localStorage.setItem('resqnet_requests', JSON.stringify(requests));
            data = newReq;
          }
          else if (url.includes('/api/citizen/requests') || url.includes('/api/volunteer/requests') && !url.includes('/accept') && !url.includes('/status')) {
            data = getInitialRequests();
          }
          
          else if (url.includes('/api/volunteer/requests/') && url.includes('/accept')) {
            const match = url.match(/\/requests\/([^/]+)\/accept/);
            const id = match ? match[1] : null;
            const requests = getInitialRequests();
            const req = requests.find(r => r._id === id);
            if (req) {
              req.status = 'Assigned';
              req.volunteer = { name: 'Demo Volunteer', phone: '555-0303' };
              localStorage.setItem('resqnet_requests', JSON.stringify(requests));
            }
            data = { message: 'Accepted' };
          }
          else if (url.includes('/api/volunteer/requests/') && url.includes('/status')) {
            const match = url.match(/\/requests\/([^/]+)\/status/);
            const id = match ? match[1] : null;
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
            const requests = getInitialRequests();
            const req = requests.find(r => r._id === id);
            if (req) {
              req.status = body.status;
              localStorage.setItem('resqnet_requests', JSON.stringify(requests));
            }
            data = { message: 'Updated' };
          }
          else if (url.includes('/api/requests/') && url.includes('/chat')) {
            const match = url.match(/\/requests\/([^/]+)\/chat/);
            const id = match ? match[1] : null;
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
            const requests = getInitialRequests();
            const req = requests.find(r => r._id === id);
            if (req) {
              if (!req.messages) req.messages = [];
              req.messages.push({ sender: body.sender, text: body.text });
              localStorage.setItem('resqnet_requests', JSON.stringify(requests));
            }
            data = req;
          }
          
          // --- ADMIN ROUTES ---
          else if (url.includes('/api/admin/analytics')) {
            const requests = getInitialRequests();
            const active = requests.filter(r => r.status !== 'Completed').length;
            const pending = requests.filter(r => r.status === 'Pending').length;
            const assigned = requests.filter(r => r.status !== 'Pending' && r.status !== 'Completed').length;
            const completed = requests.filter(r => r.status === 'Completed').length;

            data = {
              summary: { activeEmergencies: active, totalVolunteers: 84, totalCitizens: 1205, totalShelters: 12 },
              requestStats: [
                { _id: 'Pending', count: pending },
                { _id: 'Assigned', count: assigned },
                { _id: 'Completed', count: completed }
              ]
            };
          }
          else if (url.includes('/api/admin/users')) {
            data = [
              { _id: 'v1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', role: 'Volunteer', isApproved: true },
              { _id: 'v2', name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', role: 'Volunteer', isApproved: false }
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
      }, 300);
    });
  };
};
