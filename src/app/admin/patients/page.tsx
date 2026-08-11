"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Patient = {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  created_at: string;
};

export default function PatientsAdmin() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: "", phone: "", email: "", notes: "" });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("patients").select("*").order("created_at", { ascending: false });
    setPatients(data || []);
    setLoading(false);
  };

  useEffect(() => {
    void (async () => {
      await load();
    })();
  }, []);

  const addPatient = async () => {
    if (!newPatient.name.trim()) return;
    const { data } = await supabase.from("patients").insert(newPatient).select().single();
    if (data) setPatients((prev) => [data, ...prev]);
    setNewPatient({ name: "", phone: "", email: "", notes: "" });
    setShowForm(false);
  };

  const remove = async (id: string) => {
    await supabase.from("patients").delete().eq("id", id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-semibold text-ink"
        >
          Patients
        </motion.h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-sm px-4 py-2 rounded-full bg-ink text-ivory hover:bg-teal transition-colors"
        >
          + Add Patient
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-ink/5 mb-6 grid sm:grid-cols-2 gap-3"
        >
          <input
            placeholder="Name"
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
            className="border border-ink/15 rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Phone"
            value={newPatient.phone}
            onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
            className="border border-ink/15 rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Email"
            value={newPatient.email}
            onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
            className="border border-ink/15 rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Notes"
            value={newPatient.notes}
            onChange={(e) => setNewPatient({ ...newPatient, notes: e.target.value })}
            className="border border-ink/15 rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={addPatient}
            className="sm:col-span-2 text-sm px-4 py-2 rounded-lg bg-teal text-ivory hover:brightness-110 transition"
          >
            Save Patient
          </button>
        </motion.div>
      )}

      <input
        placeholder="Search patients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-teal"
      />

      {loading ? (
        <p className="text-charcoal/50">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-charcoal/50">No patients found.</p>
      ) : (
        <div className="grid gap-3">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-ink/5 flex items-center justify-between flex-wrap gap-3"
            >
              <div>
                <p className="font-semibold text-ink">{p.name}</p>
                <p className="text-sm text-charcoal/60">
                  {p.phone} {p.email && `· ${p.email}`}
                </p>
                {p.notes && <p className="text-xs text-charcoal/40 mt-1">{p.notes}</p>}
              </div>
              <button
                onClick={() => remove(p.id)}
                className="text-sm px-3 py-1.5 rounded-lg bg-coral/10 text-coral hover:bg-coral/20 transition"
              >
                Delete
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}