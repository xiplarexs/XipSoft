import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { BookOpen } from "lucide-react";
import type { BookItem } from "./types";

export const BooksSection = ({ books }: { books: BookItem[] }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2, once: true });

  return (
    <div ref={ref} className="py-8">
      <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: "linear-gradient(135deg, #a78bfa12, #22d3ee08)", border: "1px solid rgba(167,139,250,0.15)" }}>
          <BookOpen className="w-4 h-4 text-prism-violet" />
        </div>
        <span className="-mono text-[11px] text-zinc-500 uppercase tracking-[0.2em]">Books</span>
      </motion.div>

      <motion.h2 className="-display font-bold text-3xl md:text-4xl mb-2 bg-gradient-to-r from-prism-violet via-prism-cyan to-prism-rose bg-clip-text text-transparent" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.6, delay: 0.1 }}>
        Recommended Books
      </motion.h2>
      <motion.p className="-body text-sm text-zinc-500 mb-8 max-w-lg" initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} transition={{ duration: 0.5, delay: 0.2 }}>
        Community-recommended tech books and learning resources.
      </motion.p>

      {books.length === 0 ? (
        <motion.div className="rounded-2xl border border-white/10 bg-surface/50 p-8 text-zinc-400" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 0.3 }}>
          No books yet. Community recommendations will appear here soon.
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {books.map((book, i) => (
            <motion.article key={book._id} className="rounded-2xl border border-white/[0.06] bg-surface/50 p-6 transition-colors hover:border-white/20" initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  {book.image && (
                    <img src={book.image} alt={`${book.title} cover`} className="h-32 w-24 rounded-xl border border-white/10 object-cover" />
                  )}
                  <div>
                    <h3 className="-display text-xl font-semibold text-zinc-100 mb-1">{book.title}</h3>
                    <p className="text-sm text-zinc-400 mb-2">by {book.authorName}</p>
                    {(book.authorEmail || book.authorLink) && (
                      <div className="flex flex-col gap-1 text-sm">
                        {book.authorEmail && (
                          <a href={`mailto:${book.authorEmail}`} className="text-zinc-400 hover:text-prism-cyan transition-colors">{book.authorEmail}</a>
                        )}
                        {book.authorLink && (
                          <a href={book.authorLink} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-prism-cyan transition-colors">{book.authorLink}</a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <a href={book.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full border border-prism-violet/40 px-4 py-2 text-sm font-medium text-prism-violet transition-colors hover:border-prism-violet hover:bg-prism-violet/10 shrink-0">
                  Open Resource
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};
