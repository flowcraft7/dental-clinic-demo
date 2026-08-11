"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleLogin}
        className="bg-ivory rounded-2xl p-8 w-full max-w-sm shadow-2xl"
      >
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">Admin Login</h1>
        <p className="text-charcoal/60 text-sm mb-6">Bright Smile Dental Portal</p>

        <label className="block text-sm font-medium text-ink mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-ink/15 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-teal"
        />

        <label className="block text-sm font-medium text-ink mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-ink/15 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-teal"
        />

        {error && <p className="text-coral text-sm mb-4">{error}</p>}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-ivory py-3 rounded-full font-medium hover:bg-teal transition-colors disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>
      </motion.form>
    </div>
  );
}