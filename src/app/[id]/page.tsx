"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { Charger, Comment } from "@/lib/types";
import { formatPower, formatCost, formatPhone, formatDayHours } from "@/lib/format";
import { Badge24hr, ActiveBadge, ChargerTypeBadge, LocationTypeBadge } from "@/components/badges";
import { LightningIcon, MapPinIcon, PhoneIcon } from "@/components/icons";
import { PageFooter } from "@/components/page-footer";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface RegisteredUser {
  id: number;
  name: string;
}

export default function ChargerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [charger, setCharger] = useState<Charger | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingCharger, setLoadingCharger] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null);
  const [userName, setUserName] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captcha] = useState(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { a, b, answer: a + b };
  });
  const [registering, setRegistering] = useState(false);
  const [regError, setRegError] = useState("");

  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userReactions, setUserReactions] = useState<Record<number, "like" | "dislike" | null>>({});

  const registrationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("chargemappk_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.id && parsed?.name) {
          setRegisteredUser(parsed);
        } else {
          localStorage.removeItem("chargemappk_user");
        }
      }
    } catch {
      localStorage.removeItem("chargemappk_user");
    }
  }, []);

  useEffect(() => {
    fetch("/api/chargers")
      .then((r) => r.json())
      .then((chargers: Charger[]) => {
        const found = chargers.find((c) => c.id === id);
        if (found) setCharger(found);
        else setNotFound(true);
        setLoadingCharger(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoadingCharger(false);
      });

    fetch(`/api/comments?charger_id=${id}`)
      .then((r) => r.json())
      .then((data: Comment[]) => {
        const valid = Array.isArray(data) ? data.filter((c) => c.id != null && c.content) : [];
        setComments(valid);
        setLoadingComments(false);
      })
      .catch(() => setLoadingComments(false));
  }, [id]);

  async function handleRegister() {
    setRegError("");
    if (!userName.trim()) { setRegError("Please enter your name."); return; }
    if (parseInt(captchaAnswer) !== captcha.answer) { setRegError("Incorrect answer. Try again."); return; }
    setRegistering(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: userName.trim() }),
      });
      const user = await res.json();
      if (!user?.id) {
        setRegError("Registration failed. Please try again.");
        return;
      }
      const reg: RegisteredUser = { id: user.id, name: user.name };
      localStorage.setItem("chargemappk_user", JSON.stringify(reg));
      setRegisteredUser(reg);
    } catch {
      setRegError("Registration failed. Please try again.");
    } finally {
      setRegistering(false);
    }
  }

  async function handleSubmitComment() {
    if (!commentText.trim() || !registeredUser || submitting) return;
    const text = commentText.trim();
    setCommentText("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "add_comment",
          user_id: String(registeredUser.id),
          charger_id: id,
          content: text,
        }),
      });
      const newComment = await res.json();
      if (newComment?.id) setComments((prev) => [newComment, ...prev]);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReaction(commentId: number, reactionType: "like" | "dislike") {
    if (!registeredUser?.id) {
      registrationRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const current = userReactions[commentId] ?? null;
    // Clicking the same reaction again → toggle off (backend handles); otherwise switch to new reaction
    const newReaction: "like" | "dislike" | null = current === reactionType ? null : reactionType;

    // Optimistic state update
    setUserReactions((prev) => ({ ...prev, [commentId]: newReaction }));
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        let { like_count, dislike_count } = c;
        if (current === "like") like_count = Math.max(0, like_count - 1);
        else if (current === "dislike") dislike_count = Math.max(0, dislike_count - 1);
        if (newReaction === "like") like_count++;
        else if (newReaction === "dislike") dislike_count++;
        return { ...c, like_count, dislike_count };
      })
    );

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "add_comment_reaction",
          comment_id: String(commentId),
          user_id: String(registeredUser.id),
          reaction_type: reactionType,
        }),
      });
      const data = await res.json();
      const result = Array.isArray(data) ? data[0] : data;
      if (result?.total_like_counts != null) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, like_count: result.total_like_counts, dislike_count: result.total_dislike_counts }
              : c
          )
        );
      }
    } catch { /* keep optimistic counts on error */ }
  }

  const captchaValid = parseInt(captchaAnswer) === captcha.answer;
  const oh = charger?.opening_hours;
  const shortId = id.slice(-5).toUpperCase();

  if (loadingCharger) {
    return (
      <div className="min-h-screen bg-surface">
        <PageHeader />
        <main className="max-w-2xl mx-auto px-6 py-12 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-surface-raised animate-pulse" />
          ))}
        </main>
      </div>
    );
  }

  if (notFound || !charger) {
    return (
      <div className="min-h-screen bg-surface">
        <PageHeader />
        <main className="max-w-2xl mx-auto px-6 py-24 text-center">
          <p className="text-4xl mb-4">⚡</p>
          <h1 className="text-2xl font-bold text-text-primary mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Charger not found
          </h1>
          <p className="text-text-secondary mb-8">No charger with ID <code className="font-mono text-brand">#{shortId}</code> exists.</p>
          <Link href="/" className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors">
            Back to Map
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <PageHeader />

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">

        {/* Charger Info */}
        <section className="rounded-2xl border border-border bg-surface-raised p-6 space-y-4">

          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <LightningIcon className="w-5 h-5 text-brand" fill="currentColor" />
              <span className="text-2xl font-bold text-text-primary tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
                {formatPower(charger.power_kw)}
                <span className="text-base font-normal text-text-secondary ml-1">kW</span>
              </span>
            </div>
            <ChargerTypeBadge type={charger.charger_type} />
            {charger.is_available_24hrs && <Badge24hr />}
            <ActiveBadge isActive={charger.is_open} />
          </div>

          {/* Address */}
          <p className="text-base text-text-primary leading-snug">{charger.address}</p>

          {/* City / Province */}
          <div className="flex items-center gap-1.5">
            <MapPinIcon className="w-4 h-4 text-text-secondary shrink-0" />
            <span className="text-sm text-text-secondary">{charger.city}, {charger.province_territory}</span>
          </div>

          {/* Phone */}
          {charger.phone_number && (
            <div className="flex items-center gap-1.5">
              <PhoneIcon className="w-4 h-4 text-text-secondary shrink-0" />
              <span className="text-sm text-text-secondary">{formatPhone(charger.phone_number)}</span>
            </div>
          )}

          {/* Cost */}
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold text-brand tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
              {formatCost(charger.cost_per_kwh)}/kWh
            </span>
            {charger.cost_per_kwh_peak != null && (
              <span className="text-sm font-semibold text-amber-500 tabular-nums">
                {formatCost(charger.cost_per_kwh_peak)}/kWh (Peak hours)
              </span>
            )}
          </div>

          {/* Opening hours */}
          {!charger.is_available_24hrs && oh && (
            <div className="text-sm text-text-secondary space-y-1 border-t border-border pt-3">
              {[
                { label: "Weekdays", key: "weekday" as const },
                { label: "Friday", key: "friday" as const },
                { label: "Weekend", key: "weekend" as const },
              ].map(({ label, key }) => {
                const hours = formatDayHours(oh[key]);
                return hours ? (
                  <div key={key} className="flex justify-between gap-4">
                    <span className="font-medium">{label}</span>
                    <span className={oh[key]?.closed ? "text-danger" : ""}>{hours}</span>
                  </div>
                ) : null;
              })}
            </div>
          )}

          {/* Notes */}
          {charger.notes && (
            <div className="flex items-start gap-2 border-t border-border pt-3">
              <svg className="w-4 h-4 text-text-secondary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <p className="text-sm text-text-secondary italic">{charger.notes}</p>
            </div>
          )}

          {/* Location type + Maps */}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <LocationTypeBadge type={charger.location_type} />
            <a
              href={`https://www.google.com/maps?q=${charger.latitude},${charger.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-brand hover:bg-brand/10 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Open in Google Maps
            </a>
          </div>
        </section>

        {/* Record info */}
        <section className="text-xs text-text-secondary space-y-1 px-1">
          {charger.created_by_name && (
            <p>Added by <span className="font-medium text-text-primary">{charger.created_by_name}</span> on {formatDate(charger.created_at)}</p>
          )}
          {charger.updated_by_name && charger.updated_by_name !== charger.created_by_name && (
            <p>Last updated by <span className="font-medium text-text-primary">{charger.updated_by_name}</span> on {formatDate(charger.updated_at)}</p>
          )}
          {!charger.created_by_name && (
            <p>Added on {formatDate(charger.created_at)}</p>
          )}
          <p className="font-mono text-text-secondary/50">ID: {id}</p>
        </section>

        {/* Comments */}
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Comments {!loadingComments && `(${comments.length})`}
          </h2>

          {loadingComments ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-surface-raised animate-pulse" />
              ))}
            </div>
          ) : comments.length === 0 ? (
            <p className="text-sm text-text-secondary py-4">No comments yet. Be the first to comment!</p>
          ) : (
            <div className="space-y-3 mb-6">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-xl border border-border bg-surface-raised p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">
                      {registeredUser && registeredUser.id === comment.user_id
                        ? registeredUser.name
                        : `User #${comment.user_id}`}
                    </span>
                    <span className="text-xs text-text-secondary">{timeAgo(comment.created_at)}</span>
                  </div>
                  <p className="text-sm text-text-primary">{comment.content}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleReaction(comment.id, "like")}
                      title={registeredUser?.id ? "Like" : "Register to react"}
                      className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full transition-colors ${
                        userReactions[comment.id] === "like"
                          ? "bg-green-100 text-green-700"
                          : "text-text-secondary hover:bg-green-50 hover:text-green-600"
                      }`}
                    >
                      <span>👍</span>
                      <span>{comment.like_count}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReaction(comment.id, "dislike")}
                      title={registeredUser?.id ? "Dislike" : "Register to react"}
                      className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full transition-colors ${
                        userReactions[comment.id] === "dislike"
                          ? "bg-red-100 text-red-600"
                          : "text-text-secondary hover:bg-red-50 hover:text-red-500"
                      }`}
                    >
                      <span>👎</span>
                      <span>{comment.dislike_count}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment input (registered) */}
          {registeredUser?.id && (
            <div className="space-y-2">
              <p className="text-xs text-text-secondary">
                Commenting as <span className="font-medium text-text-primary">{registeredUser.name}</span>
              </p>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
                placeholder="Write a comment… (Enter to submit)"
                rows={3}
                disabled={submitting}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || submitting}
                className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Posting…" : "Post Comment"}
              </button>
            </div>
          )}

          {/* Registration gate */}
          {!registeredUser?.id && (
            <div ref={registrationRef} className="rounded-xl border border-border bg-surface-raised p-5 space-y-4 mt-2">
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">Join the conversation</h3>
                <p className="text-xs text-text-secondary">Enter your name and solve the captcha to enable commenting and reactions.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1">Your name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Ahmed"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1">
                    What is {captcha.a} + {captcha.b}?
                  </label>
                  <input
                    type="number"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                    placeholder="Your answer"
                    className="w-40 px-3 py-2 text-sm rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>

                {regError && <p className="text-xs text-danger">{regError}</p>}

                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={!userName.trim() || !captchaValid || registering}
                  className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {registering ? "Enabling…" : "Enable Comments"}
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <PageFooter />
    </div>
  );
}

function PageHeader() {
  return (
    <header className="sticky top-0 z-50 h-14 flex items-center justify-between px-4 md:px-6 bg-surface/80 backdrop-blur-xl border-b border-border">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
          <LightningIcon className="w-4.5 h-4.5 text-white" fill="currentColor" />
        </div>
        <span className="text-lg font-bold tracking-tight text-text-primary" style={{ fontFamily: "var(--font-heading)" }}>
          ChargeMap<span className="text-brand ml-0.5">PK</span>
        </span>
      </Link>
      <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
        &larr; Back to Map
      </Link>
    </header>
  );
}
