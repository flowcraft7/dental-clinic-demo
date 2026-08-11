"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Appointment = {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  status: "pending" | "approved" | "cancelled";
  created_at: string;
};

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "cancelled">("all");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });
    setAppointments(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("appointments").update({ status }).eq("id", id);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: status as Appointment["status"] } : a))
    );
  };

  const filtered = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-teal/15 text-teal",
    cancelled: "bg-coral/15 text-coral",
  };

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl font-semibold text-ink mb-6"
      >
        Appointments
      </motion.h1>

      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm capitalize transition-colors ${
              filter === f ? "bg-ink text-ivory" : "bg-white text-charcoal/70 border border-ink/10"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-charcoal/50">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-charcoal/50">No appointments found.</p>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {filtered.map((a) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-ink/5 flex items-center justify-between flex-wrap gap-4"
              >
                <div>
                  <p className="font-semibold text-ink">{a.name}</p>
                  <p className="text-sm text-charcoal/60">
                    {a.phone} · {a.service} · {a.date}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColor[a.status]}`}>
                    {a.status}
                  </span>
                  {a.status !== "approved" && (
                    <button
                      onClick={() => updateStatus(a.id, "approved")}
                      className="text-sm px-3 py-1.5 rounded-lg bg-teal text-ivory hover:brightness-110 transition"
                    >
                      Approve
                    </button>
                  )}
                  {a.status !== "cancelled" && (
                    <button
                      onClick={() => updateStatus(a.id, "cancelled")}
                      className="text-sm px-3 py-1.5 rounded-lg bg-coral/10 text-coral hover:bg-coral/20 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}