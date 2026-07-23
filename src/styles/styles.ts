const styles = {
  gradient: "bg-obsidian",
  marginHelper: "mx-5 lg:mx-0",
  paddingHelper: "px-5 lg:px-4",
  container: "max-w-[1200px] antialiased mx-auto",
  squareAbsolute: `
    absolute
    inset-0
    [mask-image:linear-gradient(0deg,#ffffff08,#ffffff20)]
    `,
  squareBackground: "bg-square",
  glassomophic:
    "bg-surface bg-clip-padding backdrop-filter backdrop-blur-lg border-t border-white/5",
  cardSurface:
    "bg-surface border border-white/5 rounded-2xl",
  prismText:
    "bg-prism-gradient bg-clip-text text-transparent",
  prismBorder:
    "prism-border-gradient",
} as const;

export default styles;
