import type { StepData } from "./types";

export function TerminalBlock({ label, lines }: { label: string; lines: StepData["terminal"]["lines"] }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.06] bg-black/40 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-[10px] text-zinc-600 -mono ml-1">{label}</span>
      </div>
      {/* Lines */}
      <div className="px-4 py-3 space-y-1 -mono text-xs leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-2">
            {line.prompt && <span className="text-emerald-500 select-none">$</span>}
            <span style={line.accent ? { color: line.accent } : undefined} className={line.accent ? "" : "text-zinc-500"}>
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
