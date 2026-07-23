"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown, ChevronUp, ArrowRight, CheckCircle, MessageCircle, MapPin,
  Smartphone, Palette, Code, Zap, Shield, Layers, Globe, Database, Search, BarChart2,
  Monitor, Terminal, Cloud, Lock, Eye, FileCheck, AlertTriangle, Server,
  Brain, Bot, Workflow, Cpu,
  TrendingUp, Target, Users, MousePointer,
  GitBranch, RefreshCw,
  Code2, Link2, Webhook, GitMerge,
  PieChart, FileText, Filter,
  type LucideIcon,
} from "lucide-react";
import type { ServicePageData } from "@/data/services";
import type { ServiceDistrict } from "@/data/locations";

const iconMap: Record<string, LucideIcon> = {
  Smartphone, Palette, Code, Zap, Shield, Layers, Globe, Database, Search, BarChart2,
  Monitor, Terminal, Cloud, Lock, Eye, FileCheck, AlertTriangle, Server,
  Brain, Bot, Workflow, Cpu,
  TrendingUp, Target, Users, MousePointer,
  GitBranch, RefreshCw,
  Code2, Link2, Webhook, GitMerge,
  PieChart, FileText, Filter, CheckCircle, ArrowRight, MapPin,
};

function getIcon(name: string): LucideIcon {
  return iconMap[name] || CheckCircle;
}

interface Props {
  service: ServicePageData;
  district: ServiceDistrict;
}

export default function ServiceDistrictPageClient({ service, district }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-obsidian text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-transparent" />
        <div className="relative max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-white/10 text-gray-300 border border-white/10">
            <MapPin className="w-3.5 h-3.5" />
            {district.name}
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            {service.title} {district.name}
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {district.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/teklif"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              {service.heroCta} <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/905444548444"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Bize Ulasın
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {service.stats.map((s, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      {service.features.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Özellikler</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((f, i) => (
                <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${f.color}20` }}>
                    {(() => { const FeatureIcon = getIcon(f.icon as string); return <FeatureIcon className="w-5 h-5" style={{ color: f.color }} />; })()}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tech Stack */}
      {service.techStack.length > 0 && (
        <section className="py-16 px-4 bg-white/[0.02]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Teknolojiler</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {service.techStack.map((t, i) => (
                <span key={i} className="px-4 py-2 rounded-full text-sm font-medium border border-white/10" style={{ color: t.color, borderColor: `${t.color}40` }}>
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Steps */}
      {service.processSteps.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">{service.processTitle || "Sürecimiz"}</h2>
            {service.processDesc && <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">{service.processDesc}</p>}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.processSteps.map((p, i) => (
                <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold" style={{ backgroundColor: `${p.color}20`, color: p.color }}>
                    {p.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-400">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Packages */}
      {service.packages.length > 0 && (
        <section className="py-16 px-4 bg-white/[0.02]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Paketler</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {service.packages.map((p, i) => (
                <div key={i} className={`p-6 rounded-xl border ${p.popular ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 bg-white/5"}`}>
                  {p.popular && <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-600 text-white mb-4">Popüler</span>}
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <div className="mt-2 text-3xl font-bold" style={{ color: p.color }}>{p.price}</div>
                  <p className="mt-2 text-sm text-gray-400">{p.desc}</p>
                  <ul className="mt-6 space-y-2">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-green-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/teklif" className="mt-6 block text-center py-2.5 rounded-lg border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors">
                    Teklif Al
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Micro Services */}
      {service.microServices.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Hizmet Detayları</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {service.microServices.map((m, i) => (
                <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: m.color }}>{m.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{m.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {m.keywords.map((k, j) => (
                      <span key={j} className="px-2.5 py-1 rounded-full text-xs bg-white/5 text-gray-300 border border-white/10">{k}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {service.faqItems.length > 0 && (
        <section className="py-16 px-4 bg-white/[0.02]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{service.faqTitle || "Sıkça Sorulan Sorular"}</h2>
            <div className="space-y-3">
              {service.faqItems.map((faq, i) => (
                <div key={i} className="rounded-xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-medium hover:bg-white/5 transition-colors"
                  >
                    {faq.question}
                    {openFaq === i ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{service.ctaTitle}</h2>
          <p className="text-gray-400 mb-8">{service.ctaDesc}</p>
          <Link
            href="/teklif"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            {service.ctaBtn} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
