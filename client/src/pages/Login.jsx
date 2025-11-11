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

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
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

        {/* Right side - login form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-stone-800 mb-2" style={{ fontFamily: 'serif' }}>
              Welcome Back
            </h2>
            <p className="text-stone-600">Sign in to book your next appointment</p>
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

          <div className="space-y-5">
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-stone-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="mr-2 w-4 h-4 rounded border-stone-300 text-rose-400 focus:ring-rose-300" 
                />
                Remember me
              </label>
              <button 
                type="button" 
                className="text-rose-400 hover:text-rose-500 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 py-3 rounded-xl font-medium hover:from-stone-400 hover:to-rose-400 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-stone-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate("/register")}
                className="text-rose-400 hover:text-rose-500 font-semibold transition-colors"
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