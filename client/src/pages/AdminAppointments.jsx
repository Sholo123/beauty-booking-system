// src/pages/AdminAppointments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaCalendarAlt, FaClock, FaMoneyBillWave, FaHourglassHalf } from "react-icons/fa";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/appointments/get-all-appointments");
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Accept appointment
  const handleAccept = async (appointmentId) => {
    try {
      await axios.put(`http://localhost:4000/api/appointments/accept-appointment/${appointmentId}`);
      alert("Appointment confirmed");
      fetchAppointments();
    } catch (error) {
      console.error("Error accepting appointment:", error);
    }
  };

  // Reject appointment
  const handleReject = async (appointmentId) => {
    try {
      await axios.put(`http://localhost:4000/api/appointments/reject-appointment/${appointmentId}`);
      alert("Appointment rejected");
      fetchAppointments();
    } catch (error) {
      console.error("Error rejecting appointment:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-stone-200 border-t-stone-500 mb-4"></div>
          <p className="text-stone-600 text-lg">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-stone-800 mb-2" style={{ fontFamily: 'serif' }}>
            All Appointments
          </h1>
          <p className="text-stone-600">Manage all client appointments</p>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-stone-200">
            <div className="text-stone-300 text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-stone-700 mb-2">
              No appointments yet
            </h3>
            <p className="text-stone-500">
              No client appointments found.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {appointments.map((a) => (
              <div
                key={a.appointment_id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-200"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-stone-100 to-rose-100 p-3 rounded-xl border border-stone-200">
                      <span className="text-2xl">💅</span>
                    </div>
                    
                    <div className="flex-1">
                      {/* Service Name and Status */}
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-stone-800">
                          {a.service_name}
                        </h3>
                        <span
                          className={`px-3 py-1 text-sm rounded-full font-medium ${
                            a.status === "confirmed"
                              ? "bg-green-100 text-green-700 border border-green-300"
                              : a.status === "rejected"
                              ? "bg-rose-100 text-rose-700 border border-rose-300"
                              : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                      
                      {/* Client Information */}
                      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <FaUser className="text-stone-500" />
                          <span className="font-semibold text-stone-700">Client Information</span>
                        </div>
                        <div className="space-y-1 text-stone-600">
                          <p>
                            <strong className="text-stone-700">Name:</strong> {a.user_first_name} {a.user_last_name}
                          </p>
                          <p>
                            <strong className="text-stone-700">Email:</strong> {a.user_email}
                          </p>
                          <p>
                            <strong className="text-stone-700">Phone:</strong> {a.user_phone}
                          </p>
                        </div>
                      </div>
                      
                      {/* Appointment Details */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-stone-600">
                          <FaCalendarAlt className="text-stone-500" />
                          Date:
                          <span className="font-medium">
                            {new Date(a.appointment_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-stone-600">
                          <FaClock className="text-rose-400" />
                          Time Slot:
                          <span className="font-medium">{a.time_slot}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-stone-600">
                          <FaMoneyBillWave className="text-green-500" />
                            Service Price:
                          <span className="font-medium">R{a.service_price}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-stone-600">
                          <FaHourglassHalf className="text-blue-500" />
                            Service Duration:
                          <span className="font-medium">{a.service_duration} minutes</span>
                        </div>
                      </div>
                      
                      {/* Service Description */}
                      {a.service_description && (
                        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                          <p className="text-sm text-stone-700">
                            <strong className="text-rose-700">Description:</strong> {a.service_description}
                          </p>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      {a.status === "pending" && (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleAccept(a.appointment_id)}
                            className="bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 px-6 py-3 rounded-xl font-medium hover:from-stone-400 hover:to-rose-400 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                          >
                           Confirm
                          </button>
                          
                          <button
                            onClick={() => handleReject(a.appointment_id)}
                            className="bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 px-6 py-3 rounded-xl font-medium hover:from-stone-400 hover:to-rose-400 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;