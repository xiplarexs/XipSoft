"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import editorTheme from "./theme";
import { editorNodes } from "./nodes";
import OnChangePlugin from "./plugins/OnChangePlugin";
import MarkdownShortcutPlugin from "./plugins/MarkdownShortcutPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import SlashCommandPlugin from "./plugins/SlashCommandPlugin";
import ImagePlugin from "./plugins/ImagePlugin";
import CodeBlockPlugin from "./plugins/CodeBlockPlugin";
import type { ContentEditorProps } from "./types";
import { cn } from "@/utils";

export default function ContentEditor({
  value,
  onChange,
  placeholder = "Start writing... (type / for commands)",
  editable = true,
  namespace = "ContentEditor",
  className,
}: ContentEditorProps) {
  const initialConfig = {
    namespace,
    theme: editorTheme,
    nodes: editorNodes,
    editable,
    editorState: value ? JSON.stringify(value) : undefined,
    onError: (error: Error) => {
      console.error("[ContentEditor]", error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={cn("relative", className)}>
        <div
          className={cn(
            "rounded-xl border border-white/[0.08] bg-surface",
            "focus-within:border-prism-violet/30 transition-colors"
          )}
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={cn(
                  "min-h-[200px] px-5 py-4 focus:outline-none",
                  "text-zinc-200 text-base leading-relaxed",
                  className
                )}
              />
            }
            placeholder={
              <div className="absolute top-4 left-5 text-zinc-600 pointer-events-none select-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <LinkPlugin />
        <OnChangePlugin onChange={onChange} />
        <MarkdownShortcutPlugin />
        <ToolbarPlugin />
        <SlashCommandPlugin />
        <ImagePlugin />
        <CodeBlockPlugin />
      </div>
    </LexicalComposer>
  );
}
