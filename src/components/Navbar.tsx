"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ivory/70 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <span className="font-display text-xl font-semibold text-ink">
          Bright Smile
        </span>

        <div className="hidden md:flex items-center gap-8 font-body text-sm text-charcoal/80">
          <a href="#services" className="hover:text-teal transition-colors">Services</a>
          <a href="#why-us" className="hover:text-teal transition-colors">Why Us</a>
          <a href="#testimonials" className="hover:text-teal transition-colors">Reviews</a>
        </div>

        <a
          href="#book"
          className="bg-coral text-ivory px-5 py-2 rounded-full text-sm font-medium hover:scale-105 hover:shadow-lg transition-transform"
        >
          Book Appointment
        </a>
      </div>
    </motion.nav>
  );
}