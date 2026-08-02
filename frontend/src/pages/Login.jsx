import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, ShieldAlert } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const user = await login(email, password);
      if (user.role === 'Citizen') navigate('/citizen');
      else if (user.role === 'Volunteer') navigate('/volunteer');
      else if (user.role === 'Admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (role) => {
    if (role === 'citizen') { setEmail('citizen@resqnet.com'); setPassword('password123'); }
    if (role === 'volunteer') { setEmail('volunteer@resqnet.com'); setPassword('password123'); }
    if (role === 'admin') { setEmail('admin@resqnet.com'); setPassword('password123'); }
  };

  return (
    <div className="flex relative min-h-[calc(100vh-80px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0a0f1c] overflow-hidden">
      {/* Background blobs for Login */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-purple-600/10 blur-[100px] animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 bg-white/5 p-10 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10">
        <div>
          <div className="mx-auto flex justify-center text-blue-400">
            <ShieldAlert className="h-12 w-12" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
            Command Center Access
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
              deploy a new unit
            </Link>
          </p>
        </div>
        
        {/* Quick Test Links */}
        <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20">
          <p className="font-medium text-blue-300 text-xs mb-3 uppercase tracking-wider text-center">Demo Protocols:</p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => fillCredentials('citizen')} type="button" className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all">Citizen</button>
            <button onClick={() => fillCredentials('volunteer')} type="button" className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all">Volunteer</button>
            <button onClick={() => fillCredentials('admin')} type="button" className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all">Admin</button>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-md">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-xl border-0 py-3 px-4 bg-white/5 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 transition-all"
                placeholder="Secure ID (Email)"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-xl border-0 py-3 px-4 bg-white/5 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 transition-all"
                placeholder="Clearance Code (Password)"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.6)]"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                <LogIn className="h-5 w-5 text-blue-300 group-hover:text-white transition-colors" aria-hidden="true" />
              </span>
              {isLoading ? 'Authenticating...' : 'Establish Connection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
