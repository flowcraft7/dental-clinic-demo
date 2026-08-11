"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0, 0, 0.2, 1] } },
} as unknown as Variants;

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-ivory pt-24">
      {/* ambient floating blobs */}
      <motion.div
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-teal/20 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, -25, 0], x: [0, -15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-coral/20 blur-3xl"
      />

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span
            variants={item}
            className="inline-block text-teal font-body text-sm font-semibold tracking-wide uppercase mb-4"
          >
            Bright Smile Dental
          </motion.span>

          <motion.h1
            variants={item}
            className="font-display text-5xl md:text-6xl font-semibold text-ink leading-tight mb-6"
          >
            Dental care that feels <span className="text-coral italic">different.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-charcoal/70 text-lg mb-8 max-w-md"
          >
            Modern, gentle, and built around you. Book your visit in under a minute — no phone calls needed.
          </motion.p>

          <motion.div variants={item} className="flex gap-4">
            <a
              href="#book"
              className="bg-ink text-ivory px-7 py-3 rounded-full font-medium hover:bg-teal transition-colors hover:scale-105 transform duration-300"
            >
              Book Appointment
            </a>

            <a
              href="#services"
              className="border border-ink/20 text-ink px-7 py-3 rounded-full font-medium hover:bg-ink hover:text-ivory transition-colors"
            >
              View Services
            </a>
          </motion.div>
        </motion.div>

        {/* floating tooth illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex justify-center"
        >
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
          >
            <svg width="280" height="320" viewBox="0 0 280 320" fill="none">
              <defs>
                <linearGradient id="toothGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#2D9C8F" stopOpacity="0.25" />
                </linearGradient>
              </defs>
              <path
                d="M140 20c-45 0-70 30-70 70 0 35 15 55 20 90 4 28 12 60 30 90 6 10 20 10 26 0 8-15 12-35 14-55 2 20 6 40 14 55 6 10 20 10 26 0 18-30 26-62 30-90 5-35 20-55 20-90 0-40-25-70-70-70-8 0-15 3-20 8-5-5-12-8-20-8z"
                fill="url(#toothGrad)"
                stroke="#2D9C8F"
                strokeWidth="2"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}