"use client";

import { useState, useEffect } from "react";
import type { IPBlockEntry, CountryBlockEntry } from "./components";
import { SecurityOverview, IPThreatList, CountryThreatList } from "./components";

export default function AdminSecurityClient() {
  const [activeTab, setActiveTab] = useState<"ip" | "country">("ip");

  // IP Engelleme States
  const [ipEntries, setIpEntries] = useState<IPBlockEntry[]>([]);
  const [ipLoading, setIpLoading] = useState(true);
  const [ipError, setIpError] = useState<string | null>(null);
  const [ipForm, setIpForm] = useState({ ip_address: "", reason: "", is_permanent: true, expires_hours: 24 });
  const [ipSubmitting, setIpSubmitting] = useState(false);

  // Ülke Engelleme States
  const [countryEntries, setCountryEntries] = useState<CountryBlockEntry[]>([]);
  const [countryLoading, setCountryLoading] = useState(true);
  const [countryError, setCountryError] = useState<string | null>(null);
  const [countryForm, setCountryForm] = useState({ country_code: "", custom_code: "", reason: "" });
  const [countrySubmitting, setCountrySubmitting] = useState(false);

  // Yükleme Fonksiyonları
  const loadIpList = async () => {
    setIpLoading(true);
    setIpError(null);
    try {
      const res = await fetch("/api/admin/ip-blocklist");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Veri alınamadı");
      setIpEntries(json.blocklist || []);
    } catch (e: any) {
      setIpError(e.message);
    } finally {
      setIpLoading(false);
    }
  };

  const loadCountryList = async () => {
    setCountryLoading(true);
    setCountryError(null);
    try {
      const res = await fetch("/api/admin/country-blocklist");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Veri alınamadı");
      setCountryEntries(json.blocklist || []);
    } catch (e: any) {
      setCountryError(e.message);
    } finally {
      setCountryLoading(false);
    }
  };

  useEffect(() => {
    loadIpList();
    loadCountryList();
  }, []);

  // IP Isleyicileri
  const handleIpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIpSubmitting(true);
    try {
      const res = await fetch("/api/admin/ip-blocklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ipForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Ekleme basarısız");
      setIpForm({ ip_address: "", reason: "", is_permanent: true, expires_hours: 24 });
      await loadIpList();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIpSubmitting(false);
    }
  };

  const handleIpDelete = async (id: number) => {
    if (!confirm("IP engelini kaldırmak istediginize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/ip-blocklist?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Silme basarısız");
      await loadIpList();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleIpClearAll = async () => {
    if (!confirm("Tüm gEÇICI IP engellerini kaldırmak istediginize emin misiniz?")) return;
    try {
      const res = await fetch("/api/admin/ip-blocklist?clearAll=true", { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Islem basarısız");
      await loadIpList();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Ülke Isleyicileri
  const handleCountrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = (countryForm.country_code === "custom" ? countryForm.custom_code : countryForm.country_code).trim().toUpperCase();

    if (!finalCode || finalCode.length !== 2) {
      alert("Lütfen 2 karakterli geçerli bir ülke kodu seçin veya girin.");
      return;
    }

    setCountrySubmitting(true);
    try {
      const res = await fetch("/api/admin/country-blocklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country_code: finalCode, reason: countryForm.reason }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Ekleme basarısız");
      setCountryForm({ country_code: "", custom_code: "", reason: "" });
      await loadCountryList();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setCountrySubmitting(false);
    }
  };

  const handleCountryDelete = async (code: string) => {
    if (!confirm(`${code} ülkesinin engelini kaldırmak istediginize emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/admin/country-blocklist?country_code=${code}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Silme basarısız");
      await loadCountryList();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="text-gray-900">
      <div className="max-w-5xl mx-auto">
        <SecurityOverview activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "ip" && (
          <IPThreatList
            entries={ipEntries}
            loading={ipLoading}
            error={ipError}
            form={ipForm}
            onFormChange={setIpForm}
            onSubmit={handleIpSubmit}
            onDelete={handleIpDelete}
            onClearAll={handleIpClearAll}
            submitting={ipSubmitting}
          />
        )}

        {activeTab === "country" && (
          <CountryThreatList
            entries={countryEntries}
            loading={countryLoading}
            error={countryError}
            form={countryForm}
            onFormChange={setCountryForm}
            onSubmit={handleCountrySubmit}
            onDelete={handleCountryDelete}
            submitting={countrySubmitting}
          />
        )}
      </div>
    </div>
  );
}
