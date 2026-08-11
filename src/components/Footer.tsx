"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-ink py-12 border-t border-ivory/10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-lg font-semibold text-ivory"
        >
          Bright Smile Dental
        </motion.span>

        <div className="flex gap-6 text-ivory/50 text-sm">
          <a href="#services" className="hover:text-teal transition-colors">Services</a>
          <a href="#why-us" className="hover:text-teal transition-colors">Why Us</a>
          <a href="#testimonials" className="hover:text-teal transition-colors">Reviews</a>
          <a href="#book" className="hover:text-teal transition-colors">Book</a>
        </div>

        <span className="text-ivory/30 text-xs">
           © 2026 Bright Smile Dental. All rights reserved.
        </span>
      </div>
    </footer>
  );
}