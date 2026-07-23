"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2, RefreshCw, CheckCircle } from "lucide-react";
import {
  sendAdmin2faOtpAction,
  verifyAdmin2faOtpAction,
} from "@/app/_actions/admin-2fa-actions";

type Stage = "sending" | "waiting" | "verifying" | "success" | "error";

export default function Admin2FAClient() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<Stage>("sending");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const sendOtp = useCallback(async () => {
    setStage("sending");
    setError("");
    setCode("");
    const result = await sendAdmin2faOtpAction();
    if (result.success) {
      setStage("waiting");
      setCountdown(60);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setError(result.error ?? "Telegram kodu gönderilemedi");
      setStage("error");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    sendOtp();
  }, [sendOtp]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const clean = code.replace(/\D/g, "");
    if (clean.length < 4) return;

    setStage("verifying");
    setError("");
    const result = await verifyAdmin2faOtpAction(clean, "");

    if (result.success) {
      setStage("success");
      router.replace("/admin");
    } else {
      setError(result.error ?? "Kod hatalı");
      setCode("");
      setStage("waiting");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  const isBusy = stage === "sending" || stage === "verifying" || stage === "success";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="border border-gray-200 rounded-2xl p-8 space-y-6 shadow-sm bg-white">

          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
              {stage === "success" ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : isBusy ? (
                <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
              ) : (
                <Shield className="w-8 h-8 text-gray-600" />
              )}
            </div>
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-gray-900">Iki Faktörlü Dogrulama</h1>
            <p className="text-sm text-gray-500">
              {stage === "sending" && "Telegram'a kod gönderiliyor..."}
              {stage === "waiting" && "Telegram'a gönderilen 6 haneli kodu girin"}
              {stage === "verifying" && "Kod dogrulanıyor..."}
              {stage === "success" && "Dogrulandı, yönlendiriliyorsunuz..."}
              {stage === "error" && "Kod gönderilemedi"}
            </p>
          </div>

          {(stage === "waiting" || stage === "verifying") && (
            <form onSubmit={handleVerify} className="space-y-4">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • • • •"
                autoComplete="one-time-code"
                disabled={stage === "verifying"}
                className="w-full text-center text-2xl font-mono tracking-[0.5em] bg-white border border-gray-300 rounded-xl px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-50"
              />

              {error && (
                <p className="text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={code.replace(/\D/g, "").length < 4 || stage === "verifying"}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {stage === "verifying" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Dogrula
                  </>
                )}
              </button>
            </form>
          )}

          {stage === "error" && (
            <div className="space-y-3">
              {error && (
                <p className="text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <button
                onClick={sendOtp}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Tekrar Dene
              </button>
            </div>
          )}

          {stage === "waiting" && (
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-xs text-gray-400">
                  Tekrar gönder:{" "}
                  <span className="text-gray-600 tabular-nums">{countdown}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={sendOtp}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1.5 mx-auto transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Kodu tekrar gönder
                </button>
              )}
            </div>
          )}

          <p className="text-center text-xs text-gray-400">
            Kod 5 dakika geçerlidir · Telegram üzerinden gönderilir
          </p>
        </div>
      </div>
    </div>
  );
}
