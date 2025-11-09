import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import LogoImage from '../assets/Logo.jpg';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left sidebar */}
      <div className="w-64 bg-stone-900 text-white flex flex-col items-center py-8">
        <div className="w-24 h-24 mb-8">
          <img src={LogoImage} alt="Logo" className="w-full h-full object-cover rounded-full" />
        </div>
        <nav className="flex flex-col space-y-4 w-full">
          <NavLink
            to="bookappointment"
            className={({ isActive }) =>
              `block px-6 py-3 rounded-xl text-center ${isActive ? 'bg-rose-400 text-stone-900 font-semibold' : 'hover:bg-stone-700'}`
            }
          >
            Book Appointment
          </NavLink>
          <NavLink
            to="review"
            className={({ isActive }) =>
              `block px-6 py-3 rounded-xl text-center ${isActive ? 'bg-rose-400 text-stone-900 font-semibold' : 'hover:bg-stone-700'}`
            }
          >
            Review
          </NavLink>
          <NavLink
            to="profile"
            className={({ isActive }) =>
              `block px-6 py-3 rounded-xl text-center ${isActive ? 'bg-rose-400 text-stone-900 font-semibold' : 'hover:bg-stone-700'}`
            }
          >
            View Profile
          </NavLink>
        </nav>
      </div>

      {/* Right content area */}
      <div className="flex-1 bg-amber-50 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
