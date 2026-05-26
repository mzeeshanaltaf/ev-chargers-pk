"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { InfoIcon } from "@/components/icons";

export const TENTATIVE_PRICE_MESSAGE =
  "The price shown is tentative. Please call the contact person to confirm the exact amount.";

interface InfoTipProps {
  children?: ReactNode;
  className?: string;
}

const TOOLTIP_WIDTH = 224;
const VIEWPORT_MARGIN = 8;

export function InfoTip({ children = TENTATIVE_PRICE_MESSAGE, className = "" }: InfoTipProps) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; placement: "top" | "bottom" } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const visible = hovered || pinned;

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!visible) {
      setPos(null);
      return;
    }
    const update = () => {
      const btn = buttonRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const tipHeight = tooltipRef.current?.offsetHeight ?? 48;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let left = rect.right - TOOLTIP_WIDTH;
      if (left < VIEWPORT_MARGIN) left = VIEWPORT_MARGIN;
      if (left + TOOLTIP_WIDTH > vw - VIEWPORT_MARGIN) left = vw - VIEWPORT_MARGIN - TOOLTIP_WIDTH;

      const spaceAbove = rect.top;
      const placement: "top" | "bottom" =
        spaceAbove >= tipHeight + 8 || spaceAbove >= vh - rect.bottom ? "top" : "bottom";
      const top = placement === "top" ? rect.top - tipHeight - 6 : rect.bottom + 6;

      setPos({ top, left, placement });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [visible]);

  return (
    <span
      className={`relative inline-flex items-center align-middle leading-none ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label="More info"
        aria-expanded={visible}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setPinned((v) => !v);
        }}
        onBlur={() => setPinned(false)}
        className="inline-flex items-center justify-center text-text-secondary/70 hover:text-brand focus-visible:text-brand focus-visible:outline-none transition-colors"
      >
        <InfoIcon className="w-3.5 h-3.5" />
      </button>
      {mounted && visible && pos &&
        createPortal(
          <span
            ref={tooltipRef}
            role="tooltip"
            style={{ position: "fixed", top: pos.top, left: pos.left, width: TOOLTIP_WIDTH }}
            className="rounded-md border border-border bg-surface-raised px-2.5 py-1.5 text-xs leading-snug text-text-primary shadow-lg z-1100 normal-case font-normal pointer-events-none"
          >
            {children}
          </span>,
          document.body
        )}
    </span>
  );
}
