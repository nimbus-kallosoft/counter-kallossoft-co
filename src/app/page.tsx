"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabase } from "@/lib/supabase";

export default function Home() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCount = useCallback(async () => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("counters")
      .select("value")
      .eq("id", "main")
      .single();

    if (error) {
      console.error("Error fetching counter:", error);
      setCount(0);
    } else {
      setCount(data.value);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  const updateCount = async (delta: number) => {
    const supabase = getSupabase();
    const newValue = (count ?? 0) + delta;
    setCount(newValue);

    const { error } = await supabase
      .from("counters")
      .update({ value: newValue })
      .eq("id", "main");

    if (error) {
      console.error("Error updating counter:", error);
      fetchCount();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-[family-name:var(--font-geist-sans)] dark:bg-zinc-950">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-lg font-medium tracking-tight text-zinc-500 dark:text-zinc-400">
          Counter
        </h1>

        {loading ? (
          <div className="text-7xl font-bold tabular-nums text-zinc-300 dark:text-zinc-700">
            —
          </div>
        ) : (
          <div className="text-7xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
            {count}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => updateCount(-1)}
            disabled={loading}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 text-xl font-medium text-zinc-600 transition-colors hover:bg-zinc-100 active:bg-zinc-200 disabled:opacity-40 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
          >
            −
          </button>
          <button
            onClick={() => updateCount(1)}
            disabled={loading}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 text-xl font-medium text-zinc-600 transition-colors hover:bg-zinc-100 active:bg-zinc-200 disabled:opacity-40 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
          >
            +
          </button>
        </div>
      </main>
    </div>
  );
}
