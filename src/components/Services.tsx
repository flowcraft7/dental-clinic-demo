"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Service = {
  id: string;
  title: string;
  price: string;
  description: string;
  sort_order: number;
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 70,
    scale: 0.85,
    rotate: i % 2 === 0 ? -6 : 6,
  }),
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });
      setServices(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <section id="services" className="py-28 bg-ivory relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-teal font-semibold text-sm uppercase tracking-wide">
            Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-ink mt-3">
            Everything your smile needs
          </h2>
        </motion.div>

        {loading ? (
          <p className="text-center text-charcoal/50">Loading...</p>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((s, i) => (
              <motion.div key={s.id} custom={i} variants={item}>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3 + (i % 3),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                  whileHover={{ y: -12, rotate: -1, scale: 1.03 }}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-ink/5 cursor-pointer h-full"
                >
                  <h3 className="font-display text-xl font-semibold text-ink mb-2">
                    {s.title}
                  </h3>
                  <p className="text-charcoal/60 text-sm mb-4">{s.description}</p>
                  <span className="text-coral font-semibold">{s.price}</span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}