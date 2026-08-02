import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldAlert, Truck, Users, Activity, ArrowRight, Globe } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-[#0a0f1c] text-white overflow-hidden selection:bg-blue-500/30">
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/20 blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-purple-600/20 blur-[100px] animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-emerald-600/10 blur-[120px] animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 pt-20 pb-20 lg:pt-32 lg:pb-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-300">ResQNet System Online — Ready for Deployment</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Disaster Response</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            A centralized, AI-ready platform connecting citizens in distress with rapid response volunteers, NGOs, and medical facilities in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-white bg-blue-600 rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.8)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all group-hover:opacity-80"></span>
              <span className="relative">Deploy Now</span>
              <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-full backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
            >
              Access Command Center
            </Link>
          </div>
        </div>

        {/* Floating Dashboard Preview */}
        <div className="mt-24 lg:mt-32 relative mx-auto max-w-5xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30"></div>
          <div className="relative rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto text-xs font-medium text-slate-400 font-mono flex items-center gap-2">
                <ShieldAlert className="w-3 h-3" /> resqnet-tactical-overview
              </div>
            </div>
            <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Dashboard Mock Elements */}
              <div className="col-span-1 space-y-4">
                <div className="h-24 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 p-4 flex flex-col justify-between">
                  <span className="text-blue-400 text-xs font-medium uppercase tracking-wider">Active Incidents</span>
                  <span className="text-3xl font-light text-white flex items-center gap-2">
                    <Activity className="w-6 h-6 text-blue-400" /> 142
                  </span>
                </div>
                <div className="h-24 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 p-4 flex flex-col justify-between">
                  <span className="text-purple-400 text-xs font-medium uppercase tracking-wider">Available Units</span>
                  <span className="text-3xl font-light text-white flex items-center gap-2">
                    <Truck className="w-6 h-6 text-purple-400" /> 84
                  </span>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 h-full min-h-[200px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
                <Globe className="w-48 h-48 text-white/5 absolute -right-10 -bottom-10" />
                <div className="text-center z-10">
                  <Activity className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-pulse" />
                  <p className="text-slate-300 font-medium">Global Sensors Active</p>
                  <p className="text-xs text-slate-500 mt-1">Monitoring global distress signals...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 border-t border-white/10 pt-24 pb-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Tactical Advantages</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything required to orchestrate complex rescue operations and save lives with precision.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldAlert, title: 'One-Click SOS', desc: 'Instantly broadcast precise coordinates and situational data to command centers.', color: 'text-red-400', bg: 'bg-red-400/10' },
              { icon: Truck, title: 'Resource Tracking', desc: 'Real-time logistics for food, water, medicine, and critical supplies.', color: 'text-blue-400', bg: 'bg-blue-400/10' },
              { icon: Users, title: 'Unit Coordination', desc: 'AI-assisted routing of volunteers based on proximity and specialized skills.', color: 'text-purple-400', bg: 'bg-purple-400/10' },
              { icon: HeartPulse, title: 'Medical Maps', desc: 'Live capacity tracking for regional hospitals, shelters, and clinics.', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer">
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
