"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/utils";
import { motion } from "motion/react";
import { PenLine, Save, Tag, X, Image as ImageIcon, CheckCircle } from "lucide-react";
import Authguard from "@/components/Auth/AuthGuard";
import UnauthorizedMessage from "@/components/Auth/UnauthorizedMessage";
import { ContentEditor } from "@/components/ContentEditor";
import type { SerializedEditorState } from "@/components/ContentEditor";
import { useBlogEditor } from "@/hooks/blog/useBlogEditor";
import { useAuth } from "@/hooks/useAuth";
import { publishBlogPostAction, unpublishBlogPostAction } from "@/app/_actions/blog-actions";
import { useTranslations } from "next-intl";
import { useLanguage } from "@/hooks/useLanguage";

const INPUT_CLASS = cn(
  "w-full px-4 py-3 rounded-xl text-sm",
  "bg-white/[0.04] border border-white/[0.08]",
  "text-zinc-200 placeholder:text-zinc-600",
  "focus:outline-none focus:border-prism-violet/40 focus:ring-1 focus:ring-prism-violet/20",
  "transition-all duration-200"
);

function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder = "Add tags (press Enter)",
}: {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = value.trim().toLowerCase();
      if (tag && !tags.includes(tag)) {
        onAdd(tag);
      }
      setValue("");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs -mono bg-prism-violet/10 text-prism-violet border border-prism-violet/20"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="hover:text-prism-rose transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={INPUT_CLASS}
      />
    </div>
  );
}

function BlogEditForm({ postId }: { postId: string }) {
  const router = useRouter();
  const t = useTranslations("blog");
  const { user, isAdmin } = useAuth();
  const { isXipSoft } = useLanguage();
  const mm = "";
  const {
    title,
    setTitle,
    description,
    setDescription,
    tags,
    setTags,
    coverImageURL,
    setCoverImageURL,
    content,
    setContent,
    saving,
    loading,
    error,
    post,
    save,
  } = useBlogEditor({ postId });

  const [editorMode, setEditorMode] = useState<"rich" | "html">("rich");
  const [rawHtml, setRawHtml] = useState("");

  // Mevcut içerik yüklendiginde formatı tespit et ve ata
  useEffect(() => {
    if (content) {
      if (typeof content === "string") {
        setEditorMode("html");
        setRawHtml(content);
      } else {
        setEditorMode("rich");
      }
    }
  }, [content]);

  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const handleContentChange = useCallback(
    (state: SerializedEditorState) => {
      setContent(state);
    },
    [setContent]
  );

  const handleSave = async () => {
    await save();
    router.push("/blog/my-posts");
  };

  const handlePublishToggle = async () => {
    if (!post || !user) return;
    setPublishing(true);
    setPublishError(null);
    try {
      if (post.status === "published") {
        await unpublishBlogPostAction(postId);
      } else {
        await publishBlogPostAction(postId);
      }
      router.push("/blog/my-posts");
    } catch (err) {
      if (err instanceof Error) {
        setPublishError(err.message);
      }
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-prism-violet/30 border-t-prism-violet rounded-full animate-spin" />
      </div>
    );
  }

  // Check authorization: author or admin
  if (post && user && post.authorId !== user.id && !isAdmin) {
    return <UnauthorizedMessage />;
  }

  return (
    <div className="min-h-screen bg-obsidian pt-24 pb-20 px-5 relative">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.05] blur-[120px]"
          style={{
            background:
              "radial-gradient(ellipse, #a78bfa 0%, #22d3ee 40%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-prism-violet/20 to-prism-cyan/20 border border-white/[0.08]">
                <PenLine className="w-4.5 h-4.5 text-prism-cyan" />
              </div>
              <div>
                <h1 className={cn("text-xl font-semibold -display text-white tracking-tight", mm)}>
                  {t("editBlog")}
                </h1>
                <p className={cn("text-[11px] text-zinc-600 -mono", mm)}>
                  {post?.status === "published" ? t("published") : t("draft")} · {t("autoSaveNote")}
                </p>
              </div>
            </div>

            {post?.status === "published" && (
              <span className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] -mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", mm)}>
                <CheckCircle className="w-3 h-3" />
                {t("published")}
              </span>
            )}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-5"
        >
          <div>
            <label className={cn("block text-xs -mono text-zinc-500 uppercase tracking-wider mb-2", mm)}>
              {t("formTitle")}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("formTitlePlaceholder")}
              className={cn(INPUT_CLASS, "text-lg -display")}
            />
          </div>

          <div>
            <label className={cn("block text-xs -mono text-zinc-500 uppercase tracking-wider mb-2", mm)}>
              {t("formDescription")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("formDescriptionPlaceholder")}
              rows={2}
              className={cn(INPUT_CLASS, "resize-none")}
            />
          </div>

          <div>
            <label className={cn("block text-xs -mono text-zinc-500 uppercase tracking-wider mb-2", mm)}>
              <ImageIcon className="w-3 h-3 inline mr-1" />
              {t("formCoverImage")}
            </label>
            <input
              type="url"
              value={coverImageURL ?? ""}
              onChange={(e) => setCoverImageURL(e.target.value || null)}
              placeholder={t("formCoverImagePlaceholder")}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={cn("block text-xs -mono text-zinc-500 uppercase tracking-wider mb-2", mm)}>
              <Tag className="w-3 h-3 inline mr-1" />
              {t("formTags")}
            </label>
            <TagInput
              tags={tags}
              onAdd={(tag) => setTags([...tags, tag])}
              onRemove={(tag) => setTags(tags.filter((t) => t !== tag))}
              placeholder={t("formTagsPlaceholder")}
            />
          </div>

          {/* Content Editor */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={cn("block text-xs -mono text-zinc-500 uppercase tracking-wider", mm)}>
                {t("formContent")}
              </label>
              <div className="flex p-0.5 bg-white/[0.02] border border-white/[0.06] rounded-xl backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setEditorMode("rich")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                    editorMode === "rich"
                      ? "bg-prism-violet text-white shadow-md shadow-prism-violet/20"
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  Zengin Metin (Rich Text)
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode("html")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                    editorMode === "html"
                      ? "bg-prism-violet text-white shadow-md shadow-prism-violet/20"
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  HTML Kodu
                </button>
              </div>
            </div>

            {editorMode === "rich" ? (
              <ContentEditor
                value={typeof content === "string" ? null : content}
                onChange={handleContentChange}
                placeholder={t("formContentPlaceholder")}
              />
            ) : (
              <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.01] focus-within:border-prism-violet/30 transition-colors">
                <textarea
                  value={rawHtml}
                  onChange={(e) => {
                    setRawHtml(e.target.value);
                    setContent(e.target.value as any);
                  }}
                  placeholder="<p>Içeriginizi buraya ham HTML olarak yazabilirsiniz...</p>"
                  rows={14}
                  className="w-full bg-transparent px-5 py-4 focus:outline-none text-zinc-200 text-sm leading-relaxed font-mono resize-y min-h-[300px]"
                />
              </div>
            )}
          </div>

          {error && <p className="text-sm text-prism-rose">{error}</p>}
          {publishError && <p className="text-sm text-prism-rose">{publishError}</p>}

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium",
                "bg-prism-violet text-white",
                "hover:bg-prism-violet/90 transition-colors",
                "disabled:opacity-40 disabled:cursor-not-allowed"
              )}
            >
              <Save className="w-4 h-4" />
              <span className={mm}>{saving ? t("saving") : t("saveDraft")}</span>
            </button>

            <button
              type="button"
              onClick={handlePublishToggle}
              disabled={publishing}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-colors",
                post?.status === "published"
                  ? "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                  : "bg-emerald-600 text-white hover:bg-emerald-500",
                "disabled:opacity-40 disabled:cursor-not-allowed"
              )}
            >
              <CheckCircle className="w-4 h-4" />
              <span className={mm}>
                {publishing
                  ? "..."
                  : post?.status === "published"
                    ? t("unpublish")
                    : t("publish")}
              </span>
            </button>

            {!isAdmin && post?.status !== "published" && (
              <span className={cn("text-[11px] text-zinc-600 -mono", mm)}>
                {t("maxPostsPerDay")}
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function BlogEditInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-zinc-500">No post ID specified.</p>
      </div>
    );
  }

  return (
    <Authguard>
      <BlogEditForm postId={id} />
    </Authguard>
  );
}

export default function BlogEditClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-prism-violet/30 border-t-prism-violet rounded-full animate-spin" />
        </div>
      }
    >
      <BlogEditInner />
    </Suspense>
  );
}
