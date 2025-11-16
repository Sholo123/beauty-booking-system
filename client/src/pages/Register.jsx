import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoImage from '../assets/Logo.jpg';

const provinces = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape'
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    province: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // clear error on input change
  };

  const validateFields = () => {
    const nameRegex = /^[A-Za-z]+$/;
    const phoneRegex = /^0\d{9}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const locationRegex = /^[A-Za-z0-9]+(?:[A-Za-z0-9\s]*,?\s?)*[A-Za-z0-9]+$/;

    if (!formData.first_name) return 'Please enter your first name.';
    if (!nameRegex.test(formData.first_name)) return 'First name can only contain letters.';

    if (!formData.last_name) return 'Please enter your last name.';
    if (!nameRegex.test(formData.last_name)) return 'Last name can only contain letters.';

    if (!formData.email) return 'Please enter your email.';
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address.';

    if (!formData.phone) return 'Please enter your phone number.';
    if (!phoneRegex.test(formData.phone)) return 'Phone number must start with 0 and be exactly 10 digits.';

    if (!formData.location) return 'Please enter your location.';
    if (!locationRegex.test(formData.location)) return 'Location can only contain letters, numbers, spaces, and commas.';

    if (!formData.province) return 'Please select your province.';

    if (!formData.password) return 'Please enter your password.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters long.';

    return null; // no errors
  };

  const handleSubmit = async () => {
    const validationError = validateFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || data.error || 'Registration failed');

      console.log('Registration successful:', data);
      setSuccess(true);

      if (data.token) localStorage.setItem('token', data.token);

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-lg overflow-hidden border border-stone-200">
        {/* Left side */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-12 flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-rose-400/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-stone-300/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="w-90 h-70 rounded-full overflow-hidden shadow-2xl mb-6 mx-auto">
              <img 
                src={LogoImage} 
                alt="Balmyflare Logo" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-12 pt-8 border-t border-stone-700">
              <p className="text-2xl md:text-2xl text-rose-200/70 italic font-cursive">
                Elevating beauty, one appointment at a time
              </p>
            </div>
          </div>
        </div>

        {/* Right side - registration form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-stone-800 mb-2" style={{ fontFamily: 'serif' }}>
              Create Account
            </h2>
            <p className="text-stone-600">Join us for exclusive beauty services</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 p-4 bg-rose-50 border-2 border-rose-200 rounded-xl flex justify-between items-start">
              <p className="text-rose-600 text-sm font-medium">{error}</p>
              <button
                onClick={() => setError('')}
                className="ml-4 text-rose-500 text-xl font-bold hover:text-rose-700 transition-colors"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-5 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <p className="text-green-600 text-sm font-medium">Registration successful! Redirecting...</p>
            </div>
          )}

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full bg-white border-2 border-stone-200 focus:border-rose-400 focus:outline-none p-3 rounded-xl transition-colors text-stone-800"
                  placeholder="John"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full bg-white border-2 border-stone-200 focus:border-rose-400 focus:outline-none p-3 rounded-xl transition-colors text-stone-800"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white border-2 border-stone-200 focus:border-rose-400 focus:outline-none p-3 rounded-xl transition-colors text-stone-800"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white border-2 border-stone-200 focus:border-rose-400 focus:outline-none p-3 rounded-xl transition-colors text-stone-800"
                placeholder="0XXXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Location / City
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-white border-2 border-stone-200 focus:border-rose-400 focus:outline-none p-3 rounded-xl transition-colors text-stone-800"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Province
              </label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full bg-white border-2 border-stone-200 focus:border-rose-400 focus:outline-none p-3 rounded-xl transition-colors text-stone-800"
              >
                <option value="">Select your province</option>
                {provinces.map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white border-2 border-stone-200 focus:border-rose-400 focus:outline-none p-3 rounded-xl transition-colors text-stone-800"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || success}
              className="w-full bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 py-3 rounded-xl font-medium hover:from-stone-400 hover:to-rose-400 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
            >
              {loading ? 'Creating Account...' : success ? 'Success!' : 'Create Account'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-stone-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-rose-400 hover:text-rose-500 font-semibold transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;