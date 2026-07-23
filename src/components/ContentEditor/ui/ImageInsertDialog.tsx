"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils";

interface ImageInsertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (src: string, altText: string) => void;
}

const INPUT_CLASS = cn(
  "w-full bg-obsidian border border-white/[0.08] rounded-lg px-4 py-2.5",
  "text-zinc-200 placeholder:text-zinc-600 -body text-sm",
  "focus:outline-none focus:border-prism-violet/50 focus:ring-1 focus:ring-prism-violet/20",
  "transition-all duration-200"
);

export default function ImageInsertDialog({
  isOpen,
  onClose,
  onInsert,
}: ImageInsertDialogProps) {
  const [src, setSrc] = useState("");
  const [altText, setAltText] = useState("");

  const handleInsert = useCallback(() => {
    if (src.trim()) {
      onInsert(src.trim(), altText.trim() || "Image");
      setSrc("");
      setAltText("");
      onClose();
    }
  }, [src, altText, onInsert, onClose]);

  if (!isOpen) return null;

  const dialogEl = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/60" />
      <div
        className={cn(
          "relative z-10 w-full max-w-md p-6 rounded-xl",
          "bg-surface border border-white/10 shadow-2xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          Insert Image
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={INPUT_CLASS}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleInsert();
                if (e.key === "Escape") onClose();
              }}
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Alt Text
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image"
              className={INPUT_CLASS}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleInsert();
                if (e.key === "Escape") onClose();
              }}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "px-4 py-2 rounded-lg text-sm",
              "text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            )}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInsert}
            disabled={!src.trim()}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium",
              "bg-prism-violet/20 text-prism-violet",
              "hover:bg-prism-violet/30 transition-colors",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialogEl, document.body);
}
