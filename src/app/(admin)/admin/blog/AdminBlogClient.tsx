"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText, Plus, Eye, EyeOff, RefreshCw, Archive,
} from "lucide-react";
import {
  getBlogPosts,
  deleteBlogPost,
  restoreBlogPostAction,
  hardDeleteBlogPostAction,
  getDeletedBlogPostsAction,
  createBlogPost,
  updateBlogPost,
} from "@/app/_actions/admin-blog-actions";
import {
  Post, DeletedPost, Tab, EMPTY_FORM,
  BlogForm, BlogList,
} from "./components";

export default function AdminBlogClient() {
  const [tab, setTab] = useState<Tab>("published");
  const [posts, setPosts] = useState<Post[]>([]);
  const [deleted, setDeleted] = useState<DeletedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [authorId, setAuthorId] = useState<number>(1);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const [active, trash] = await Promise.all([
      getBlogPosts(200, 0),
      getDeletedBlogPostsAction(),
    ]);
    if (active.success) setPosts((active.posts ?? []) as Post[]);
    if (trash.success) setDeleted((trash.posts ?? []) as DeletedPost[]);
    setLoading(false);
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const filtered = posts.filter((p) => {
    const matchesTab = tab === "published" ? p.status === "published" : p.status === "draft";
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Bu yazıyı çöp kutusuna tasımak istediGinize emin misiniz?")) return;
    await deleteBlogPost(id);
    await loadPosts();
  };

  const handleRestore = async (id: number) => {
    await restoreBlogPostAction(id);
    await loadPosts();
  };

  const handleHardDelete = async (id: number) => {
    if (!confirm("Bu yazıyı kalıcı olarak silmek istediGinize emin misiniz? Bu islem geri alınamaz.")) return;
    await hardDeleteBlogPostAction(id);
    await loadPosts();
  };

  const handleEdit = (post: Post) => {
    setEditId(post.id);
    setForm({
      title: post.title,
      description: post.description ?? "",
      content: typeof (post as any).content === "string" ? (post as any).content : JSON.stringify((post as any).content ?? ""),
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
      cover_image_url: post.cover_image_url ?? "",
      status: post.status,
      slug: post.slug,
    });
    setTab("new");
    setFormError(null);
    setFormSuccess(null);
  };

  const handleNewPost = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setTab("new");
    setFormError(null);
    setFormSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    const tagsArray = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    let contentValue: any = form.content;
    try { contentValue = JSON.parse(form.content); } catch { /* plain text fine */ }

    try {
      if (editId !== null) {
        const res = await updateBlogPost(editId, {
          title: form.title,
          description: form.description,
          content: contentValue,
          status: form.status,
          tags: tagsArray,
          cover_image_url: form.cover_image_url || undefined,
          slug: form.slug || undefined,
        });
        if (!res.success) throw new Error(res.error ?? "Güncelleme basarısız");
        setFormSuccess("Yazı basarıyla güncellendi.");
      } else {
        const res = await createBlogPost({
          title: form.title,
          description: form.description,
          content: contentValue,
          author_id: authorId,
          status: form.status,
          tags: tagsArray,
          cover_image_url: form.cover_image_url || undefined,
          slug: form.slug || form.title,
        });
        if (!res.success) throw new Error(res.error ?? "Olusturma basarısız");
        setFormSuccess("Yazı basarıyla olusturuldu.");
        setForm(EMPTY_FORM);
        setEditId(null);
      }
      await loadPosts();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const TABS = [
    { key: "published", label: `Yayında (${posts.filter((p) => p.status === "published").length})`, icon: <Eye className="w-4 h-4" /> },
    { key: "draft",     label: `Taslak (${posts.filter((p) => p.status === "draft").length})`,      icon: <EyeOff className="w-4 h-4" /> },
    { key: "trash",     label: `Çöp Kutusu (${deleted.length})`,                                    icon: <Archive className="w-4 h-4" /> },
    { key: "new",       label: editId ? "Düzenle" : "Yeni Yazı",                                    icon: <Plus className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="text-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8" style={{ color: "#0A2647" }} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Blog Yönetimi</h1>
              <p className="text-sm text-gray-500">Yazıları olustur, düzenle ve yönet</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadPosts}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Yenile
            </button>
            <button
              onClick={handleNewPost}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
              style={{ background: "#0A2647" }}
            >
              <Plus className="w-4 h-4" /> Yeni Yazı
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "border-[#0A2647] text-[#0A2647]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Form */}
        {tab === "new" && (
          <BlogForm
            form={form}
            setForm={setForm}
            editId={editId}
            setEditId={setEditId}
            setTab={setTab}
            submitting={submitting}
            formError={formError}
            formSuccess={formSuccess}
            handleSubmit={handleSubmit}
          />
        )}

        {/* List */}
        <BlogList
          posts={posts}
          deleted={deleted}
          filtered={filtered}
          loading={loading}
          search={search}
          setSearch={setSearch}
          tab={tab}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleRestore={handleRestore}
          handleHardDelete={handleHardDelete}
        />
      </div>
    </div>
  );
}
