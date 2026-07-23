"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import editorTheme from "./theme";
import { editorNodes } from "./nodes";
import type { ContentRendererProps } from "./types";
import { cn } from "@/utils";

export default function ContentRenderer({
  value,
  className,
}: ContentRendererProps) {
  // Eger içerik bir dize (HTML veya düz metin) ise dogrudan render et
  if (typeof value === "string") {
    const isHtml = /<[a-z][\s\S]*>/i.test(value);
    if (isHtml) {
      return (
        <div
          className={cn(
            "ce-renderer prose prose-invert max-w-none text-zinc-300 text-[15px] leading-[1.8] focus:outline-none",
            "relative rounded-2xl bg-white/[0.01] border border-white/[0.04] p-6 sm:p-8 md:p-10",
            className
          )}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      );
    } else {
      return (
        <div
          className={cn(
            "ce-renderer whitespace-pre-wrap text-zinc-300 text-[15px] leading-[1.8] focus:outline-none",
            "relative rounded-2xl bg-white/[0.01] border border-white/[0.04] p-6 sm:p-8 md:p-10",
            className
          )}
        >
          {value}
        </div>
      );
    }
  }

  // geçersiz veya bos content varsa render etme
  if (!value) {
    return (
      <div className={cn("ce-renderer relative rounded-2xl bg-white/[0.01] border border-white/[0.04] p-6 sm:p-8 md:p-10", className)}>
        <p className="text-zinc-500 text-sm">Içerik henüz eklenmemis.</p>
      </div>
    );
  }

  // Obje tipindeki content'te root yoksa geçersiz kabul et
  if (typeof value === "object" && !("root" in value)) {
    return (
      <div className={cn("ce-renderer relative rounded-2xl bg-white/[0.01] border border-white/[0.04] p-6 sm:p-8 md:p-10", className)}>
        <p className="text-zinc-500 text-sm">Içerik henüz eklenmemis.</p>
      </div>
    );
  }

  const initialConfig = {
    namespace: "ContentRenderer",
    theme: editorTheme,
    nodes: editorNodes,
    editable: false,
    editorState: JSON.stringify(value),
    onError: (error: Error) => {
      console.error("[ContentRenderer]", error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className={cn(
          "ce-renderer",
          "relative rounded-2xl",
          "bg-white/[0.01] border border-white/[0.04]",
          "p-6 sm:p-8 md:p-10",
          className
        )}
      >
        {/* Subtle top accent */}
        <div
          className="absolute top-0 left-6 right-6 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.12), rgba(34,211,238,0.08), transparent)" }}
        />

        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className={cn("text-zinc-300 text-[15px] leading-[1.8] focus:outline-none", className)}
            />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </LexicalComposer>
  );
}
