"use client";

import { useState, useEffect, useRef } from "react";
import type { Comment } from "@/lib/types";

interface RegisteredUser {
  id: number;
  name: string;
}

interface CommentsClientProps {
  chargerId: string;
}

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

export function CommentsClient({ chargerId }: CommentsClientProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

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
        if (parsed?.id && parsed?.name) setRegisteredUser(parsed);
        else localStorage.removeItem("chargemappk_user");
      }
    } catch {
      localStorage.removeItem("chargemappk_user");
    }
  }, []);

  useEffect(() => {
    fetch(`/api/comments?charger_id=${chargerId}`)
      .then((r) => r.json())
      .then((data: Comment[]) => {
        const valid = Array.isArray(data) ? data.filter((c) => c.id != null && c.content) : [];
        setComments(valid);
        setLoadingComments(false);
      })
      .catch(() => setLoadingComments(false));
  }, [chargerId]);

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
      if (!user?.id) { setRegError("Registration failed. Please try again."); return; }
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
          charger_id: chargerId,
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
    const newReaction: "like" | "dislike" | null = current === reactionType ? null : reactionType;

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

  return (
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

      {registeredUser?.id && (
        <div className="space-y-2">
          <p className="text-xs text-text-secondary">
            Commenting as <span className="font-medium text-text-primary">{registeredUser.name}</span>
          </p>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmitComment(); }
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
  );
}
