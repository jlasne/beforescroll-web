"use client";

import { useState, FormEvent } from "react";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/beforescrollapp/id6761055117";

export default function DualCTA() {
  const [showAndroidForm, setShowAndroidForm] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, platform: "android" }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4">
      {/* Two buttons: stacked on mobile, side-by-side on sm+ */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {/* App Store — direct link */}
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-foreground text-background font-semibold text-base transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95"
          aria-label="Download on the App Store"
        >
          {/* Apple glyph */}
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6"
            fill="currentColor"
            aria-hidden
          >
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[10px] font-normal opacity-80">
              Download on the
            </span>
            <span className="text-base font-bold">App Store</span>
          </div>
        </a>

        {/* Android waitlist — toggles inline form */}
        <button
          type="button"
          onClick={() => setShowAndroidForm((v) => !v)}
          className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-foreground bg-card text-foreground font-semibold text-base transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95"
          aria-expanded={showAndroidForm}
          aria-controls="android-waitlist-form"
        >
          {/* Inline Google Play glyph */}
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6"
            fill="currentColor"
            aria-hidden
          >
            <path d="M3.609 1.814 13.792 12 3.609 22.186a.996.996 0 0 1-.61-.92V2.734a.996.996 0 0 1 .61-.92zM14.916 13.124l2.495 2.495-12.385 7.064 9.89-9.559zm3.272-2.272 2.692 1.535a1.1 1.1 0 0 1 0 1.928l-2.692 1.535-2.829-2.825 2.829-2.173zM5.026 1.317l12.385 7.064-2.495 2.495L5.026 1.317z" />
          </svg>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[10px] font-normal opacity-70">
              {showAndroidForm ? "ENTER YOUR EMAIL" : "COMING SOON ON"}
            </span>
            <span className="text-base font-bold">
              {showAndroidForm ? "We'll notify you" : "Android, join waitlist"}
            </span>
          </div>
        </button>
      </div>

      {/* Inline Android email form */}
      {showAndroidForm && status !== "success" && (
        <form
          id="android-waitlist-form"
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 animate-fade-in"
        >
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent text-base"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 rounded-xl bg-accent text-background font-semibold text-base transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Joining..." : "Join Android waitlist"}
          </button>
        </form>
      )}

      {status === "success" && (
        <div className="text-center py-2">
          <p className="text-lg font-semibold">You&apos;re on the Android list &#10003;</p>
          <p className="text-muted text-sm mt-1">
            We&apos;ll email you the moment BeforeScroll lands on Android.
          </p>
        </div>
      )}

      {status === "error" && (
        <p className="text-red-500 text-sm text-center">
          Something went wrong, try again
        </p>
      )}
    </div>
  );
}
