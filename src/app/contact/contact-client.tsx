"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { LightningIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageFooter } from "@/components/page-footer";

interface ContactErrors {
  name?: string;
  email?: string;
  description?: string;
  captcha?: string;
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

function generateChallenge() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, answer: a + b };
}

export function ContactClient() {
  const [formData, setFormData] = useState({ name: "", email: "", description: "" });
  const [captchaInput, setCaptchaInput] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [challenge] = useMemo(() => [generateChallenge()], []);
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
    if (!captchaInput.trim()) validationErrors.captcha = "Please answer the math question";
    else if (parseInt(captchaInput.trim(), 10) !== challenge.answer)
      validationErrors.captcha = "Incorrect answer, please try again";

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
        }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setIsSubmitted(true);
    } catch {
      setErrors({ _form: "Failed to send your message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
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

      <main className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-text-primary mb-2" style={{ fontFamily: "var(--font-heading)" }}>
          Contact Us
        </h1>
        <p className="text-text-secondary mb-8">
          Have a bug to report, a feature to request, or just want to say hi? We&apos;d love to hear from you.
        </p>

        {isSubmitted ? (
          <div className="rounded-xl border border-brand/30 bg-brand/5 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-brand/15 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              Message Sent!
            </h2>
            <p className="text-text-secondary mb-6">
              Thank you for reaching out. We&apos;ll get back to you as soon as possible.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-white font-medium text-sm hover:brightness-110 transition-all">
              Back to Map
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Name" value={formData.name} onChange={(e) => updateField("name", e.target.value)} error={errors.name} placeholder="Your name" maxLength={100} />
            <Input label="Email" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} error={errors.email} placeholder="you@example.com" />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">Message</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={5}
                maxLength={2000}
                className={`w-full px-3 py-2 rounded-lg bg-surface border border-border text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm resize-none transition-all ${errors.description ? "border-danger focus:ring-danger" : ""}`}
                placeholder="Tell us what's on your mind — report a bug, suggest a feature, or just say hi..."
              />
              <div className="flex justify-between">
                {errors.description ? <p className="text-xs text-danger">{errors.description}</p> : <span />}
                <span className="text-xs text-text-secondary tabular-nums">{formData.description.length}/2000</span>
              </div>
            </div>

            <div className="absolute opacity-0 -z-10 h-0 overflow-hidden" aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">
                What is {challenge.a} + {challenge.b}?
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={captchaInput}
                onChange={(e) => { setCaptchaInput(e.target.value); setErrors((prev) => { const next = { ...prev }; delete next.captcha; return next; }); }}
                className={`w-full px-3 py-2 rounded-lg bg-surface border border-border text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm transition-all ${errors.captcha ? "border-danger focus:ring-danger" : ""}`}
                placeholder="Your answer"
              />
              {errors.captcha && <p className="text-xs text-danger">{errors.captcha}</p>}
            </div>

            {errors._form && <p className="text-sm text-danger text-center">{errors._form}</p>}

            <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full">
              Send Message
            </Button>
          </form>
        )}
      </main>
      <PageFooter />
    </div>
  );
}
