import React, { useEffect, useState } from "react";

const MyAppointments = () => {
  const userId = localStorage.getItem("userId");

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState({
    appointment_date: "",
    slot_time: "",
    serviceId: "",
  });

  const availableSlots = [
    "08:00 - 09:30",
    "11:00 - 12:30",
    "14:00 - 15:30",
  ];

  // Fetch appointments and services
  useEffect(() => {
    if (!userId) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/appointments/get-appointments/${userId}`
        );
        const data = await res.json();
        if (res.ok) setAppointments(data);
        else setError(data.message || "Failed to fetch appointments");
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Error fetching appointments");
      } finally {
        setLoading(false);
      }
    };

    const fetchServices = async () => {
      try {
        const res = await fetch(
          "http://localhost:4000/api/services/get-services"
        );
        const data = await res.json();
        if (res.ok) setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchAppointments();
    fetchServices();
  }, [userId]);

  // Cancel and DELETE appointment
  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/appointments/delete-appointment/${appointmentId}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Appointment cancelled and deleted successfully.");
        setAppointments((prev) =>
          prev.filter((appt) => appt.appointment_id !== appointmentId)
        );
      } else {
        alert(data.message || "Failed to cancel appointment.");
      }
    } catch (err) {
      console.error("Error cancelling appointment:", err);
    }
  };

  // Update appointment details
  const handleUpdate = async (appointmentId) => {
    if (!formData.appointment_date || !formData.slot_time || !formData.serviceId) {
      alert("Please fill all fields before updating.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:4000/api/appointments/update-appointment/${appointmentId}/${userId}/${formData.serviceId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointment_date: formData.appointment_date,
            slot_time: formData.slot_time,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Appointment updated successfully!");
        setAppointments((prev) =>
          prev.map((a) =>
            a.appointment_id === appointmentId
              ? {
                  ...a,
                  appointment_date: formData.appointment_date,
                  time_slot: formData.slot_time,
                  service_name:
                    services.find(
                      (s) => s.service_id === parseInt(formData.serviceId)
                    )?.name || a.service_name,
                  status: "pending",
                }
              : a
          )
        );
        setEditMode(null);
      } else {
        alert(data.message || "Failed to update appointment");
      }
    } catch (err) {
      console.error("Error updating appointment:", err);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center border border-stone-200">
          <div className="text-stone-500 text-5xl mb-4">🔒</div>
          <p className="text-stone-700 font-medium text-lg">
            Please log in to view your appointments
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-stone-200 border-t-stone-500 mb-4"></div>
          <p className="text-stone-600 text-lg">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-stone-800 mb-2" style={{ fontFamily: 'serif' }}>
            My Appointments
          </h1>
          <p className="text-stone-600">Manage your beauty appointments</p>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-stone-200">
            <div className="text-stone-300 text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-stone-700 mb-2">
              No appointments yet
            </h3>
            <p className="text-stone-500">
              Book your first beauty treatment today!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {appointments.map((appt) => (
              <div
                key={appt.appointment_id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-200"
              >
                {editMode === appt.appointment_id ? (
                  <div className="p-6 bg-gradient-to-r from-stone-50 to-rose-50">
                    <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                      
                      Edit Appointment
                    </h3>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          value={formData.appointment_date}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              appointment_date: e.target.value,
                            })
                          }
                          className="w-full bg-white border-2 border-stone-200 focus:border-rose-400 focus:outline-none p-3 rounded-xl transition-colors text-stone-800"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Time Slot
                        </label>
                        <select
                          value={formData.slot_time}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              slot_time: e.target.value,
                            })
                          }
                          className="w-full bg-white border-2 border-stone-200 focus:border-rose-400 focus:outline-none p-3 rounded-xl transition-colors text-stone-800"
                        >
                          <option value="">Select Time</option>
                          {availableSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Service
                        </label>
                        <select
                          value={formData.serviceId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              serviceId: e.target.value,
                            })
                          }
                          className="w-full bg-white border-2 border-stone-200 focus:border-rose-400 focus:outline-none p-3 rounded-xl transition-colors text-stone-800"
                        >
                          <option value="">Select Service</option>
                          {services.map((s) => (
                            <option key={s.service_id} value={s.service_id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdate(appt.appointment_id)}
                        className="flex-1 bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 px-6 py-3 rounded-xl font-medium hover:from-stone-400 hover:to-rose-400 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditMode(null)}
                        className="flex-1 bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 px-6 py-3 rounded-xl font-medium hover:from-stone-400 hover:to-rose-400 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Appointment Details */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                        {/* Find the service linked to this appointment */}
                        {(() => {
                          const service = services.find(
                            (s) => s.service_id === appt.service_id
                          );

                          return (
                            <img
                              src={
                                service?.images?.length > 0
                                  ? `http://localhost:4000${service.images[0].image_url}`
                                  : "/fallback.jpg"
                              }
                              alt={service?.name}
                              className="w-40 h-40 object-cover rounded-xl border"
                            />
                          );
                        })()}

                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-stone-800 mb-3">
                              {appt.service_name}
                            </h3>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-stone-600">
                                <span className="text-stone-500">📅</span>
                                <span className="font-medium">
                                  {new Date(appt.appointment_date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-stone-600">
                                <span className="text-rose-400">🕒</span>
                                <span className="font-medium">{appt.time_slot}</span>
                              </div>
                              
                              <div className="inline-block mt-2">
                                <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                            appt.status === "confirmed"
                              ? "bg-green-100 text-green-700 border border-green-300"
                              : appt.status === "rejected"
                              ? "bg-rose-100 text-rose-700 border border-rose-300"
                              : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                          }`}>
                                  {appt.status || 'Pending'}
                             
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 lg:flex-col xl:flex-row">
                        <button
                          onClick={() => {
                            setEditMode(appt.appointment_id);
                            setFormData({
                              appointment_date: appt.appointment_date,
                              slot_time: appt.time_slot,
                              serviceId:
                                services.find((s) => s.name === appt.service_name)?.service_id || "",
                            });
                          }}
                          disabled={appt.status === "confirmed"} // Disable if confirmed
                          className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                            appt.status === "confirmed"
                              ? "bg-stone-200 text-stone-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 hover:from-stone-400 hover:to-rose-400 hover:shadow-lg"
                          }`}
                        >
                          Reschedule
                        </button>

                        <button
                          onClick={() => handleCancel(appt.appointment_id)}
                          disabled={appt.status === "confirmed"} // Disable if confirmed
                          className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                            appt.status === "confirmed"
                              ? "bg-stone-200 text-stone-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 hover:from-stone-400 hover:to-rose-400 hover:shadow-lg"
                          }`}
                        >
                          
                          Cancel
                        </button>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;