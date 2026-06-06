"use client";

import { useState } from "react";
import { IconArrowRight } from "@tabler/icons-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="bg-slate-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            New releases, delivered.
          </h2>
          <p className="text-base text-slate-400 mb-8 leading-relaxed">
            Get notified when new titles arrive. No spam, unsubscribe anytime.
          </p>

          {submitted ? (
            <p className="text-white font-semibold text-lg">
              You're subscribed. Welcome!
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="flex-1 px-4 py-3 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-colors"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors active:scale-[0.98]"
              >
                Subscribe
                <IconArrowRight stroke={2} size={15} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
