import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, ShieldAlert } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Citizen',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const user = await register(formData);
      if (user.role === 'Citizen') navigate('/citizen');
      else if (user.role === 'Volunteer') navigate('/volunteer');
      else if (user.role === 'Admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex relative min-h-[calc(100vh-80px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0a0f1c] overflow-hidden">
      {/* Background blobs for Register */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[30%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-emerald-600/10 blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[100px] animate-blob" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 bg-white/5 p-10 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10">
        <div>
          <div className="mx-auto flex justify-center text-emerald-400">
            <ShieldAlert className="h-12 w-12" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
            Register Unit
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              Access command center
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-md">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="relative block w-full rounded-xl border-0 py-3 px-4 bg-white/5 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 transition-all"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="relative block w-full rounded-xl border-0 py-3 px-4 bg-white/5 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 transition-all"
                placeholder="Secure ID (Email)"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="relative block w-full rounded-xl border-0 py-3 px-4 bg-white/5 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 transition-all"
                placeholder="Clearance Code (Password)"
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="relative block w-full rounded-xl border-0 py-3 px-4 bg-white/5 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 transition-all"
                placeholder="Secure Comm Link (Phone)"
              />
            </div>
            <div>
              <label htmlFor="role" className="sr-only">Account Type</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="relative block w-full rounded-xl border-0 py-3 px-4 bg-white/5 text-white ring-1 ring-inset ring-white/10 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 transition-all [&>option]:bg-slate-900 [&>option]:text-white"
              >
                <option value="Citizen" className="bg-slate-900">Citizen (Requires Assistance)</option>
                <option value="Volunteer" className="bg-slate-900">First Responder Unit (Fire/Med)</option>
                <option value="Admin" className="bg-slate-900">Police Dispatch (Command)</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 transition-all shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.6)]"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                <UserPlus className="h-5 w-5 text-emerald-300 group-hover:text-white transition-colors" aria-hidden="true" />
              </span>
              {isLoading ? 'Initializing Unit...' : 'Deploy Unit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
