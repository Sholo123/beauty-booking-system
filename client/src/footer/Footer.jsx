import React from 'react';
import {  Heart, Phone, Mail, MapPin, Facebook, Instagram, MessageCircle  } from 'lucide-react';


const Footer = () => {
  return (
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
              &copy; 2025 Balmyflare Beautique. All rights reserved
            </p>
          </div>
        </div>
      </footer>
  );
}

export default Footer;