"use client";

import React, { useEffect } from "react";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-150 pb-4 dark:border-zinc-800">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-350">{children}</div>

        {/* Footer */}
        {footer !== undefined ? (
          <div className="mt-6 flex justify-end gap-3 border-t border-zinc-150 pt-4 dark:border-zinc-800">
            {footer}
          </div>
        ) : (
          <div className="mt-6 flex justify-end gap-3 border-t border-zinc-150 pt-4 dark:border-zinc-800">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
