import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookAppointment from "./pages/BookAppointment";
import Review from "./pages/Review";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />        {/* Landing page */}
        <Route path="/login" element={<Login />} /> {/* Login page */}
        <Route path="/register" element={<Register />} /> {/* Register page */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="bookappointment" />} /> {/* default tab */}
          <Route path="bookappointment" element={<BookAppointment />} />
          <Route path="review" element={<Review />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
