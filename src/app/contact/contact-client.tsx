"use client";

import { useState } from "react";
import Link from "next/link";

interface ContactErrors {
  name?: string;
  email?: string;
  description?: string;
  _form?: string;
}

function validateContact(data: { name: string; email: string; description: string }): ContactErrors {
  const errors: ContactErrors = {};
  if (!data.name.trim()) errors.name = "Name is required";
  else if (data.name.trim().length < 2) errors.name = "Name must be at least 2 characters";
  else if (data.name.trim().length > 100) errors.name = "Name must be under 100 characters";

  if (!data.email.trim()) errors.email = "Email is required";
  else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email.trim()))
    errors.email = "Please enter a valid email address";

  if (!data.description.trim()) errors.description = "Message is required";
  else if (data.description.trim().length < 10) errors.description = "Message must be at least 10 characters";
  else if (data.description.trim().length > 2000) errors.description = "Message must be under 2000 characters";

  return errors;
}

// Shared field styling on the landing palette. Error states use the (dark-resolved)
// app danger token since the landing palette has no dedicated danger color.
const fieldClass =
  "w-full px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-(--ld-green-bright)";
function fieldStyle(hasError?: boolean): React.CSSProperties {
  return {
    background: "var(--ld-surface)",
    border: `1px solid ${hasError ? "var(--theme-danger)" : "var(--ld-border)"}`,
    color: "var(--ld-text)",
  };
}
const labelClass = "text-sm font-medium";
const labelStyle = { color: "var(--ld-text-muted)" } as const;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className={labelClass} style={labelStyle}>{children}</label>;
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="text-xs" style={{ color: "var(--theme-danger)" }}>{children}</p>;
}

export function ContactClient() {
  const [formData, setFormData] = useState({ name: "", email: "", description: "" });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field as keyof ContactErrors];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    const validationErrors = validateContact(formData);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          description: formData.description.trim(),
          website: honeypot,
        }),
      });
      if (res.status === 429) {
        setErrors({ _form: "You've sent a few messages already — please try again later." });
        return;
      }
      if (!res.ok) throw new Error("Failed to send");
      setIsSubmitted(true);
    } catch {
      setErrors({ _form: "Failed to send your message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="ld-display text-[clamp(2.2rem,5vw,3.2rem)] font-bold mb-2" style={{ color: "var(--ld-text)" }}>
        Contact Us
      </h1>
      <p className="mb-8 text-[16px]" style={{ color: "var(--ld-text-muted)" }}>
        Found a bug, want to add a new charger or update an existing one&apos;s details, or just
        want to say hi? We&apos;d love to hear from you.
      </p>

      {isSubmitted ? (
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "color-mix(in oklch, var(--ld-green) 8%, transparent)", border: "1px solid var(--ld-border-strong)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "color-mix(in oklch, var(--ld-green) 16%, transparent)", color: "var(--ld-green-bright)" }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="ld-display text-xl font-semibold mb-2" style={{ color: "var(--ld-text)" }}>
            Message Sent!
          </h2>
          <p className="mb-6" style={{ color: "var(--ld-text-muted)" }}>
            Thank you for reaching out. We&apos;ll get back to you as soon as possible.
          </p>
          <Link
            href="/map"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-(--ld-green-bright)"
            style={{ background: "var(--ld-green)", color: "var(--ld-on-green)", boxShadow: "0 0 24px var(--ld-glow)" }}
          >
            Back to Map
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Name</FieldLabel>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              maxLength={100}
              className={fieldClass}
              style={fieldStyle(!!errors.name)}
              placeholder="Your name"
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel>Email</FieldLabel>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={fieldClass}
              style={fieldStyle(!!errors.email)}
              placeholder="you@example.com"
            />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel>Message</FieldLabel>
            <textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={5}
              maxLength={2000}
              className={`${fieldClass} resize-none`}
              style={fieldStyle(!!errors.description)}
              placeholder="Tell us what's on your mind — add a new charger, correct a charger's details, report a bug, or just say hi..."
            />
            <div className="flex justify-between">
              {errors.description ? <ErrorText>{errors.description}</ErrorText> : <span />}
              <span className="text-xs tabular-nums" style={{ color: "var(--ld-text-dim)" }}>{formData.description.length}/2000</span>
            </div>
          </div>

          <div className="absolute opacity-0 -z-10 h-0 overflow-hidden" aria-hidden="true">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>

          {errors._form && <p className="text-sm text-center" style={{ color: "var(--theme-danger)" }}>{errors._form}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-(--ld-green-bright) disabled:opacity-60 disabled:hover:scale-100"
            style={{ background: "var(--ld-green)", color: "var(--ld-on-green)", boxShadow: "0 0 24px var(--ld-glow)" }}
          >
            {isSubmitting ? "Sending…" : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
