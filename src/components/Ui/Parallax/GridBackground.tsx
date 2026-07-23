"use client";
import React from "react";

interface gridBackgroundProps {
  color?: string;
}

export default function gridBackground({ color = "rgba(167,139,250,0.4)" }: gridBackgroundProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px),
          linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        opacity: 0.04,
      }}
    />
  );
}
