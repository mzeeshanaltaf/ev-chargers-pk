"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChargers } from "@/hooks/use-chargers";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-provider";
import { EditChargerModal } from "@/components/edit-charger/edit-charger-modal";
import { ToastContainer } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { citySlug } from "@/lib/slug";
import type { Charger, ChargerInsertPayload } from "@/lib/types";

/**
 * Admin-only edit/delete affordance for the (server-rendered) charger detail
 * page. Reuses the same EditChargerModal + useChargers() flow as the map app
 * (see app-shell.tsx). Gated on auth — sign-in itself is admin-only.
 */
export function EditChargerControl({ charger }: { charger: Charger }) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();
  const { updateCharger, deleteCharger } = useChargers();
  const { toasts, showToast, dismissToast } = useToast();
  const [editing, setEditing] = useState<Charger | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdate = useCallback(
    async (id: string, payload: Omit<ChargerInsertPayload, "event_type">) => {
      await updateCharger(id, payload);
      setEditing(null);
      showToast("Charger updated successfully!");
      router.refresh();
    },
    [updateCharger, showToast, router]
  );

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    try {
      await deleteCharger(charger.id);
      // The detail page no longer exists; navigate to the city index.
      router.push(`/chargers/${citySlug(charger)}`);
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
      showToast("Failed to delete charger.");
    }
  }, [deleteCharger, charger, router, showToast]);

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

      <button
        type="button"
        onClick={() => setConfirmDelete(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
        Delete
      </button>

      <EditChargerModal
        charger={editing}
        onClose={() => setEditing(null)}
        onSubmit={handleUpdate}
      />

      <Modal
        isOpen={confirmDelete}
        onClose={() => !deleting && setConfirmDelete(false)}
        title="Delete charger?"
      >
        <p className="text-sm text-text-secondary">
          This permanently removes this charger from the directory. This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="secondary"
            onClick={() => setConfirmDelete(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
