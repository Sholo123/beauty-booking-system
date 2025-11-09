import React, { useState, useEffect } from 'react';
//import LogoImage from '../assets/Logo.jpg';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      title: "Bridal Makeup",
      description: "Complete bridal look with lashes & skin prep",
      price: "From R1200",
      icon: "💄",
      features: ["Trial Available", "Lashes Included", "Skin Prep"]
    },
    {
      title: "Glam Makeup",
      description: "Soft to full glam & dramatic looks",
      price: "From R550",
      icon: "✨",
      features: ["Soft Glam", "Full Glam", "Dramatic Looks"]
    },
    {
      title: "Wig Services",
      description: "Installation, customization & styling",
      price: "From R200",
      icon: "👑",
      features: ["Installation", "Customization", "Styling"]
    },
    {
      title: "Braids & Locs",
      description: "Knotless braids, box braids & locs",
      price: "From R300",
      icon: "🌸",
      features: ["Knotless Braids", "Box Braids", "Locs"]
    }
  ];

  const testimonials = [
    {
      name: "Thandi M.",
      service: "Bridal Makeup",
      rating: 5,
      comment: "Absolutely stunning! Made my wedding day perfect."
    },
    {
      name: "Lerato K.",
      service: "Wig Installation",
      rating: 5,
      comment: "Professional service and amazing results. Highly recommend!"
    },
    {
      name: "Nomsa P.",
      service: "Knotless Braids",
      rating: 5,
      comment: "Best braids I've ever had! So neat and beautiful."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-rose-50">
      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-stone-900/95 backdrop-blur-lg shadow-2xl' 
          : 'bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-400 via-rose-300 to-amber-300 rounded-full flex items-center justify-center text-stone-900 font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                BF
              </div>
              <div>
                <h1 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-200 to-amber-200">
                  Balmyflare
                </h1>
                <p className="text-xs text-rose-200 tracking-[0.3em]">BEAUTIQUE</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-rose-100 hover:text-amber-200 transition-colors font-medium relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 to-amber-300 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#services" className="text-rose-100 hover:text-amber-200 transition-colors font-medium relative group">
                Services
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 to-amber-300 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#gallery" className="text-rose-100 hover:text-amber-200 transition-colors font-medium relative group">
                Gallery
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 to-amber-300 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#testimonials" className="text-rose-100 hover:text-amber-200 transition-colors font-medium relative group">
                Reviews
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 to-amber-300 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#contact" className="text-rose-100 hover:text-amber-200 transition-colors font-medium relative group">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 to-amber-300 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a 
                href="/login"
                className="border-2 border-rose-300/50 text-rose-200 px-5 py-2 rounded-full font-semibold hover:bg-rose-400/10 transition-all duration-300"
              >
                Login
              </a>
              <button className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 text-stone-900 px-6 py-2 rounded-full font-semibold hover:shadow-2xl hover:shadow-rose-300/50 transition-all duration-300 hover:scale-105">
                Book Now
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-rose-200 hover:text-amber-200 transition-colors"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-stone-900/98 backdrop-blur-lg border-t border-stone-700">
            <div className="px-4 py-4 space-y-3">
              <a href="#home" className="block text-rose-100 hover:text-amber-200 py-3 border-b border-stone-800">Home</a>
              <a href="#services" className="block text-rose-100 hover:text-amber-200 py-3 border-b border-stone-800">Services</a>
              <a href="#gallery" className="block text-rose-100 hover:text-amber-200 py-3 border-b border-stone-800">Gallery</a>
              <a href="#testimonials" className="block text-rose-100 hover:text-amber-200 py-3 border-b border-stone-800">Reviews</a>
              <a href="#contact" className="block text-rose-100 hover:text-amber-200 py-3 border-b border-stone-800">Contact</a>
              <a 
                href="/login"
                className="block w-full text-center border-2 border-rose-300/50 text-rose-200 px-6 py-3 rounded-full font-semibold hover:bg-rose-400/10 transition-all duration-300 mt-2"
              >
                Login
              </a>
              <button className="w-full bg-gradient-to-r from-rose-400 to-amber-300 text-stone-900 px-6 py-3 rounded-full font-semibold">
                Book Now
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-rose-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-amber-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-rose-300 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-rose-100 to-amber-100 rounded-full">
                <span className="text-stone-800 font-medium text-sm">✨ Premium Beauty Services</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-serif text-stone-900 mb-6 leading-tight">
                Where Beauty
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400">
                  Meets Excellence
                </span>
              </h2>
              <p className="text-xl text-stone-700 mb-8 leading-relaxed">
                Transform your look with professional makeup artistry, expert wig services, and stunning hairstyling. Book your appointment today and experience beauty redefined.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400 text-white px-10 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-rose-400/50 transition-all duration-300 hover:scale-105 group">
                  Book Appointment
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button className="border-2 border-stone-800 text-stone-800 px-10 py-4 rounded-full font-semibold text-lg hover:bg-stone-900 hover:text-white transition-all duration-300 backdrop-blur-sm">
                  View Portfolio
                </button>
              </div>
              <div className="flex items-center gap-8 mt-12 justify-center md:justify-start">
                <div>
                  <div className="text-3xl font-bold text-stone-900">500+</div>
                  <div className="text-stone-600 text-sm">Happy Clients</div>
                </div>
                <div className="w-px h-12 bg-stone-300"></div>
                <div>
                  <div className="text-3xl font-bold text-stone-900">5⭐</div>
                  <div className="text-stone-600 text-sm">Rating</div>
                </div>
                <div className="w-px h-12 bg-stone-300"></div>
                <div>
                  <div className="text-3xl font-bold text-stone-900">100%</div>
                  <div className="text-stone-600 text-sm">Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 to-amber-400/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center text-stone-700">
                    <div className="text-6xl mb-4">👑</div>
                    <p className="text-2xl font-serif">Your Beauty Journey</p>
                    <p className="text-lg">Starts Here</p>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-rose-400 to-amber-300 rounded-2xl shadow-xl flex items-center justify-center text-3xl animate-bounce">
                💄
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-amber-400 to-rose-400 rounded-2xl shadow-xl flex items-center justify-center text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>
                ✨
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-serif text-stone-900 mb-4">Our Signature Services</h3>
            <div className="w-32 h-1.5 bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 mx-auto rounded-full mb-4"></div>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              Indulge in our premium beauty services, crafted to perfection by expert professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-transparent hover:border-rose-200 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                  <h4 className="text-2xl font-semibold text-stone-900 mb-3">{service.title}</h4>
                  <p className="text-stone-600 mb-4">{service.description}</p>
                  <div className="space-y-2 mb-4">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-sm text-stone-600">
                        <span className="text-rose-400 mr-2">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500 mb-4">
                    {service.price}
                  </p>
                  <button className="w-full bg-gradient-to-r from-rose-400 to-amber-300 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-rose-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-amber-200 mb-4">
              What Our Clients Say
            </h3>
            <div className="w-32 h-1.5 bg-gradient-to-r from-rose-400 to-amber-300 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-rose-300/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-rose-100 mb-6 italic">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-amber-300 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-rose-200 text-sm">{testimonial.service}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-rose-50 via-amber-50 to-stone-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border-2 border-rose-100">
            <h3 className="text-5xl font-serif text-stone-900 mb-4">
              Ready to Glow?
            </h3>
            <p className="text-stone-600 mb-8 text-xl max-w-2xl mx-auto">
              Book your appointment today and let us help you look and feel your absolute best
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400 text-white px-12 py-5 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-rose-400/50 transition-all duration-300 hover:scale-105">
                Book Appointment Now
              </button>
              <button className="border-2 border-stone-300 text-stone-800 px-12 py-5 rounded-full font-semibold text-lg hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300">
                View Price List
              </button>
            </div>
            <p className="mt-6 text-stone-500">
              📞 +27 83 745 4528 | 📧 @Balmyflarebeautique
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-rose-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-amber-300 rounded-full flex items-center justify-center text-stone-900 font-bold text-xl">
                  BF
                </div>
                <div>
                  <h5 className="text-2xl font-serif text-rose-200">Balmyflare Beautique</h5>
                  <p className="text-rose-300 text-xs tracking-wider">EXCELLENCE IN BEAUTY</p>
                </div>
              </div>
              <p className="text-rose-200/70 mb-4 leading-relaxed">
                Your premier destination for professional makeup, wig services, and hairstyling. We're dedicated to making you look and feel beautiful.
              </p>
              <div className="flex gap-4">
                <button className="w-10 h-10 bg-rose-400/20 rounded-full flex items-center justify-center hover:bg-rose-400 transition-colors">
                  <span className="text-lg">📘</span>
                </button>
                <button className="w-10 h-10 bg-rose-400/20 rounded-full flex items-center justify-center hover:bg-rose-400 transition-colors">
                  <span className="text-lg">📷</span>
                </button>
                <button className="w-10 h-10 bg-rose-400/20 rounded-full flex items-center justify-center hover:bg-rose-400 transition-colors">
                  <span className="text-lg">💬</span>
                </button>
              </div>
            </div>
            <div>
              <h6 className="font-semibold mb-6 text-amber-200 text-lg">Quick Links</h6>
              <div className="space-y-3">
                <a href="#services" className="block text-rose-200/70 hover:text-amber-200 transition-colors">Our Services</a>
                <button onClick={() => {}} className="block text-rose-200/70 hover:text-amber-200 transition-colors text-left">Price List</button>
                <a href="#testimonials" className="block text-rose-200/70 hover:text-amber-200 transition-colors">Testimonials</a>
                <button onClick={() => {}} className="block text-rose-200/70 hover:text-amber-200 transition-colors text-left">Booking Policy</button>
                <a href="/login" className="block text-rose-200/70 hover:text-amber-200 transition-colors">Login</a>
              </div>
            </div>
            <div>
              <h6 className="font-semibold mb-6 text-amber-200 text-lg">Contact Us</h6>
              <div className="space-y-3 text-rose-200/70">
                <p className="flex items-start">
                  <span className="mr-2">📞</span>
                  <span>+27 83 745 4528</span>
                </p>
                <p className="flex items-start">
                  <span className="mr-2">📧</span>
                  <span>@Balmyflarebeautique</span>
                </p>
                <p className="flex items-start">
                  <span className="mr-2">📍</span>
                  <span>Rustenburg, North West, South Africa</span>
                </p>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-stone-700 text-center">
            <p className="text-rose-200/50 text-sm">
              &copy; 2025 Balmyflare Beautique. All rights reserved. | Crafted with 💖
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;