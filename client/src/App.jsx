import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import Feedback from "./pages/Feedback";
import AdminAppointments from "./pages/AdminAppointments";
import AdminServices from "./pages/AdminServices";
import AdminFeedbacks from "./pages/AdminFeedbacks";
import RoleCheckWrapper from "./pages/RoleCheckWrapper";
import Footer from "./footer/Footer";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <Router>

      <div className=" flex flex-col"> 
        <div className="flex-grow">
          {/* Main content will be rendered here based on the route */}
          <Routes>
        <Route path="/" element={<Home />} />        {/* Landing page */}
        <Route path="/login" element={<Login />} /> {/* Login page */}
        <Route path="/register" element={<Register />} /> {/* Register page */}
        <Route path="/dashboard" element={<RoleCheckWrapper />}>

          {/* Client routes */}
          <Route index element={<Navigate to="bookappointment" />} /> {/* default tab */}
          <Route path="bookappointment" element={<BookAppointment />} />
          <Route path="myappointments" element={<MyAppointments />} />
          <Route path="feedback" element={<Feedback />} />

          {/* Admin routes */}
          <Route path="adminappointments" element={<AdminAppointments />} />
          <Route path="adminservices" element={<AdminServices />} />
          <Route path="adminfeedbacks" element={<AdminFeedbacks />} />
           

        </Route>
        </Routes>
        </div>
        <Footer />
      </div>
      
    </Router>
  );
}

export default App;
