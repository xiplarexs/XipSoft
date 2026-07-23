"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils";
import type { SlashCommandItem } from "../hooks/useSlashCommand";

interface SlashCommandMenuProps {
  isOpen: boolean;
  position: { top: number; left: number };
  selectedIndex: number;
  filteredCommands: SlashCommandItem[];
  onSelect: (item: SlashCommandItem) => void;
}

export default function SlashCommandMenu({
  isOpen,
  position,
  selectedIndex,
  filteredCommands,
  onSelect,
}: SlashCommandMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Scroll selected item into view
  useEffect(() => {
    if (!menuRef.current) return;
    const selected = menuRef.current.children[selectedIndex] as HTMLElement;
    if (selected) {
      selected.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen || filteredCommands.length === 0) return null;

  const menuEl = (
    <div
      ref={menuRef}
      className={cn(
        "fixed z-50 w-64 max-h-72 overflow-y-auto rounded-lg",
        "bg-obsidian border border-white/10 shadow-xl shadow-black/40",
        "py-1"
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {filteredCommands.map((item, index) => (
        <button
          key={item.title}
          type="button"
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 text-left transition-colors",
            index === selectedIndex
              ? "bg-prism-violet/20 text-white"
              : "text-zinc-300 hover:bg-white/5"
          )}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(item);
          }}
          onMouseEnter={() => {
            // Let hover highlight work naturally via CSS
          }}
        >
          <span
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded",
              "bg-surface-light text-sm -mono text-prism-cyan"
            )}
          >
            {item.icon}
          </span>
          <div>
            <div className="text-sm font-medium">{item.title}</div>
            <div className="text-xs text-zinc-500">{item.description}</div>
          </div>
        </button>
      ))}
    </div>
  );

  return createPortal(menuEl, document.body);
}
