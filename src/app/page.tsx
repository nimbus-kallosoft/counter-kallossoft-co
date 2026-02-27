"use client";

import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [count, setCount] = useState<number | null>(null);
  const [animate, setAnimate] = useState(false);
  const prevCount = useRef<number | null>(null);

  useEffect(() => {
    async function recordVisit() {
      try {
        const res = await fetch("/api/visit", { method: "POST" });
        const data = await res.json();
        if (data.count != null) {
          setCount(data.count);
        }
      } catch {
        try {
          const res = await fetch("/api/visit");
          const data = await res.json();
          if (data.count != null) {
            setCount(data.count);
          }
        } catch {
          setCount(0);
        }
      }
    }

    recordVisit();
  }, []);

  useEffect(() => {
    if (count !== null && prevCount.current !== count) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 600);
      prevCount.current = count;
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <main className="flex flex-col items-center gap-6">
        <div
          className={`tabular-nums font-[family-name:var(--font-geist-mono)] transition-all duration-600 ${
            count === null
              ? "text-[#333] text-8xl sm:text-9xl font-bold"
              : animate
                ? "text-white text-8xl sm:text-9xl font-bold scale-105 opacity-100"
                : "text-white text-8xl sm:text-9xl font-bold scale-100 opacity-100"
          }`}
        >
          {count === null ? "—" : count.toLocaleString()}
        </div>

        <p className="text-sm uppercase tracking-[0.3em] text-[#555] font-[family-name:var(--font-geist-sans)]">
          Visits
        </p>
      </main>
    </div>
  );
}
