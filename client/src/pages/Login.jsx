import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoImage from '../assets/Logo.jpg';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // clear previous error
  };

  const handleSubmit = async () => {
    // Client-side validation
    if (!formData.email && !formData.password) {
      setError('Please enter your email and password.');
      return;
    }
    if (!formData.email) {
      setError('Please enter your email.');
      return;
    }
    if (!formData.password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      // Store token and userId in localStorage
      if (data.token) localStorage.setItem('token', data.token);
      if (data.userId) localStorage.setItem('userId', data.userId.toString());

      console.log('Token received:', data.token);

      console.log('User logged in:', data.userId);

      // Redirect to BookAppointment page
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-rose-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10">
        {/* Left side */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-12 flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-rose-400/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-300/10 rounded-full blur-2xl"></div>
          
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

        {/* Right side - login form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-serif text-stone-800 mb-2">Welcome Back</h2>
            <p className="text-stone-600">Sign in to book your next appointment</p>
          </div>

          {/* Error message */}
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
            <div>
              <label className="block text-stone-700 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-rose-300 focus:outline-none transition-colors"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-stone-700 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-rose-300 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-stone-600 cursor-pointer">
                <input type="checkbox" className="mr-2 w-4 h-4 rounded border-stone-300 text-rose-400 focus:ring-rose-300" />
                Remember me
              </label>
              <button type="button" className="text-rose-400 hover:text-rose-500 font-medium">
                Forgot password?
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-400 to-amber-300 text-stone-900 py-3 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-stone-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate("/register")}
                className="text-rose-400 hover:text-rose-500 font-semibold"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
