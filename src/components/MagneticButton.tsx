"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

type MagneticButtonProps = {
  href: string;
  className?: string;
  children?: React.ReactNode;
  strength?: number; // pixels of translate
};

export default function MagneticButton({ href, className = "", children, strength = 20 }: MagneticButtonProps) {
  const elRef = useRef<HTMLAnchorElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    function handleMove(e: MouseEvent) {
      const currentEl = elRef.current;
      const currentInner = innerRef.current;
      if (!currentEl || !currentInner) return;
      const rect = currentEl.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tx = (x / (rect.width / 2)) * strength;
      const ty = (y / (rect.height / 2)) * strength;
      gsap.to(currentInner, { x: tx, y: ty, duration: 0.3, ease: "power3.out" });
    }

    function reset() {
      const currentInner = innerRef.current;
      if (!currentInner) return;
      gsap.to(currentInner, { x: 0, y: 0, duration: 0.4, ease: "power3.out" });
    }

    function handleTouchMove(ev: TouchEvent) {
      const touch = ev.touches[0];
      if (!touch) return;
      handleMove(touch as unknown as MouseEvent);
    }

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", reset);
    el.addEventListener("touchmove", handleTouchMove);
    el.addEventListener("touchend", reset);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", reset);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", reset);
    };
  }, [strength]);

  return (
    <a ref={elRef} href={href} className={className}>
      <span ref={innerRef} style={{ display: "inline-block", transform: "translate3d(0,0,0)" }}>
        {children}
      </span>
    </a>
  );
}