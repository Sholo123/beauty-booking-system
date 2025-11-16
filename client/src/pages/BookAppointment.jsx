import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Hooks must always be called at top level
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceId: '',
    appointmentDate: '',
    timeSlot: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/services/get-services');
        const data = await response.json();
        if (Array.isArray(data)) setServices(data);
        else if (data.services && Array.isArray(data.services)) setServices(data.services);
        else setServices([]);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services');
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleDateChange = (e) => {
    const today = new Date();
    const selectedDate = new Date(e.target.value);
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError('Cannot book a past date');
      setFormData({ ...formData, appointmentDate: '' });
    } else if (selectedDate.getDay() === 0) {
      setError('Appointments cannot be booked on Sundays');
      setFormData({ ...formData, appointmentDate: '' });
    } else {
      setFormData({ ...formData, appointmentDate: e.target.value });
      if (error) setError('');
    }
  };

  // Generate time slots based on service duration
  const generateTimeSlots = () => {
    if (!formData.serviceId) return [];

    const service = services.find((s) => s.service_id === parseInt(formData.serviceId));
    if (!service) return [];

    const duration = service.duration_minutes; // in minutes
    const slots = [];

    // Custom predefined start times with gaps
    const startTimes = [
      { hour: 8, minute: 0 },
      { hour: 11, minute: 0 },
      { hour: 14, minute: 0 },
    ];

    startTimes.forEach((startTime) => {
      const start = new Date();
      start.setHours(startTime.hour, startTime.minute, 0, 0);
      const end = new Date(start.getTime() + duration * 60000);

      // Stop if end exceeds 17:00
      if (end.getHours() > 17 || (end.getHours() === 17 && end.getMinutes() > 0)) return;

      const formatTime = (date) =>
        `${date.getHours().toString().padStart(2, '0')}:${date
          .getMinutes()
          .toString()
          .padStart(2, '0')}`;

      slots.push(`${formatTime(start)} - ${formatTime(end)}`);
    });

    return slots;
  };

  const handleSubmit = async () => {
    if (!formData.serviceId || !formData.appointmentDate || !formData.timeSlot) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        appointment_date: formData.appointmentDate,
        slot_time: formData.timeSlot,
      };

      console.log('Booking payload:', payload);

      const response = await fetch(
        `http://localhost:4000/api/appointments/create-appointment/${userId}/${formData.serviceId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to book appointment');

      alert('Appointment booked successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // If user is not logged in, show message
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100 p-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center border border-stone-200 max-w-md w-full">
          <div className="text-stone-500 text-4xl sm:text-5xl mb-4">🔒</div>
          <p className="text-stone-700 font-medium text-base sm:text-lg mb-4">
            You must be logged in to book an appointment.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 py-3 rounded-xl font-semibold hover:shadow-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100 py-6 sm:py-8 px-4">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-12 border border-stone-100">
        
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-2 text-center" style={{ fontFamily: 'serif' }}>
          Book an Appointment
        </h2>
        <p className="text-center text-stone-600 mb-6 sm:mb-8 text-sm sm:text-base">
          Select your service, date, and available time slot
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3 sm:p-4 bg-rose-50 border-2 border-rose-200 rounded-xl flex justify-between items-start">
            <p className="text-rose-600 text-xs sm:text-sm font-medium">{error}</p>
            <button
              onClick={() => setError('')}
              className="ml-4 text-rose-500 text-xl font-bold hover:text-rose-700 transition-colors flex-shrink-0"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Service Preview Gallery */}
        {services.length > 0 && (
          <div className="mb-6">
            <h3 className="text-stone-700 font-semibold mb-3 text-sm sm:text-base">Available Services</h3>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 py-2 -mx-2 px-2">
              {services.map((service) => (
                <div
                  key={service.service_id}
                  onClick={() => setFormData({ ...formData, serviceId: service.service_id.toString() })}
                  className={`flex-shrink-0 w-32 sm:w-40 bg-white rounded-xl shadow-md border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    formData.serviceId === service.service_id.toString()
                      ? 'border-rose-400 ring-2 ring-rose-200'
                      : 'border-stone-200 hover:border-rose-300'
                  }`}
                >
                  <div className="overflow-hidden rounded-t-xl">
                    <img
                      src={
                        service.images && service.images.length > 0
                          ? `http://localhost:4000${service.images[0].image_url}`
                          : '/fallback.jpg'
                      }
                      alt={service.name}
                      className="w-full h-32 sm:h-40 object-cover"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-xs sm:text-sm font-medium text-stone-800 truncate">{service.name}</p>
                    <p className="text-xs text-stone-500">R{service.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4 sm:space-y-5">
          
          {/* Service Dropdown */}
          <div>
            <label className="block text-stone-700 text-sm font-medium mb-2">Service</label>
            <select
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-stone-200 focus:border-rose-400 focus:outline-none transition-colors bg-white text-sm sm:text-base text-stone-800"
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.service_id} value={service.service_id}>
                  {`${service.name} - R${service.price} - Duration: ${service.duration_minutes} mins`}
                </option>
              ))}
            </select>
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-stone-700 text-sm font-medium mb-2">
              Appointment Date (Monday to Saturday)
            </label>
            <input
              type="date"
              name="appointmentDate"
              min={new Date().toISOString().split('T')[0]}
              value={formData.appointmentDate}
              onChange={handleDateChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-stone-200 focus:border-rose-400 focus:outline-none transition-colors bg-white text-sm sm:text-base text-stone-800"
            />
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-stone-700 text-sm font-medium mb-2">Time Slot</label>
            <select
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-stone-200 focus:border-rose-400 focus:outline-none transition-colors bg-white text-sm sm:text-base text-stone-800"
            >
              <option value="">Select a time slot</option>
              {generateTimeSlots().map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 py-3 sm:py-3.5 rounded-xl font-semibold text-base sm:text-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;