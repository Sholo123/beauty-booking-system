import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import LogoImage from "../assets/Logo.jpg";

const Dashboard = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
        <h2 className="text-lg font-semibold text-stone-700">BalmyFlare Beautique</h2>
        <button
          className="p-2 rounded-lg border bg-stone-100"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full md:h-auto z-30
          transform ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          transition-transform duration-300 ease-in-out
          w-64 bg-gradient-to-b from-stone-100 to-stone-50 shadow-xl 
          border-r border-stone-200 flex flex-col items-center py-8 
          rounded-r-3xl
        `}
      >
        {/* Logo */}
        <div className="w-24 h-24 mb-6 shadow-lg rounded-full overflow-hidden ring-4 ring-stone-200">
          <img src={LogoImage} alt="Logo" className="w-full h-full object-cover" />
        </div>

        {/* App Name */}
        <h2
          className="text-xl font-semibold text-stone-700 mb-8 tracking-wide"
          style={{ fontFamily: "serif" }}
        >
          BalmyFlare Beautique
        </h2>

        {/* Navigation */}
        <nav className="flex flex-col space-y-3 w-full px-4">
          <NavLink
            to="bookappointment"
            className={({ isActive }) =>
              `block px-6 py-3 text-center rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-stone-200 to-rose-200 text-stone-800 shadow-md border border-stone-300"
                  : "bg-white/70 text-stone-600 hover:bg-stone-100"
              }`
            }
            onClick={() => setOpen(false)}
          >
            Book Appointment
          </NavLink>

          <NavLink
            to="myappointments"
            className={({ isActive }) =>
              `block px-6 py-3 text-center rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-stone-200 to-rose-200 text-stone-800 shadow-md border border-stone-300"
                  : "bg-white/70 text-stone-600 hover:bg-stone-100"
              }`
            }
            onClick={() => setOpen(false)}
          >
            My Appointments
          </NavLink>

          <NavLink
            to="feedback"
            className={({ isActive }) =>
              `block px-6 py-3 text-center rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-stone-200 to-rose-200 text-stone-800 shadow-md border border-stone-300"
                  : "bg-white/70 text-stone-600 hover:bg-stone-100"
              }`
            }
            onClick={() => setOpen(false)}
          >
            My Feedback
          </NavLink>

          <NavLink
            to="/"
            className="block px-6 py-3 text-center rounded-xl bg-white/70 text-stone-600 hover:bg-stone-100"
            onClick={() => setOpen(false)}
          >
            Log Out
          </NavLink>
        </nav>

        <div className="mt-auto text-xs text-stone-500 italic pt-8 hidden md:block">
          © 2025 BalmyFlare Beautique
        </div>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 mt-4 md:mt-0 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white/90 shadow-lg rounded-2xl p-6 md:p-8 border border-stone-100">
          <Outlet />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
