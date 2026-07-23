"use client";

/**
 * AmbientLantern — Ana birlestirici bilesen.
 * Tüm sayfalarda fixed overlay olarak render edilir.
 *
 * Dosya yapısı:
 *  AmbientLantern.tsx  ← bu dosya (birlestirici)
 *  AmbientOrbs.tsx     ← violet arka plan ısık topları
 *  LampUnit.tsx        ← tek lamba (body + cone)
 *  LampBody.tsx        ← kablo + sapka + ampul
 *  LampCone.tsx        ← 5 katmanlı ısık konisi
 *  lamps.data.ts       ← lamba konfigürasyon verisi
 */

import AmbientOrbs from "./AmbientOrbs";
import LampUnit from "./LampUnit";
import { LAMPS } from "./lamps.data";

export default function AmbientLantern() {
  return (
    <>
      {/* Arka plan violet orb topları */}
      <AmbientOrbs />

      {/* 5 sarkıt spot lamba */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[2]"
        style={{ height: "95vh" }}
      >
        {LAMPS.map((lamp, i) => (
          <LampUnit key={i} lamp={lamp} index={i} />
        ))}
      </div>
    </>
  );
}
