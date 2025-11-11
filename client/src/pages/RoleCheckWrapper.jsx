// src/pages/RoleCheckWrapper.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";

const RoleCheckWrapper = () => {
  const [isAdmin, setIsAdmin] = useState(null); // null = still loading
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/users/is-admin/${userId}`);
        setIsAdmin(res.data.isAdmin);
      } catch (err) {
        console.error("Failed to check admin status:", err);
        setIsAdmin(false);
      }
    };

    if (userId) checkRole();
  }, [userId]);

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center h-screen text-stone-600">
        Checking permissions...
      </div>
    );
  }

  return isAdmin ? <AdminDashboard /> : <Dashboard />;
};

export default RoleCheckWrapper;
