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
      <div className="text-center">
        <p className="text-2xl font-semibold">You&apos;re on the list &#10003;</p>
        <p className="text-muted mt-2">We&apos;ll let you know when we launch.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      {/* Row: platform toggle + email — stacks on mobile */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setPlatform("ios")}
            className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
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
            className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
              platform === "android"
                ? "bg-accent text-background"
                : "bg-card border border-border text-muted hover:border-accent"
            }`}
          >
            Android
          </button>
        </div>
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent text-base"
        />
      </div>

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
        <p className="text-red-500 text-sm text-center">Something went wrong — try again</p>
      )}
    </form>
  );
}
