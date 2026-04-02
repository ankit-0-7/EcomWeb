import React, { useState, useEffect, useRef } from 'react';

// --- Utility: Intersection Observer Hook ---
export function useInView(opts = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { 
        if (e.isIntersecting) { setVisible(true); obs.disconnect(); } 
    }, { threshold: 0.15, ...opts });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// --- Animated Section Wrapper ---
export function Reveal({ children, delay = 0, direction = "up", style = {} }) {
  const [ref, visible] = useInView();
  const transforms = { up: "translateY(60px)", down: "translateY(-60px)", left: "translateX(60px)", right: "translateX(-60px)", none: "none" };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : transforms[direction],
      transition: `opacity 1s cubic-bezier(.16,1,.3,1) ${delay}s, transform 1s cubic-bezier(.16,1,.3,1) ${delay}s`,
      ...style,
    }}>
        {children}
    </div>
  );
}

// --- Marquee ---
export function Marquee({ text }) {
  return (
    <div style={{ 
        overflow: "hidden", 
        background: "transparent", /* Lets the parent container dictate the background color */
        color: "inherit",          /* Lets the parent container dictate the text color */
        padding: "10px 0", 
        fontSize: 11, 
        letterSpacing: 4, 
        textTransform: "uppercase", 
        fontFamily: "'Montserrat', sans-serif" /* 🌟 Forced Niali Typography */
    }}>
      <div style={{ display: "inline-block", whiteSpace: "nowrap", animation: "marquee 25s linear infinite" }}>
        {Array(6).fill(text).map((t, i) => <span key={i} style={{ marginRight: 80 }}>{t}</span>)}
      </div>
    </div>
  );
}

// --- Cursor Follower ---
export function CursorFollower() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  
  useEffect(() => {
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  
  return (
      <div style={{ 
          position: "fixed", 
          left: pos.x - 15, 
          top: pos.y - 15, 
          width: 30, 
          height: 30, 
          border: "1px solid rgba(90, 18, 24, 0.5)", /* 🌟 Niali Burgundy instead of gold */
          borderRadius: "50%", 
          pointerEvents: "none", 
          zIndex: 9999, 
          transition: "left 0.15s ease-out, top 0.15s ease-out, transform 0.2s" 
      }} />
  );
}