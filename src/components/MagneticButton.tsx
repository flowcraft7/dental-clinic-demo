"use client";

import React from "react";

type MagneticButtonProps = {
  href: string;
  className?: string;
  children?: React.ReactNode;
};

export default function MagneticButton({ href, className = "", children }: MagneticButtonProps) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}