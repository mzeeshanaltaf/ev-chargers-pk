"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChargers } from "@/hooks/use-chargers";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-provider";
import { EditChargerModal } from "@/components/edit-charger/edit-charger-modal";
import { ToastContainer } from "@/components/ui/toast";
import type { Charger, ChargerInsertPayload } from "@/lib/types";

/**
 * Admin-only edit affordance for the (server-rendered) charger detail page.
 * Reuses the same EditChargerModal + useChargers().updateCharger flow as the
 * map app (see app-shell.tsx). Gated on auth — sign-in itself is admin-only.
 */
export function EditChargerControl({ charger }: { charger: Charger }) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();
  const { updateCharger } = useChargers();
  const { toasts, showToast, dismissToast } = useToast();
  const [editing, setEditing] = useState<Charger | null>(null);

  const handleUpdate = useCallback(
    async (id: string, payload: Omit<ChargerInsertPayload, "event_type">) => {
      await updateCharger(id, payload);
      setEditing(null);
      showToast("Charger updated successfully!");
      router.refresh();
    },
    [updateCharger, showToast, router]
  );

  if (!isHydrated || !isAuthenticated) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setEditing(charger)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-brand hover:bg-brand/10 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Edit
      </button>

      <EditChargerModal
        charger={editing}
        onClose={() => setEditing(null)}
        onSubmit={handleUpdate}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
