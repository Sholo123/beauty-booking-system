import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import LogoImage from '../assets/Logo.jpg';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-stone-100 to-stone-50 shadow-xl border-r border-stone-200 flex flex-col items-center py-8 rounded-r-3xl z-20 relative">
        {/* Logo */}
        <div className="w-24 h-24 mb-6 shadow-lg rounded-full overflow-hidden ring-4 ring-stone-200">
          <img
            src={LogoImage}
            alt="Logo"
            className="w-full h-full object-cover"
          />
        </div>
        {/* App Name */}
        <h2 className="text-xl font-semibold text-stone-700 mb-8 tracking-wide" style={{ fontFamily: 'serif' }}>
          BalmyFlare Beautique
        </h2>
        {/* Navigation */}
        <nav className="flex flex-col space-y-3 w-full px-4">
          <NavLink
            to="adminappointments"
            className={({ isActive }) =>
              `block px-6 py-3 text-center rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-stone-200 to-rose-200 text-stone-800 font-semibold shadow-md border border-stone-300'
                  : 'bg-white/70 text-stone-600 hover:bg-stone-100 border border-transparent hover:border-stone-200'
              }`
            }
          >
           Booked Appointments
          </NavLink>
          <NavLink
            to="adminfeedbacks"
            className={({ isActive }) =>
              `block px-6 py-3 text-center rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-stone-200 to-rose-200 text-stone-800 font-semibold shadow-md border border-stone-300'
                  : 'bg-white/70 text-stone-600 hover:bg-stone-100 border border-transparent hover:border-stone-200'
              }`
            }
          >
           Service Feedbacks
          </NavLink>
          <NavLink
            to="adminservices"
            className={({ isActive }) =>
              `block px-6 py-3 text-center rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-stone-200 to-rose-200 text-stone-800 font-semibold shadow-md border border-stone-300'
                  : 'bg-white/70 text-stone-600 hover:bg-stone-100 border border-transparent hover:border-stone-200'
              }`
            }
          >
            Add Service
          </NavLink>
         <NavLink
            to="/"
            className={({ isActive }) =>
                `block px-6 py-3 text-center rounded-xl transition-all duration-300 ${
                isActive
                    ? 'bg-gradient-to-r from-stone-200 to-rose-200 text-stone-800 font-semibold shadow-md border border-stone-300'
                    : 'bg-white/70 text-stone-600 hover:bg-stone-100 border border-transparent hover:border-stone-200'
                }`
            }
            >
            Log Out
        </NavLink>

        </nav>
        {/* Footer */}
        <div className="mt-auto text-xs text-stone-500 italic pt-8">
          © 2025 BalmyFlare Beautique
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-white/80 to-stone-50/50 rounded-l-3xl shadow-inner p-8 overflow-y-auto border-l border-stone-200">
        <div className="max-w-4xl mx-auto bg-white/90 shadow-lg rounded-2xl p-8 border border-stone-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;