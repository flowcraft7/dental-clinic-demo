"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "@/lib/supabase";
import Hero3DTooth from "./Hero3DTooth";

gsap.registerPlugin(ScrollTrigger);

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function Hero() {
  const [title, setTitle] = useState("Dental care that feels different.");
  const [subtitle, setSubtitle] = useState(
    "Modern, gentle, and built around you. Book your visit in under a minute — no phone calls needed."
  );

  const sectionRef = useRef<HTMLElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const toothWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadContent = async () => {
      const { data } = await supabase
        .from("site_content")
        .select("key, value")
        .in("key", ["hero_title", "hero_subtitle"]);

      data?.forEach((row) => {
        if (row.key === "hero_title" && row.value) setTitle(row.value);
        if (row.key === "hero_subtitle" && row.value) setSubtitle(row.value);
      });
    };
    loadContent();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(blob1Ref.current, {
        yPercent: 40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(blob2Ref.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(toothWrapRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const words = title.trim().split(" ");
  const lastWord = words.pop();
  const restOfTitle = words.join(" ");

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden bg-ivory pt-24">
      <div ref={blob1Ref} className="absolute -top-20 -left-20 w-96 h-96">
        <motion.div
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="w-full h-full rounded-full bg-teal/20 blur-3xl"
        />
      </div>
      <div ref={blob2Ref} className="absolute bottom-0 right-0 w-96 h-96">
        <motion.div
          animate={{ y: [0, -25, 0], x: [0, -15, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="w-full h-full rounded-full bg-coral/20 blur-3xl"
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div variants={container} initial="hidden" animate="show">
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
            {restOfTitle} <span className="text-coral italic">{lastWord}</span>
          </motion.h1>

          <motion.p variants={item} className="text-charcoal/70 text-lg mb-8 max-w-md">
            {subtitle}
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

        <motion.div
          ref={toothWrapRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex justify-center"
        >
          <Hero3DTooth />
        </motion.div>
      </div>
    </section>
  );
}