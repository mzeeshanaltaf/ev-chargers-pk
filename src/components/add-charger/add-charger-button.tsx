"use client";

import { motion } from "framer-motion";
import { PlusIcon } from "@/components/icons";

interface AddChargerButtonProps {
  onClick: () => void;
}

export function AddChargerButton({ onClick }: AddChargerButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[500] w-14 h-14 rounded-2xl bg-brand text-white shadow-lg shadow-brand/30 flex items-center justify-center hover:brightness-110 transition-all"
      aria-label="Add new charger"
    >
      <PlusIcon className="w-6 h-6" />
    </motion.button>
  );
}
