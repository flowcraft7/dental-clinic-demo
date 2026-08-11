"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type ContentRow = { key: string; value: string };

export default function ContentAdmin() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("site_content").select("*");
    const map: Record<string, string> = {};
    (data as ContentRow[] | null)?.forEach((row) => {
      map[row.key] = row.value;
    });
    setContent(map);
    setLoading(false);
  };

  useEffect(() => {
    void (async () => {
      await load();
    })();
  }, []);

  const update = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const saveAll = async () => {
    const updates = Object.entries(content).map(([key, value]) =>
      supabase.from("site_content").upsert({ key, value })
    );
    await Promise.all(updates);
    setSaved(true);
  };

  const fields = [
    { key: "hero_title", label: "Hero Title" },
    { key: "hero_subtitle", label: "Hero Subtitle" },
  ];

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl font-semibold text-ink mb-6"
      >
        Site Content
      </motion.h1>

      {loading ? (
        <p className="text-charcoal/50">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-ink/5 grid gap-5 max-w-xl">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-ink mb-2">{f.label}</label>
              <textarea
                value={content[f.key] || ""}
                onChange={(e) => update(f.key, e.target.value)}
                rows={f.key === "hero_title" ? 2 : 3}
                className="w-full border border-ink/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>
          ))}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveAll}
            className="justify-self-start px-6 py-2.5 rounded-full text-sm font-medium bg-ink text-ivory hover:bg-teal transition-colors"
          >
            Save Changes
          </motion.button>
          {saved && <p className="text-teal text-sm">Saved ✅</p>}
        </div>
      )}
    </div>
  );
}