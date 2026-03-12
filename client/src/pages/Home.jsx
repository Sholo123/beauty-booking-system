import React, { useState, useEffect } from 'react';
import { Sparkles, Crown, Flower2, Heart, Star, Phone, Mail, Menu, X, Scissors } from 'lucide-react';
import LogoImage from '../assets/Logo.jpg';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  const goToLogin = () => {
    navigate('/login');
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/feedback/get-all-feedbacks");
        const data = await res.json();
        console.log("Feedback API response:", data);
        
        // The API returns an array directly
        if (Array.isArray(data)) {
          setFeedbacks(data);
        } else if (data.feedbacks && Array.isArray(data.feedbacks)) {
          setFeedbacks(data.feedbacks);
        } else {
          setFeedbacks([]);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setFeedbacks([]);
      }
    };
    fetchFeedback();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const serviceCategories = [
    {
      title: "Bridal Makeup",
      icon: Heart,
      services: [
        { name: "Trial (Optional)", price: "R600" },
        { name: "Bridal makeup (inc lashes & skin prep)", price: "R1200" }
      ]
    },
    {
      title: "Glam Makeup",
      icon: Sparkles,
      services: [
        { name: "Soft Glam", price: "R550" },
        { name: "Full Glam", price: "R650" },
        { name: "Cut crease/Glitter/Dramatic looks", price: "R750" },
        { name: "Add-Ons (False Eyelashes)", price: "R50" }
      ]
    },
    {
      title: "Hair Services",
      icon: Scissors,
      services: [
        { name: "Wig Installation", price: "R250" },
        { name: "Wig wash and straighten", price: "R280" },
        { name: "Wig wash only", price: "R200" },
        { name: "Wig customisation (bleaching knots and plucking)", price: "R350" },
        { name: "Wig Revamp (wash, treat, straighten)", price: "R300" },
        { name: "Sew in weave", price: "R250" },
        { name: "Ponytail Installation", price: "R220" },
        { name: "Ponytail Installation + Closure", price: "R350" }
      ]
    },
    {
      title: "Braids",
      icon: Flower2,
      services: [
        { name: "Knotless Braids (small to medium)", price: "R400-R500" },
        { name: "Knotless Braids (Medium to long)", price: "R500-R600" },
        { name: "Box Braids (Small to medium)", price: "R300-R400" },
        { name: "Box Braids (Medium to Long)", price: "R400-R500" },
        { name: "Locs", price: "R350" }
      ]
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
                <img src={LogoImage} alt="Logo" className="w-12 h-12 rounded-full object-cover" />
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
              {['Home', 'Services', 'Reviews', 'Contact', 'Policies'].map((link, i) => (
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
              <button className="bg-gradient-to-r from-stone-300 to-rose-300 text-stone-900 px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition"
              onClick={goToLogin}
              >
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
              {['Home', 'Services', 'Reviews', 'Contact'].map((link, i) => (
                <a 
                  key={i} 
                  href={`#${link.toLowerCase()}`} 
                  className="block text-rose-100 hover:text-rose-300 py-3 border-b border-stone-800"
                  onClick={() => setIsMenuOpen(false)}
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
              <button className="w-full bg-gradient-to-r from-stone-300 to-rose-300 text-stone-900 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition"
              onClick={goToLogin}
              >
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
            </div>

            {/* Hero Image */}
            <div className="relative w-full h-[530px] rounded-3xl overflow-hidden shadow-lg border border-stone-200 bg-gradient-to-br from-stone-200/40 to-rose-200/40">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-stone-300 via-rose-300 to-stone-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <img 
                      src={LogoImage} 
                      alt="Balmyflare Logo" 
                      className="w-56 h-56 object-cover rounded-full"
                    />
                  </div>
                  <p className="text-3xl font-serif text-stone-800 italic">Beauty & Elegance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Full Price List */}
      <section id="services" className="py-24 px-4 bg-white/60 backdrop-blur-sm relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-rose-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-stone-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h3 className="text-5xl md:text-6xl font-serif text-stone-900 mb-6">Our Services & Pricing</h3>
            <div className="w-40 h-1.5 bg-gradient-to-r from-stone-300 via-rose-300 to-stone-300 mx-auto rounded-full mb-6"></div>
            <p className="text-stone-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Indulge in our premium beauty services, crafted to perfection by expert professionals
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {serviceCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div 
                  key={index}
                  className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-stone-200 hover:border-rose-300 hover:-translate-y-2 flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center gap-5 mb-8 pb-6 border-b-2 border-stone-100">
                    <div className="p-4 bg-gradient-to-br from-stone-100 to-rose-100 rounded-2xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
                      <IconComponent className="w-10 h-10 text-rose-500" />
                    </div>
                    <h4 className="text-3xl font-serif font-bold text-stone-900 italic">{category.title}</h4>
                  </div>
                  
                  {/* Services List */}
                  <div className="space-y-3 mb-8 flex-grow">
                    {category.services.map((service, i) => (
                      <div 
                        key={i} 
                        className=" font-serif text-stone-800 italic flex justify-between items-start gap-6 p-4 rounded-xl hover:bg-gradient-to-r hover:from-stone-50 hover:to-rose-50 transition-all duration-300 group/item"
                      >
                        <span className="text-stone-700 flex-1 text-base leading-relaxed group-hover/item:text-stone-900 transition-colors">
                          {service.name}
                        </span>
                        <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-stone-600 to-rose-500 whitespace-nowrap group-hover/item:from-stone-700 group-hover/item:to-rose-600">
                          {service.price}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Book Button */}
                  <button 
                    className=" font-serif text-stone-800 italic w-full bg-gradient-to-r from-stone-300 to-rose-300 text-stone-900 py-4 rounded-2xl font-bold text-lg hover:from-stone-400 hover:to-rose-400 hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-auto"
                    onClick={goToLogin}
                  >
                    Book {category.title}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      
          {/* Testimonials Section */}
          <section id="reviews" className="py-20 px-4 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 relative overflow-hidden">
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

              {feedbacks.length === 0 ? (
                <p className="text-center text-rose-200 text-lg">No reviews yet. Check back soon!</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {feedbacks.map((feedback, index) => (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border-2 border-white/20 hover:border-rose-300/50 transition-all duration-300 hover:scale-105 shadow-md"
                    >
                      {/* Rating Stars */}
                      <div className="flex mb-3">
                        {Array.from({ length: feedback.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-rose-300 fill-rose-300" />
                        ))}
                      </div>

                      {/* Comment */}
                      <p className="text-rose-100 mb-4 italic">
                        {feedback.comment || 'Great service!'}
                      </p>

                      {/* Client Details */}
                      <div className="text-white font-semibold mb-1">
                        {feedback.user_first_name} {feedback.user_last_name}
                      </div>
                      <div className="text-rose-200 text-sm">
                        {feedback.service_name || 'Service'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>



      {/* CTA Section */}
      <section id="contact" className="py-24 px-4 bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-12 shadow-lg border border-stone-200">
            <h3 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4">
              Ready to Glow?
            </h3>
            <p className="text-stone-600 mb-8 text-lg md:text-xl max-w-2xl mx-auto">
              Book your appointment today and let us help you look and feel your absolute best
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-stone-300 to-rose-300 text-stone-900 px-12 py-5 rounded-full font-semibold text-lg hover:from-stone-400 hover:to-rose-400 hover:shadow-lg transition-all duration-300"
               onClick={goToLogin}
              >
                Book Appointment Now
              </button>
            </div>
            <div className="mt-8 space-y-3">
              <p className="text-stone-700 font-medium text-lg">Get in Touch</p>
              <p className="text-stone-600 flex items-center justify-center gap-2">
                <Phone className="w-5 h-5 text-rose-400" /> +27 83 745 4528
              </p>
              <p className="text-stone-600 flex items-center justify-center gap-2">
                <Mail className="w-5 h-5 text-rose-400" /> @Balmyflarebeautique
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;