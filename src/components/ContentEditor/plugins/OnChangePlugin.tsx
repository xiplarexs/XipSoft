"use client";

import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { SerializedEditorState } from "lexical";

interface OnChangePluginProps {
  onChange?: (state: SerializedEditorState) => void;
  debounceMs?: number;
}

export default function OnChangePlugin({
  onChange,
  debounceMs = 300,
}: OnChangePluginProps) {
  const [editor] = useLexicalComposerContext();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!onChange) return;

    return editor.registerUpdateListener(({ editorState }) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onChange(editorState.toJSON());
      }, debounceMs);
    });
  }, [editor, onChange, debounceMs]);

  return null;
}
