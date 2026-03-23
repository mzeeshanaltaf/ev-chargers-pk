"use client";

import { Modal } from "@/components/ui/modal";
import { ChargerForm } from "@/components/add-charger/charger-form";
import type { Charger, ChargerInsertPayload } from "@/lib/types";

interface EditChargerModalProps {
  charger: Charger | null;
  onClose: () => void;
  onSubmit: (id: string, payload: Omit<ChargerInsertPayload, "event_type">) => Promise<void>;
}

export function EditChargerModal({ charger, onClose, onSubmit }: EditChargerModalProps) {
  if (!charger) return null;

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Charger">
      <ChargerForm
        initialData={charger}
        onSubmit={(payload) => onSubmit(charger.id, payload)}
        onCancel={onClose}
      />
    </Modal>
  );
}
