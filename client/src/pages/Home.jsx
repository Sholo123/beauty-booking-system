import React, { useState, useEffect } from 'react';
import { Sparkles, Crown, Flower2, Heart, Star, Phone, Mail, MapPin, Facebook, Instagram, MessageCircle, Menu, X, ChevronRight } from 'lucide-react';
import LogoImage from '../assets/Logo.jpg';
const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      title: "Bridal Makeup",
      description: "Complete bridal look with lashes & skin prep",
      price: "From R1200",
      icon: Heart,
      features: ["Trial Available", "Lashes Included", "Skin Prep"]
    },
    {
      title: "Glam Makeup",
      description: "Soft to full glam & dramatic looks",
      price: "From R550",
      icon: Sparkles,
      features: ["Soft Glam", "Full Glam", "Dramatic Looks"]
    },
    {
      title: "Wig Services",
      description: "Installation, customization & styling",
      price: "From R200",
      icon: Crown,
      features: ["Installation", "Customization", "Styling"]
    },
    {
      title: "Braids & Locs",
      description: "Knotless braids, box braids & locs",
      price: "From R300",
      icon: Flower2,
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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100 font-sans">
      
      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-stone-900/95 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-stone-300 via-rose-300 to-stone-400 rounded-full flex items-center justify-center text-stone-900 font-bold text-2xl shadow-md transition-transform duration-300 hover:scale-110">
              <img src={LogoImage} alt="Balmyflare Logo" className="w-10 h-10 object-cover rounded-full" />
              </div>
              <div>
                <h1 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-stone-200 to-rose-200">
                  BalmyFlare
                </h1>
                <p className="text-xs text-rose-200 tracking-widest">BEAUTIQUE</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Services', 'Gallery', 'Reviews', 'Contact'].map((link, i) => (
                <a 
                  key={i} 
                  href={`#${link.toLowerCase()}`} 
                  className="text-rose-100 hover:text-rose-300 transition-colors font-medium relative group"
                >
                  {link}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-stone-300 to-rose-300 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
              <a 
                href="/login"
                className="border-2 border-rose-300/50 text-rose-200 px-5 py-2 rounded-full font-semibold hover:bg-rose-400/10 transition"
              >
                Login
              </a>
              <button className="bg-gradient-to-r from-stone-300 to-rose-300 text-stone-900 px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition">
                Book Now
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-rose-200 hover:text-rose-300 transition-colors"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-stone-900/95 backdrop-blur-md border-t border-stone-700">
            <div className="px-4 py-4 space-y-3">
              {['Home', 'Services', 'Gallery', 'Reviews', 'Contact'].map((link, i) => (
                <a 
                  key={i} 
                  href={`#${link.toLowerCase()}`} 
                  className="block text-rose-100 hover:text-rose-300 py-3 border-b border-stone-800"
                >
                  {link}
                </a>
              ))}
              <a 
                href="/login"
                className="block w-full text-center border-2 border-rose-300/50 text-rose-200 px-6 py-3 rounded-full font-semibold hover:bg-rose-400/10 transition"
              >
                Login
              </a>
              <button className="w-full bg-gradient-to-r from-stone-300 to-rose-300 text-stone-900 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition">
                Book Now
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-rose-300 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-stone-300 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-rose-200 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="text-center md:text-left">
              <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-stone-100 to-rose-100 rounded-full border border-stone-200">
                <span className="text-stone-800 font-medium text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Premium Beauty Services
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif text-stone-900 mb-6 leading-tight">
                Where Beauty
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-stone-600 via-rose-500 to-stone-600">
                  Meets Excellence
                </span>
              </h2>
              <p className="text-lg md:text-xl text-stone-700 mb-8">
                Transform your look with professional makeup artistry, expert wig services, and stunning hairstyling. Book your appointment today and experience beauty redefined.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="bg-gradient-to-r from-stone-300 to-rose-300 text-stone-900 px-10 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:from-stone-400 hover:to-rose-400 transition-all duration-300">
                  Book Appointment
                </button>
                <button className="border-2 border-stone-300 text-stone-800 px-10 py-4 rounded-full font-semibold text-lg hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300">
                  View Portfolio
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-lg border border-stone-200">
              <div className="absolute inset-0 bg-gradient-to-br from-stone-200/40 to-rose-200/40 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center text-stone-700">
                  <Crown className="w-16 h-16 mx-auto mb-4 text-stone-600" />
                  <p className="text-2xl font-serif">Your Beauty Journey</p>
                  <p className="text-lg">Starts Here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4">Our Services</h3>
            <div className="w-32 h-1.5 bg-gradient-to-r from-stone-300 via-rose-300 to-stone-300 mx-auto rounded-full mb-4"></div>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              Indulge in our premium beauty services, crafted to perfection by an expert professional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div 
                  key={index}
                  className="group bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-stone-200 hover:border-rose-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-50 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-16 h-16 text-rose-400" />
                    </div>
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
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-stone-600 to-rose-500 mb-4">
                      {service.price}
                    </p>
                    <button className="w-full bg-gradient-to-r from-stone-300 to-rose-300 text-stone-900 py-3 rounded-xl font-semibold hover:from-stone-400 hover:to-rose-400 hover:shadow-md transition-all duration-300">
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-rose-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-stone-300 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-stone-200 mb-4">
              What Our Clients Say
            </h3>
            <div className="w-32 h-1.5 bg-gradient-to-r from-stone-300 to-rose-300 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 hover:border-rose-300/50 transition-all duration-300 hover:scale-105 shadow-md"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-rose-300 fill-rose-300" />
                  ))}
                </div>
                <p className="text-rose-100 mb-6 italic">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-stone-300 to-rose-300 rounded-full flex items-center justify-center text-stone-900 font-bold mr-3">
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
      <section className="py-24 px-4 bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-12 shadow-lg border border-stone-200">
            <h3 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4">
              Ready to Glow?
            </h3>
            <p className="text-stone-600 mb-8 text-lg md:text-xl max-w-2xl mx-auto">
              Book your appointment today and let us help you look and feel your absolute best
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-stone-300 to-rose-300 text-stone-900 px-12 py-5 rounded-full font-semibold text-lg hover:from-stone-400 hover:to-rose-400 hover:shadow-lg transition-all duration-300">
                Book Appointment Now
              </button>
              <button className="border-2 border-stone-300 text-stone-800 px-12 py-5 rounded-full font-semibold text-lg hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300">
                View Price List
              </button>
            </div>
            <p className="mt-6 text-stone-500 flex items-center justify-center gap-4">
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> +27 83 745 4528
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> @Balmyflarebeautique
              </span>
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
                <div className="w-14 h-14 bg-gradient-to-br from-stone-300 to-rose-300 rounded-full flex items-center justify-center text-stone-900 font-bold text-xl">
                  BF
                </div>
                <div>
                  <h5 className="text-2xl font-serif text-rose-200">Balmyflare Beautique</h5>
                  <p className="text-rose-300 text-xs tracking-widest">EXCELLENCE IN BEAUTY</p>
                </div>
              </div>
              <p className="text-rose-200/70 mb-4 leading-relaxed">
                Your premier destination for professional makeup, wig services, and hairstyling. We're dedicated to making you look and feel beautiful.
              </p>
              <div className="flex gap-4">
                <button className="w-10 h-10 bg-rose-400/20 rounded-full flex items-center justify-center hover:bg-rose-400 transition">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-rose-400/20 rounded-full flex items-center justify-center hover:bg-rose-400 transition">
                  <Instagram className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-rose-400/20 rounded-full flex items-center justify-center hover:bg-rose-400 transition">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <h6 className="font-semibold mb-6 text-rose-200 text-lg">Quick Links</h6>
              <div className="space-y-3">
                <a href="#services" className="block text-rose-200/70 hover:text-rose-300 transition">Our Services</a>
                <button className="block text-rose-200/70 hover:text-rose-300 transition text-left">Price List</button>
                <a href="#testimonials" className="block text-rose-200/70 hover:text-rose-300 transition">Testimonials</a>
                <button className="block text-rose-200/70 hover:text-rose-300 transition text-left">Booking Policy</button>
                <a href="/login" className="block text-rose-200/70 hover:text-rose-300 transition">Login</a>
              </div>
            </div>
            <div>
              <h6 className="font-semibold mb-6 text-rose-200 text-lg">Contact Us</h6>
              <div className="space-y-3 text-rose-200/70">
                <p className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-1" /> +27 83 745 4528
                </p>
                <p className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-1" /> @Balmyflarebeautique
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1" /> Rustenburg, North West, South Africa
                </p>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-stone-700 text-center">
            <p className="text-rose-200/50 text-sm flex items-center justify-center gap-2">
              &copy; 2025 Balmyflare Beautique. All rights reserved. | Crafted with <Heart className="w-4 h-4 fill-rose-300 text-rose-300" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;