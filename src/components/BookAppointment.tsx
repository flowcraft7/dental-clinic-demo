"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ChatWidget from "./ChatWidget";
import { supabase } from "@/lib/supabase";

export default function BookAppointment() {
  const [services, setServices] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      const { data } = await supabase
        .from("services")
        .select("title")
        .order("sort_order", { ascending: true });
      setServices(data?.map((s) => s.title) || []);
    };
    loadServices();
  }, []);

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    await supabase.from("appointments").insert({
      name: form.name,
      phone: form.phone,
      email: form.email,
      service: form.service,
      date: form.date,
    });
    setSubmitted(true);
  };

  return (
    <section id="book" className="py-28 bg-ink relative overflow-hidden">
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-teal/10 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 relative z-10"
      >
        <span className="text-teal font-semibold text-sm uppercase tracking-wide">
          Book Now
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-ivory mt-3">
          Reserve your visit
        </h2>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-10 items-start">
        <div className="bg-ivory rounded-2xl p-8 shadow-2xl">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="text-5xl mb-4">✅</div>
              <h3 className="font-display text-2xl font-semibold text-ink mb-2">
                Appointment Requested!
              </h3>
              <p className="text-charcoal/60">
                We&apos;ll confirm {form.date} for {form.service} shortly.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="flex gap-2 mb-8">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex-1 h-1.5 rounded-full bg-ink/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-teal"
                      initial={{ width: 0 }}
                      animate={{ width: step >= n ? "100%" : "0%" }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-ink mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full border border-ink/15 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-teal"
                    />
                    <label className="block text-sm font-medium text-ink mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      className="w-full border border-ink/15 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-teal"
                    />
                    <label className="block text-sm font-medium text-ink mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full border border-ink/15 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal"
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-ink mb-2">
                      Select Service
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {services.map((s) => (
                        <motion.button
                          key={s}
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setForm({ ...form, service: s })}
                          className={`text-sm px-3 py-3 rounded-lg border transition-colors ${
                            form.service === s
                              ? "bg-teal text-ivory border-teal"
                              : "border-ink/15 text-ink hover:border-teal"
                          }`}
                        >
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-ink mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full border border-ink/15 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button
                    onClick={back}
                    className="px-6 py-2.5 rounded-full text-sm font-medium text-ink border border-ink/15 hover:bg-ink/5 transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <span />
                )}

                {step < 3 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={next}
                    className="px-6 py-2.5 rounded-full text-sm font-medium bg-ink text-ivory hover:bg-teal transition-colors"
                  >
                    Continue
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    className="px-6 py-2.5 rounded-full text-sm font-medium bg-coral text-ivory hover:brightness-110 transition"
                  >
                    Confirm Booking
                  </motion.button>
                )}
              </div>
            </>
          )}
        </div>

        <ChatWidget />
      </div>
    </section>
  );
}