// src/pages/AdminFeedbacks.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaUser, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch all feedbacks (default)
  const fetchAllFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/feedback/get-all-feedbacks");
      setFeedbacks(res.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all services (for dropdown)
  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/services/get-services");
      setServices(res.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Fetch feedbacks for selected service
  const fetchFeedbackByService = async (serviceId) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/feedback/get-service-feedback/${serviceId}`);
      setFeedbacks(res.data);
    } catch (error) {
      console.error("Error fetching service feedbacks:", error);
    }
  };

  useEffect(() => {
    fetchAllFeedbacks();
    fetchServices();
  }, []);

  // Handle filter change
  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    setSelectedService(serviceId);
    if (serviceId === "all") {
      fetchAllFeedbacks();
    } else {
      fetchFeedbackByService(serviceId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-stone-200 border-t-stone-500 mb-4"></div>
          <p className="text-stone-600 text-lg">Loading feedbacks...</p>
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
            Client Feedbacks
          </h1>
          <p className="text-stone-600">View and manage customer feedbacks</p>
        </div>

        {/* Filter Dropdown */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-stone-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="text-stone-700 font-semibold text-lg">Filter by Service:</label>
            <select
              value={selectedService}
              onChange={handleServiceChange}
              className="flex-1 sm:flex-initial border-2 border-stone-200 rounded-xl px-4 py-3 bg-white text-stone-700 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 focus:outline-none transition-all"
            >
              <option value="all">All Services</option>
              {services.map((s) => (
                <option key={s.service_id} value={s.service_id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Feedback list */}
        {feedbacks.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-stone-200">
            <div className="text-stone-300 text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-stone-700 mb-2">
              No feedbacks yet
            </h3>
            <p className="text-stone-500">
              Customer feedbacks will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {feedbacks.map((f) => (
              <div
                key={f.feedback_id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-200"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-stone-100 to-rose-100 p-3 rounded-xl border border-stone-200">
                      <span className="text-2xl">💅</span>
                    </div>
                    
                    <div className="flex-1">
                      {/* Top row: Service Name + Date */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                        <h3 className="text-xl font-bold text-stone-800">
                          {f.service_name}
                        </h3>
                        <div className="flex items-center gap-2 text-stone-500">
                          <FaCalendarAlt className="text-sm" />
                          <span className="text-sm font-medium">
                            {new Date(f.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-stone-700 font-semibold">Rating:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              size={18}
                              color={star <= f.rating ? "#F43F5E" : "#D1D5DB"}
                            />
                          ))}
                        </div>
                        <span className="text-stone-600 ml-1">({f.rating}/5)</span>
                      </div>

                      {/* Client Information */}
                      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <FaUser className="text-stone-500" />
                          <span className="font-semibold text-stone-700">Client Information</span>
                        </div>
                        <div className="space-y-2 text-stone-600">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-stone-400 text-sm" />
                            <p>
                              <strong className="text-stone-700">Name:</strong> {f.user_first_name} {f.user_last_name}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-stone-400 text-sm" />
                            <p>
                              <strong className="text-stone-700">Email:</strong> {f.user_email}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaPhone className="text-stone-400 text-sm" />
                            <p>
                              <strong className="text-stone-700">Phone:</strong> {f.user_phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Comment */}
                      {f.comment && (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                          <p className="text-stone-700">
                            <strong className="text-rose-700">Feedback:</strong>
                          </p>
                          <p className="text-stone-600 mt-2 ">{f.comment}</p>
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

export default AdminFeedbacks;