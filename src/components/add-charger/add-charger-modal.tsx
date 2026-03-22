"use client";

import { Modal } from "@/components/ui/modal";
import { ChargerForm } from "@/components/add-charger/charger-form";
import type { ChargerInsertPayload } from "@/lib/types";

interface AddChargerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: Omit<ChargerInsertPayload, "event_type">) => Promise<void>;
  initialLat?: string;
  initialLng?: string;
  initialAddress?: string;
}

export function AddChargerModal({ isOpen, onClose, onSubmit, initialLat, initialLng, initialAddress }: AddChargerModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Charger">
      <ChargerForm
        initialLat={initialLat}
        initialLng={initialLng}
        initialAddress={initialAddress}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
