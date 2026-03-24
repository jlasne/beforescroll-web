"use client";

import { useState, FormEvent } from "react";

type Platform = "ios" | "android";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState<Platform>("ios");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, platform }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-md mx-auto text-center">
          <p className="text-2xl font-semibold">You&apos;re on the list &#10003;</p>
          <p className="text-muted mt-2">We&apos;ll let you know when we launch.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-16 md:py-20">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 font-[family-name:var(--font-dm-serif)]">
          Get notified when BeforeScroll launches
        </h2>
        <p className="text-muted mb-8">Be first to know. No spam.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Platform toggle */}
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => setPlatform("ios")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                platform === "ios"
                  ? "bg-accent text-background"
                  : "bg-card border border-border text-muted hover:border-accent"
              }`}
            >
              iOS
            </button>
            <button
              type="button"
              onClick={() => setPlatform("android")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                platform === "android"
                  ? "bg-accent text-background"
                  : "bg-card border border-border text-muted hover:border-accent"
              }`}
            >
              Android (coming soon)
            </button>
          </div>

          {/* Email input */}
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent text-base"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full px-6 py-3.5 rounded-xl bg-foreground text-background font-semibold text-base transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Joining...
              </span>
            ) : (
              "Get notified at launch"
            )}
          </button>

          {status === "error" && (
            <p className="text-red-500 text-sm">Something went wrong — try again</p>
          )}
        </form>
      </div>
    </section>
  );
}
