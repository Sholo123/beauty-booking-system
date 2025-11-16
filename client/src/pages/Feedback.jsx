import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa'; 

const Feedback = () => {
  const userId = localStorage.getItem('userId');

  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [editFeedbackId, setEditFeedbackId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/appointments/get-appointments/${userId}`);
        const data = await res.json();
        if (res.ok) setAppointments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/feedback/get-user-feedback/${userId}`);
        const data = await res.json();
        if (res.ok) setFeedbacks(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFeedbacks();
  }, [userId]);

 const handleSubmit = async () => {
  if (!selectedAppointment || rating === 0) {
    alert('Please select an appointment and give a rating.');
    return;
  }

  const appointment = appointments.find(a => a.appointment_id === parseInt(selectedAppointment));
  if (!appointment) return;

  if (editFeedbackId) {
    // Update existing feedback
    try {
      const res = await fetch(
        `http://localhost:4000/api/feedback/update-feedback/${editFeedbackId}/${userId}/${appointment.service_id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating, comment }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert('Feedback updated successfully!');
        setFeedbacks(prev =>
          prev.map(f => (f.feedback_id === editFeedbackId ? { ...f, rating, comment } : f))
        );
        // Reset form
        setComment('');
        setRating(0);
        setSelectedAppointment('');
        setEditFeedbackId(null);
      } else {
        alert(data.message || 'Failed to update feedback');
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    // Create new feedback
    try {
      const res = await fetch(
        `http://localhost:4000/api/feedback/create-feedback/${appointment.appointment_id}/${userId}/${appointment.service_id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating, comment }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert('Feedback submitted successfully!');
        setFeedbacks(prev => [...prev, data]);
        setComment('');
        setRating(0);
        setSelectedAppointment('');
      } else {
        alert(data.message || 'Failed to submit feedback');
      }
    } catch (err) {
      console.error(err);
    }
  }
};


  const handleDelete = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/feedback/delete-feedback/${feedbackId}`, { method: 'DELETE' });
    //  const data = await res.json();
      if (res.ok) {
        setFeedbacks(prev => prev.filter(f => f.feedback_id !== feedbackId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!userId) return <div className="text-red-600 font-bold text-lg text-center mt-10">You must be logged in to give feedback.</div>;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-stone-200 border-t-stone-500 mb-4"></div>
          <p className="text-stone-600 text-lg">Loading your feedbacks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-4xl font-bold text-stone-800 mb-2 text-center" style={{ fontFamily: 'serif' }}>Provide Feedback For Your Appointment</h2>

      {/* Feedback Form */}
      <div className="space-y-4">

            {/* Display all booked service images in a horizontal gallery */}
            <div className="flex flex-wrap gap-3 justify-start">
              {appointments.map((a) => (
                <div key={a.appointment_id} className="flex flex-col items-center">
                  <img
                    src={a.service_image_url ? `http://localhost:4000${a.service_image_url}` : '/fallback.jpg'}
                    alt={a.service_name}
                    className="w-40 h-40 object-cover rounded-xl border"
                  />
                  <span className="text-sm text-stone-600 mt-1 text-center">{a.service_name}</span>
                </div>
              ))}
            </div>

            {/* Dropdown comes below the images */}
            <select
              value={selectedAppointment}
              onChange={(e) => setSelectedAppointment(e.target.value)}
              className="w-full border border-stone-300 rounded-xl p-2"
            >
              <option value="">Select Appointment</option>
              {appointments.map((a) => (
                <option key={a.appointment_id} value={a.appointment_id}>
                  {a.service_name} - {new Date(a.appointment_date).toLocaleDateString()} ({a.time_slot})
                </option>
              ))}
            </select>

            {/* Star Rating */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-stone-700">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={24}
                  className="cursor-pointer transition-colors"
                  color={star <= rating ? '#F43F5E' : '#D1D5DB'}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your feedback here..."
              className="w-full border border-stone-300 rounded-xl p-2"
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 px-6 py-3 rounded-xl font-medium hover:from-stone-400 hover:to-rose-400 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Submit Feedback
            </button>
          </div>

        {/* Existing Feedbacks */}
        <h3 className="text-xl font-semibold text-stone-800 mt-10 mb-4">My Feedbacks</h3>
        {feedbacks.length === 0 ? (
          <p className="text-stone-600">You haven't provided any feedback yet.</p>
        ) : (
          <div className="space-y-4">
             {feedbacks.map((f) => (
                <div
                key={f.feedback_id}
                className="border border-stone-200 p-4 rounded-xl bg-stone-50 shadow-sm"
                >
                {/* Service Name and Feedback Date on same line */}
                <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-stone-700">{f.service_name}</p>
                    <p className="text-stone-600 text-sm font-semibold">
                     Feedback Date: {new Date(f.created_at).toLocaleDateString()}
                    </p>
                </div>

                {/* Rating */}
                <p className="text-stone-600 flex gap-1 items-center">
                    Rating:
                    {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        size={16}
                        color={star <= f.rating ? '#F43F5E' : '#D1D5DB'}
                    />
                    ))}
                </p>

                {/* Comment */}
                <p className="text-stone-600 mt-1">Comment: {f.comment}</p>

                {/* Actions */}
                <div className="flex gap-3 mt-2">
                    <button
                    onClick={() => {
                        setSelectedAppointment(f.appointment_id);
                        setRating(f.rating);
                        setComment(f.comment);
                        setEditFeedbackId(f.feedback_id);
                    }}
                    className="flex-1 bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 px-6 py-3 rounded-xl font-medium hover:from-stone-400 hover:to-rose-400 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                    Edit
                    </button>

                    <button
                    onClick={() => handleDelete(f.feedback_id)}
                   className="flex-1 bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 px-6 py-3 rounded-xl font-medium hover:from-stone-400 hover:to-rose-400 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                    Delete
                    </button>
                </div>
                </div>
              ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
