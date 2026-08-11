"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const points = [
  {
    icon: "🦷",
    title: "Modern Technology",
    desc: "Digital X-rays, laser treatment, and painless procedures.",
  },
  {
    icon: "⏱️",
    title: "Same-Day Appointments",
    desc: "Urgent care slots available every day, no long waits.",
  },
  {
    icon: "💳",
    title: "Flexible Payment Plans",
    desc: "Insurance accepted, plus interest-free financing options.",
  },
  {
    icon: "⭐",
    title: "5-Star Rated Care",
    desc: "Trusted by over 2,000 happy patients in the community.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: (i: number) => ({
    opacity: 0,
    x: -50,
    rotate: i % 2 === 0 ? -3 : 3,
  }),
  show: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { duration: 0.6, ease: [0, 0, 0.2, 1] },
  },
} as unknown as Variants;

export default function WhyUs() {
  return (
    <section id="why-us" className="py-28 bg-ink relative overflow-hidden">
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
        className="absolute top-10 right-10 w-72 h-72 rounded-full bg-teal/10 blur-3xl"
      />

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-teal font-semibold text-sm uppercase tracking-wide">
            Why Choose Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-ivory mt-3 mb-6">
            Care built around <span className="text-coral italic">your</span> comfort
          </h2>
          <p className="text-ivory/60 max-w-md">
            We combine modern technology with a gentle, patient-first approach — because dental visits shouldn&apos;t be stressful.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-6"
        >
          {points.map((p, i) => (
            <motion.div key={p.title} custom={i} variants={item}>
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{
                  duration: 4 + (i % 2),
                  repeat: Infinity,
                  ease: [0.42, 0, 0.58, 1],
                  delay: i * 0.3,
                }}
                whileHover={{ x: 8, scale: 1.02 }}
                className="flex items-start gap-4 bg-ivory/5 border border-ivory/10 rounded-xl p-5 hover:bg-ivory/10 transition-colors"
              >
                <span className="text-3xl">{p.icon}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ivory mb-1">
                    {p.title}
                  </h3>
                  <p className="text-ivory/50 text-sm">{p.desc}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}