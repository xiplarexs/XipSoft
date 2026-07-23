// Lamba konfigürasyon verisi
export interface LampConfig {
  xPct: number;    // yatay pozisyon (%)
  ropeH: number;   // kablo uzunlugu (px)
  intensity: number; // ısık yogunlugu 0–1
  coneW: number;   // koni genisligi (px)
  coneH: number;   // koni yüksekligi (px)
  flicker: number; // titresim süresi (sn)
}

export const LAMPS: LampConfig[] = [
  { xPct: 10, ropeH: 50, intensity: 0.85, coneW: 520, coneH: 750, flicker: 4.2 },
  { xPct: 90, ropeH: 50, intensity: 0.85, coneW: 520, coneH: 750, flicker: 4.2 },
];
