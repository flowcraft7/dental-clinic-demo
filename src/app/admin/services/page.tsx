"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Service = {
  id: string;
  title: string;
  price: string;
  description: string;
  sort_order: number;
};

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setServices(data || []);
    setLoading(false);
  };

  useEffect(() => {
    void (async () => {
      await load();
    })();
  }, []);

  const updateField = (id: string, field: keyof Service, value: string) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const save = async (s: Service) => {
    await supabase
      .from("services")
      .update({ title: s.title, price: s.price, description: s.description })
      .eq("id", s.id);
    setEditing(null);
  };

  const addService = async () => {
    const { data } = await supabase
      .from("services")
      .insert({ title: "New Service", price: "$0", description: "Description here", sort_order: services.length + 1 })
      .select()
      .single();
    if (data) setServices((prev) => [...prev, data]);
  };

  const remove = async (id: string) => {
    await supabase.from("services").delete().eq("id", id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-semibold text-ink"
        >
          Services
        </motion.h1>
        <button
          onClick={addService}
          className="text-sm px-4 py-2 rounded-full bg-ink text-ivory hover:bg-teal transition-colors"
        >
          + Add Service
        </button>
      </div>

      {loading ? (
        <p className="text-charcoal/50">Loading...</p>
      ) : (
        <div className="grid gap-3">
          {services.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-ink/5"
            >
              {editing === s.id ? (
                <div className="grid gap-2">
                  <input
                    value={s.title}
                    onChange={(e) => updateField(s.id, "title", e.target.value)}
                    className="border border-ink/15 rounded-lg px-3 py-2 text-sm font-semibold"
                  />
                  <input
                    value={s.price}
                    onChange={(e) => updateField(s.id, "price", e.target.value)}
                    className="border border-ink/15 rounded-lg px-3 py-2 text-sm text-coral"
                  />
                  <textarea
                    value={s.description}
                    onChange={(e) => updateField(s.id, "description", e.target.value)}
                    className="border border-ink/15 rounded-lg px-3 py-2 text-sm"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => save(s)}
                      className="text-sm px-3 py-1.5 rounded-lg bg-teal text-ivory"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="text-sm px-3 py-1.5 rounded-lg border border-ink/15"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-ink">{s.title}</p>
                    <p className="text-sm text-charcoal/60">{s.description}</p>
                    <p className="text-sm text-coral font-medium mt-1">{s.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(s.id)}
                      className="text-sm px-3 py-1.5 rounded-lg bg-ink/5 text-ink hover:bg-ink/10"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(s.id)}
                      className="text-sm px-3 py-1.5 rounded-lg bg-coral/10 text-coral hover:bg-coral/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}