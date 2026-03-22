"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    const result = await login(email.trim(), password);

    if (result.success) {
      setEmail("");
      setPassword("");
      setError("");
      onClose();
    } else {
      setError(result.message || "Authentication failed");
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sign In">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <p className="text-sm text-text-secondary">
          Sign in to add new EV charging stations to the map.
        </p>

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          autoFocus
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && (
          <div className="px-3 py-2 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-1"
        >
          Sign In
        </Button>
      </form>
    </Modal>
  );
}
