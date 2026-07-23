import type { EditorThemeClasses } from "lexical";

const editorTheme: EditorThemeClasses = {
  root: "text-zinc-300 -body text-base leading-relaxed focus:outline-none min-h-[200px]",
  paragraph: "mb-4 leading-[1.8] text-[15px]",
  heading: {
    h1: "text-3xl sm:text-4xl font-bold -display text-white mt-10 mb-5 tracking-tight",
    h2: "text-2xl sm:text-3xl font-semibold -display text-white mt-10 mb-4 tracking-tight pb-3 border-b border-white/[0.06]",
    h3: "text-xl sm:text-2xl font-semibold -display text-zinc-100 mt-8 mb-3 tracking-tight",
  },
  text: {
    bold: "-bold text-white",
    italic: "italic text-zinc-200",
    underline: "underline underline-offset-4 decoration-prism-violet/40",
    strikethrough: "line-through text-zinc-500",
    code: "px-1.5 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.04] -mono text-[13px] text-prism-cyan",
  },
  list: {
    ul: "list-disc ml-6 my-5 space-y-1",
    ol: "list-decimal ml-6 my-5 space-y-1",
    listitem: "mt-1.5 leading-[1.8] text-[15px] marker:text-zinc-600",
    nested: {
      listitem: "list-none",
    },
    listitemChecked:
      "relative ml-6 list-none line-through text-zinc-500",
    listitemUnchecked:
      "relative ml-6 list-none",
  },
  quote:
    "border-l-[3px] border-prism-violet/30 pl-6 py-1 italic text-zinc-400 my-6 bg-prism-violet/[0.02] rounded-r-lg",
  link: "text-prism-cyan underline underline-offset-4 decoration-prism-cyan/30 hover:decoration-prism-cyan/60 hover:text-white transition-all duration-200 cursor-pointer",
  code: "bg-surface/80 rounded-xl border border-white/[0.06] p-5 -mono text-[13px] my-6 overflow-x-auto block leading-6",
  codeHighlight: {
    atrule: "text-prism-violet",
    attr: "text-prism-cyan",
    boolean: "text-prism-rose",
    builtin: "text-prism-cyan",
    cdata: "text-zinc-500",
    char: "text-green-400",
    class: "text-prism-cyan",
    "class-name": "text-prism-cyan",
    comment: "text-zinc-500 italic",
    constant: "text-prism-rose",
    deleted: "text-red-400",
    doctype: "text-zinc-500",
    entity: "text-prism-cyan",
    function: "text-prism-violet",
    important: "text-prism-rose",
    inserted: "text-green-400",
    keyword: "text-prism-violet",
    namespace: "text-zinc-400",
    number: "text-prism-rose",
    operator: "text-zinc-400",
    prolog: "text-zinc-500",
    property: "text-prism-cyan",
    punctuation: "text-zinc-400",
    regex: "text-prism-rose",
    selector: "text-green-400",
    string: "text-green-400",
    symbol: "text-prism-rose",
    tag: "text-prism-rose",
    url: "text-prism-cyan",
    variable: "text-prism-rose",
  },
};

export default editorTheme;
