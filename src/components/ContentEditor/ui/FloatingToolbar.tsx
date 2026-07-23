"use client";

import { createPortal } from "react-dom";
import {
  useFloatingToolbar,
  type ToolbarState,
} from "../hooks/useFloatingToolbar";
import { cn } from "@/utils";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";

interface FormatButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}

function FormatButton({
  isActive,
  onClick,
  label,
  children,
}: FormatButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      onMouseDown={(e) => e.preventDefault()}
      className={cn(
        "px-2 py-1 rounded text-sm -mono transition-colors",
        isActive
          ? "bg-prism-violet/30 text-prism-violet"
          : "text-zinc-400 hover:text-white hover:bg-white/10"
      )}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

export default function FloatingToolbar() {
  const { isVisible, floatingStyles, floatingRef, toolbarState, formatText, editor } =
    useFloatingToolbar();

  if (!isVisible) return null;

  const toolbarEl = (
    <div
      ref={floatingRef}
      className={cn(
        "z-50 flex items-center gap-0.5 px-1.5 py-1 rounded-lg",
        "bg-obsidian border border-white/10 shadow-xl shadow-black/40"
      )}
      style={floatingStyles}
      onMouseDown={(e) => e.preventDefault()}
    >
      <FormatButton
        isActive={toolbarState.isBold}
        onClick={() => formatText("bold")}
        label="Bold"
      >
        <strong>B</strong>
      </FormatButton>
      <FormatButton
        isActive={toolbarState.isItalic}
        onClick={() => formatText("italic")}
        label="Italic"
      >
        <em>I</em>
      </FormatButton>
      <FormatButton
        isActive={toolbarState.isUnderline}
        onClick={() => formatText("underline")}
        label="Underline"
      >
        <span className="underline">U</span>
      </FormatButton>
      <FormatButton
        isActive={toolbarState.isStrikethrough}
        onClick={() => formatText("strikethrough")}
        label="Strikethrough"
      >
        <span className="line-through">S</span>
      </FormatButton>
      <FormatButton
        isActive={toolbarState.isCode}
        onClick={() => formatText("code")}
        label="Inline Code"
      >
        {"</>"}
      </FormatButton>

      <div className="w-px h-5 bg-white/10 mx-1" />

      <FormatButton
        isActive={toolbarState.isLink}
        onClick={() => {
          if (toolbarState.isLink) {
            editor.dispatchCommand(TOggLE_LINK_COMMAND, null);
          } else {
            const url = prompt("Enter URL:");
            if (url) {
              editor.dispatchCommand(TOggLE_LINK_COMMAND, url);
            }
          }
        }}
        label="Link"
      >
        <span className="text-xs">Link</span>
      </FormatButton>
    </div>
  );

  return createPortal(toolbarEl, document.body);
}
