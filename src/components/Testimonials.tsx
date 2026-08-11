"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const reviews = [
  {
    name: "Sarah M.",
    text: "Best dental experience I've ever had. The staff made me feel comfortable from the moment I walked in.",
    rating: 5,
  },
  {
    name: "James T.",
    text: "Same-day emergency appointment saved me from days of pain. Incredibly grateful for the quick care.",
    rating: 5,
  },
  {
    name: "Priya K.",
    text: "The whitening treatment results were visible immediately. Professional, clean, and modern clinic.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((a) => (a + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-28 bg-ivory relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="text-teal font-semibold text-sm uppercase tracking-wide">
            Patient Stories
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-ink mt-3">
            Loved by our patients
          </h2>
        </motion.div>

        <div className="relative min-h-[220px] flex items-center justify-center">
          {reviews.map((r, i) =>
            i === active ? (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <div className="text-coral text-xl mb-4">
                  {"★".repeat(r.rating)}
                </div>
                <p className="font-display text-xl md:text-2xl text-ink italic leading-relaxed mb-6">
                  &ldquo;{r.text}&rdquo;
                </p>
                <span className="text-charcoal/60 font-medium">{r.name}</span>
              </motion.div>
            ) : null
          )}
        </div>

        <div className="flex justify-center gap-3 mt-10">
          {reviews.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === active ? "bg-teal" : "bg-ink/20"
              }`}
              aria-label={`Show testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}