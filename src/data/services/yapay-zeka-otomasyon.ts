import {
  Brain, Bot, Workflow, BarChart2, Cpu, Shield,
} from "lucide-react";
import type { ServicePageData } from "./types";

export const yapayZekaOtomasyonData: ServicePageData = {
  slug: "yapay-zeka-otomasyon",
  metadata: {
    title: "Yapay Zeka & Otomasyon | XipSoft",
    description: "Is süreçlerinizi yapay zeka ile otomatize edin. ChatgPT entegrasyonu, makine ögrenmesi, NLP, görüntü isleme ve RPA çözümleri. Ücretsiz teklif alın!",
    keywords: ["yapay zeka", "ai çözümleri", "otomasyon", "chatgpt entegrasyonu", "makine ögrenmesi", "nlp", "görüntü isleme", "rpa"],
  },
  badge: "Yapay Zeka Çözümleri",
  badgeIcon: Brain,
  badgegradient: "from-violet-500/10 to-purple-500/10",
  badgeColor: "text-violet-400",
  title: "Yapay Zeka & Otomasyon",
  titlegradient: "from-rose-400 via-orange-400 to-yellow-400",
  subtitle: "Is süreçlerinizi yapay zeka ile dönüstürün. ChatgPT entegrasyonu, makine ögrenmesi, RPA ve is süreci otomasyonu ile verimliliginizi katlayın.",
  heroCta: "Ücretsiz Teklif Al",
  stats: [
    { value: "50+", label: "AI Projesi" },
    { value: "%90", label: "Süreç Otomasyonu" },
    { value: "15+", label: "Yıl Deneyim" },
    { value: "4-12", label: "Hafta Teslimat" },
  ],
  statsgradient: "from-violet-400 to-cyan-400",
  features: [
    { icon: Brain, title: "LLM Entegrasyonu", description: "gPT-4, Claude, gemini gibi büyük dil modellerini uygulamanıza entegre edin", color: "#a78bfa" },
    { icon: Bot, title: "Chatbot & Asistan", description: "Müsteri hizmetleri, satıs ve destek için akıllı konusma botları", color: "#22d3ee" },
    { icon: Workflow, title: "Is Süreci Otomasyonu", description: "Tekrarlayan görevleri otomatize eden RPA ve workflow çözümleri", color: "#fb7185" },
    { icon: BarChart2, title: "Veri Analizi & Tahmin", description: "Makine ögrenmesi ile satıs tahmini, müsteri segmentasyonu ve anomali tespiti", color: "#fbbf24" },
    { icon: Cpu, title: "görüntü Isleme", description: "OCR, nesne tanıma, yüz tanıma ve görsel içerik analizi çözümleri", color: "#34d399" },
    { icon: Shield, title: "güvenli AI Altyapısı", description: "On-premise model deployment ile verileriniz sirket dısına çıkmaz", color: "#fb7185" },
  ],
  techStack: [
    { name: "OpenAI gPT-4", color: "#a78bfa" }, { name: "LangChain", color: "#22d3ee" },
    { name: "Python", color: "#fbbf24" }, { name: "TensorFlow", color: "#fb7185" },
    { name: "PyTorch", color: "#34d399" }, { name: "Hugging Face", color: "#a78bfa" },
    { name: "n8n", color: "#22d3ee" }, { name: "Zapier", color: "#fbbf24" },
  ],
  processSteps: [
    { step: "01", title: "Ihtiyaç Analizi", description: "Hangi süreçlerin otomatize edilebilecegini, hangi AI çözümünün uygun oldugunu birlikte belirleriz.", color: "#a78bfa" },
    { step: "02", title: "Prototip & PoC", description: "Küçük ölçekli proof-of-concept ile çözümün ise yarayıp yaramadıgını hızlıca test ederiz.", color: "#22d3ee" },
    { step: "03", title: "Model Seçimi & Fine-tuning", description: "Ihtiyacınıza göre hazır model seçer veya kendi verilerinizle fine-tuning yaparız.", color: "#fb7185" },
    { step: "04", title: "Entegrasyon & Test", description: "AI çözümünü mevcut sistemlerinize entegre eder, kapsamlı testler yaparız.", color: "#fbbf24" },
    { step: "05", title: "Yayın & Izleme", description: "Canlıya alır, model performansını izler ve sürekli iyilestirme yaparız.", color: "#34d399" },
  ],
  packages: [
    { name: "Baslangıç", price: "₺20.000", desc: "Tek AI özelligi entegrasyonu", color: "#a78bfa", features: ["ChatgPT/Claude entegrasyonu", "Temel chatbot", "API baglantısı", "Dokümantasyon", "3 ay destek"] },
    { name: "Profesyonel", price: "₺50.000", desc: "Kapsamlı AI çözümü", color: "#22d3ee", popular: true, features: ["Özel AI asistan", "Workflow otomasyonu", "Veri analizi modülü", "Dashboard entegrasyonu", "Fine-tuning", "6 ay destek"] },
    { name: "Kurumsal", price: "Teklif Al", desc: "Tam AI dönüsümü", color: "#fb7185", features: ["On-premise deployment", "Özel model egitimi", "Çoklu AI entegrasyonu", "RPA pipeline", "güvenlik denetimi", "12 ay destek"] },
  ],
  ctaTitle: "AI ile Isinizi Dönüstürelim",
  ctaDesc: "Yapay zeka ve otomasyon çözümleriyle verimliliginizi katlayın.",
  ctaBtn: "Ücretsiz Teklif Al",
  microServices: [
    { title: "ChatgPT & LLM Entegrasyonu — Akıllı Asistan gelistirme", keywords: ["gPT-4o", "Claude 3.5", "RAg", "Vector DB", "Prompt Engineering"], color: "#a78bfa", icon: Brain, description: "OpenAI gPT-4o, Anthropic Claude veya google gemini modellerini uygulamanıza entegre ediyoruz. RAg mimarisiyle kendi verilerinizi modele besleyerek sirketinize özel AI asistan olusturuyoruz." },
    { title: "Is Süreci Otomasyonu — RPA & Workflow", keywords: ["n8n", "Make", "Zapier", "Python RPA", "Selenium"], color: "#22d3ee", icon: Workflow, description: "Fatura isleme, veri girisi, e-posta yönetimi gibi tekrarlayan süreçleri %90 oranında otomatize ediyoruz." },
    { title: "Makine Ögrenmesi & Tahminsel Analitik", keywords: ["Scikit-learn", "XgBoost", "Zaman Serisi", "Müsteri Segmentasyonu", "Churn Tahmini"], color: "#fb7185", icon: BarChart2, description: "geçmis verilerinizden ögrenen modeller ile satıs tahmini, talep planlaması, müsteri churn tahmini yapıyoruz." },
    { title: "görüntü Isleme & Bilgisayarlı görü", keywords: ["OCR", "YOLO", "OpenCV", "Nesne Tanıma", "Belge Analizi"], color: "#34d399", icon: Cpu, description: "Fatura, kimlik, sözlesme gibi belgeleri otomatik okuyan OCR sistemleri kuruyoruz." },
  ],
  faqTitle: "Yapay Zeka & Otomasyon Hakkında Sık Sorulan Sorular",
  faqItems: [
    { question: "Yapay zeka entegrasyonu ne kadar sürer?", answer: "Projenin kapsamına göre 4-12 hafta arasında degisir." },
    { question: "Mevcut sistemime AI entegre edebilir misiniz?", answer: "Evet, REST API aracılıgıyla mevcut uygulamanıza AI yetenekleri ekleyebiliriz." },
    { question: "Verilerim güvende mi?", answer: "Tüm AI entegrasyonlarında veri gizliligi önceligimizdir. gerektiginde on-premise deployment yapıyoruz." },
  ],
};
