"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShoppingBag, RefreshCw, Search, ChevronDown, CheckCircle2,
  Clock, XCircle, Loader2, CreditCard, User, Mail,
} from "lucide-react";
import { getOrdersAction, updateOrderStatusAction, type Order } from "@/app/_actions/admin-orders-actions";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:    { label: "Bekliyor",    color: "bg-amber-50 text-amber-700 border-amber-200",   icon: <Clock className="w-3 h-3" /> },
  processing: { label: "Isleniyor",  color: "bg-blue-50 text-blue-700 border-blue-200",      icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  completed:  { label: "Tamamlandı", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="w-3 h-3" /> },
  cancelled:  { label: "Iptal",      color: "bg-red-50 text-red-700 border-red-200",          icon: <XCircle className="w-3 h-3" /> },
  refunded:   { label: "Iade",       color: "bg-gray-50 text-gray-600 border-gray-200",       icon: <XCircle className="w-3 h-3" /> },
};

const ALL_STATUSES = ["pending", "processing", "completed", "cancelled", "refunded"];

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: "bg-gray-100 text-gray-600 border-gray-200", icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(amount ?? 0);
}

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getOrdersAction();
    if (res.success) setOrders(res.data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    const res = await updateOrderStatusAction(orderId, newStatus);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selected?.id === orderId) setSelected((s) => s ? { ...s, status: newStatus } : s);
    } else {
      alert(res.error ?? "Durum güncellenemedi");
    }
    setUpdating(null);
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      !search ||
      o.order_number?.toLowerCase().includes(term) ||
      o.customer_name?.toLowerCase().includes(term) ||
      o.customer_email?.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  // Stats
  const stats = {
    total:     orders.length,
    pending:   orders.filter((o) => o.status === "pending").length,
    completed: orders.filter((o) => o.status === "completed").length,
    revenue:   orders.filter((o) => o.status === "completed").reduce((s, o) => s + (o.total_amount ?? 0), 0),
  };

  return (
    <div className="text-gray-900">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8" style={{ color: "#0A2647" }} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Siparisler</h1>
              <p className="text-sm text-gray-500">Müsteri siparislerini görüntüle ve yönet</p>
            </div>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Yenile
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Toplam Siparis",  value: stats.total,                  color: "text-gray-900" },
            { label: "Bekleyen",        value: stats.pending,                color: "text-amber-600" },
            { label: "Tamamlanan",      value: stats.completed,              color: "text-emerald-600" },
            { label: "Gelir (TL)",      value: formatAmount(stats.revenue),  color: "text-[#0A2647]" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Siparis no, müsteri adı veya e-posta ara..."
              className="w-full pl-9 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2647]/30"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-lg border border-gray-300 pl-3 pr-8 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2647]/30"
            >
              <option value="all">Tüm Durumlar</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_CONFIG[s]?.label ?? s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-gray-400 text-sm">Yükleniyor...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Siparis No</th>
                    <th className="px-4 py-3">Müsteri</th>
                    <th className="px-4 py-3">Tutar</th>
                    <th className="px-4 py-3">Ödeme</th>
                    <th className="px-4 py-3">Durum</th>
                    <th className="px-4 py-3">Tarih</th>
                    <th className="px-4 py-3 text-right">Güncelle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                        Siparis bulunamadı
                      </td>
                    </tr>
                  )}
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelected(order)}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900">
                        #{order.order_number ?? order.id?.toString().slice(0, 8)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-900 font-medium text-xs">{order.customer_name ?? "—"}</p>
                        <p className="text-gray-400 text-[10px]">{order.customer_email ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {formatAmount(order.total_amount)}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {order.payment_provider ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            disabled={updating === order.id}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="appearance-none rounded-lg border border-gray-300 pl-2 pr-7 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2647]/30 disabled:opacity-50"
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>{STATUS_CONFIG[s]?.label ?? s}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2">{filtered.length} siparis gösteriliyor</p>

        {/* Detail Modal */}
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Siparis Detayı</h2>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <ShoppingBag className="w-4 h-4 text-gray-400" />
                  <span className="font-mono font-medium">#{selected.order_number ?? selected.id}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{selected.customer_name ?? "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="break-all">{selected.customer_email ?? "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span>{formatAmount(selected.total_amount)} · {selected.payment_provider ?? "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Durum:</span>
                  <StatusBadge status={selected.status} />
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <span>Olusturuldu: {new Date(selected.created_at).toLocaleString("tr-TR")}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-medium text-gray-600 mb-1">Durum Güncelle</label>
                <div className="flex gap-2">
                  <select
                    value={selected.status}
                    disabled={updating === selected.id}
                    onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2647]/30 disabled:opacity-50"
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_CONFIG[s]?.label ?? s}</option>
                    ))}
                  </select>
                  {updating === selected.id && <Loader2 className="w-5 h-5 animate-spin text-gray-400 self-center" />}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
