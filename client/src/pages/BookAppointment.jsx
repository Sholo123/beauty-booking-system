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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-bold text-lg">
          You must be logged in to book an appointment.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-rose-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative">
        <h2 className="text-3xl font-bold text-stone-800 mb-6 text-center">
          Book an Appointment
        </h2>
        <p className="text-center text-stone-600 mb-8">
          Select your service, date, and available time slot
        </p>

        {error && (
          <div className="mb-5 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex justify-between items-start">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => setError('')}
              className="ml-4 text-red-500 font-bold hover:text-red-700 transition-colors"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <div className="space-y-5">
          {/* Service */}
          <div>
            <label className="block text-stone-700 text-sm font-medium mb-2">Service</label>
            <select
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-rose-300 focus:outline-none transition-colors"
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.service_id} value={service.service_id}>
                  {`${service.name} - R${service.price} - Duration: ${service.duration_minutes} mins`}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-stone-700 text-sm font-medium mb-2">
              Appointment Date (Mon-Sat)
            </label>
            <input
              type="date"
              name="appointmentDate"
              min={new Date().toISOString().split('T')[0]}
              value={formData.appointmentDate}
              onChange={handleDateChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-rose-300 focus:outline-none transition-colors"
            />
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-stone-700 text-sm font-medium mb-2">Time Slot</label>
            <select
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-rose-300 focus:outline-none transition-colors"
            >
              <option value="">Select a time slot</option>
              {generateTimeSlots().map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-400 to-amber-300 text-stone-900 py-3 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
