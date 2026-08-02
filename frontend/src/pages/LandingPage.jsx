import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldAlert, Truck, Users, Activity } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100/20">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <div className="flex items-center gap-2 mb-6">
                  <ShieldAlert className="h-10 w-10 text-primary" />
                  <span className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">ResQ<span className="text-secondary">Net</span></span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Smart Disaster Response & Resource Management
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  A centralized platform connecting citizens in distress with rapid response volunteers, NGOs, and medical facilities. Request help, manage resources, and save lives faster.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    to="/register"
                    className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all"
                  >
                    Get Started
                  </Link>
                  <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
                    Log in <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            <div
              className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-blue-600/10 ring-1 ring-blue-50 md:-mr-20 lg:-mr-36"
              aria-hidden="true"
            />
            <div className="shadow-lg md:rounded-3xl">
              <div className="bg-primary [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
                <div className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-blue-100 opacity-20 ring-1 ring-inset ring-white md:ml-20 lg:ml-36" />
                <div className="relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0">
                  <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                    <div className="w-screen overflow-hidden rounded-tl-xl bg-gray-900">
                      <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                        <div className="-mb-px flex text-sm font-medium leading-6 text-gray-400">
                          <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                            Dashboard
                          </div>
                          <div className="border-r border-gray-600/10 px-4 py-2">SOS Map</div>
                        </div>
                      </div>
                      <div className="px-6 pb-14 pt-6 h-[400px] flex items-center justify-center text-white/50 border-t border-white/5 bg-gray-900">
                        <Activity className="h-24 w-24 animate-pulse text-secondary/70" />
                      </div>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 md:rounded-3xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-secondary">Rapid Action</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need in an emergency
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            ResQNet streamlines the chaos of disaster management by connecting resources to the people who need them most.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <ShieldAlert className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                One-Click SOS
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Instantly broadcast your location and needs to nearby volunteers and command centers.
              </dd>
            </div>
            
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Truck className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Resource Tracking
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Manage inventory of food, water, medicine, and shelters in real-time.
              </dd>
            </div>
            
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Users className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Volunteer Coordination
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Efficiently route approved volunteers to incidents based on proximity and severity.
              </dd>
            </div>
            
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <HeartPulse className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Medical & Shelter Maps
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Interactive maps showing active shelters, hospitals, and their current capacity.
              </dd>
            </div>

          </dl>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
