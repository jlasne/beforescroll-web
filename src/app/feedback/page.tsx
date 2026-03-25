"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, FormEvent } from "react";

type FeedbackType = "feature" | "bug";
type SortMode = "votes" | "newest";
type StatusFilter = "all" | "open" | "planned" | "in_progress" | "shipped";

interface FeedbackRequest {
  id: string;
  title: string;
  description: string | null;
  type: FeedbackType;
  status: string;
  author_name: string | null;
  upvote_count: number;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  open: "bg-muted/20 text-muted",
  planned: "bg-accent/20 text-accent",
  in_progress: "bg-blue-100 text-blue-700",
  shipped: "bg-green-100 text-green-700",
  closed: "bg-muted/10 text-muted/60",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  planned: "Planned",
  in_progress: "In Progress",
  shipped: "Shipped",
  closed: "Closed",
};

function getFingerprint(): string {
  if (typeof window === "undefined") return "";
  let fp = localStorage.getItem("bs_voter_fp");
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem("bs_voter_fp", fp);
  }
  return fp;
}

export default function FeedbackPage() {
  const [type, setType] = useState<FeedbackType>("feature");
  const [sort, setSort] = useState<SortMode>("votes");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [requests, setRequests] = useState<FeedbackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formType, setFormType] = useState<FeedbackType>("feature");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ type, sort });
    if (status !== "all") params.set("status", status);
    const res = await fetch(`/api/feedback?${params}`);
    if (res.ok) {
      setRequests(await res.json());
    }
    setLoading(false);
  }, [type, sort, status]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    const stored = localStorage.getItem("bs_voted_ids");
    if (stored) {
      try {
        setVotedIds(new Set(JSON.parse(stored)));
      } catch { /* ignore */ }
    }
  }, []);

  async function handleVote(requestId: string) {
    if (votedIds.has(requestId)) return;

    // Optimistic update
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, upvote_count: r.upvote_count + 1 } : r
      )
    );
    const newVoted = new Set(votedIds).add(requestId);
    setVotedIds(newVoted);
    localStorage.setItem("bs_voted_ids", JSON.stringify([...newVoted]));

    const res = await fetch("/api/feedback/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: requestId, voter_fingerprint: getFingerprint() }),
    });

    if (!res.ok) {
      // Revert on failure (except 409 which means already voted)
      if (res.status !== 409) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId ? { ...r, upvote_count: r.upvote_count - 1 } : r
          )
        );
        newVoted.delete(requestId);
        setVotedIds(new Set(newVoted));
        localStorage.setItem("bs_voted_ids", JSON.stringify([...newVoted]));
      }
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (title.length < 5) return;

    setSubmitStatus("loading");
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || undefined,
        type: formType,
        author_name: authorName || undefined,
        author_email: authorEmail || undefined,
      }),
    });

    if (res.ok) {
      setSubmitStatus("success");
      setTitle("");
      setDescription("");
      setAuthorName("");
      setAuthorEmail("");
      fetchRequests();
    } else {
      setSubmitStatus("error");
    }
  }

  return (
    <main className="min-h-screen px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-accent text-sm font-medium hover:underline"
        >
          &larr; Back to home
        </Link>

        <h1 className="text-3xl font-bold mt-8 mb-2">Feedback Board</h1>
        <p className="text-muted mb-8">
          Vote on what we should build next, or report a bug.
        </p>

        {/* Submit toggle */}
        <button
          onClick={() => {
            setShowForm(!showForm);
            setSubmitStatus("idle");
          }}
          className="mb-6 px-5 py-2.5 rounded-xl bg-accent text-background font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95"
        >
          {showForm ? "Cancel" : "+ Submit a request"}
        </button>

        {/* Submit form */}
        {showForm && (
          <div className="animate-fade-in bg-card border border-border rounded-2xl p-6 mb-8">
            {submitStatus === "success" ? (
              <p className="text-center font-semibold py-4">
                Thanks! Your request has been submitted.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={formType === "feature"}
                      onChange={() => setFormType("feature")}
                      className="accent-accent"
                    />
                    <span className="text-sm font-medium">Feature</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={formType === "bug"}
                      onChange={() => setFormType("bug")}
                      className="accent-accent"
                    />
                    <span className="text-sm font-medium">Bug</span>
                  </label>
                </div>
                <input
                  type="text"
                  required
                  minLength={5}
                  placeholder="Title (min 5 chars)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent text-base"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent text-base resize-none"
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitStatus === "loading" || title.length < 5}
                  className="w-full px-6 py-3 rounded-xl bg-foreground text-background font-semibold text-base transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitStatus === "loading" ? "Submitting..." : "Submit"}
                </button>
                {submitStatus === "error" && (
                  <p className="text-red-500 text-sm text-center">Something went wrong — try again</p>
                )}
              </form>
            )}
          </div>
        )}

        {/* Tabs + filters */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Type tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setType("feature")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                type === "feature"
                  ? "bg-accent text-background"
                  : "bg-card border border-border text-muted hover:border-accent"
              }`}
            >
              Feature Requests
            </button>
            <button
              onClick={() => setType("bug")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                type === "bug"
                  ? "bg-accent text-background"
                  : "bg-card border border-border text-muted hover:border-accent"
              }`}
            >
              Bug Reports
            </button>
          </div>

          {/* Sort + status */}
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortMode)}
                className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="votes">Most Voted</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted">Status:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusFilter)}
                className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="shipped">Shipped</option>
              </select>
            </div>
          </div>
        </div>

        {/* Request list */}
        {loading ? (
          <div className="text-center text-muted py-12">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="text-center text-muted py-12">
            No {type === "feature" ? "feature requests" : "bug reports"} yet. Be the first!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {requests.map((r) => (
              <div
                key={r.id}
                className="animate-fade-in flex items-start gap-4 bg-card border border-border rounded-2xl p-4"
              >
                {/* Upvote */}
                <button
                  onClick={() => handleVote(r.id)}
                  className={`flex flex-col items-center min-w-[48px] pt-1 transition-all ${
                    votedIds.has(r.id)
                      ? "text-accent"
                      : "text-muted hover:text-accent"
                  }`}
                >
                  <span className="text-lg leading-none">&#9650;</span>
                  <span className="text-sm font-semibold">{r.upvote_count}</span>
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground leading-snug">{r.title}</p>
                  {r.description && (
                    <p className="text-muted text-sm mt-1 line-clamp-2">{r.description}</p>
                  )}
                  {r.author_name && (
                    <p className="text-muted/60 text-xs mt-2">by {r.author_name}</p>
                  )}
                </div>

                {/* Status badge */}
                <span
                  className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    STATUS_COLORS[r.status] || STATUS_COLORS.open
                  }`}
                >
                  {STATUS_LABELS[r.status] || r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
