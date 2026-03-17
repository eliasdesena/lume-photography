import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-display text-3xl text-cream mb-6 mt-10 first:mt-0">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-xl text-cream mb-4 mt-8">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-base text-cream/80 mb-3 mt-6">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="font-body font-light text-muted text-base leading-relaxed mb-4">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="font-body font-light text-muted text-base leading-relaxed mb-4 space-y-1 list-disc list-outside pl-5">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="font-body font-light text-muted text-base leading-relaxed mb-4 space-y-1 list-decimal list-outside pl-5">{children}</ol>
    ),
    li: ({ children }) => <li>{children}</li>,
    strong: ({ children }) => <strong className="text-cream/90 font-medium">{children}</strong>,
    a: ({ children, href }) => (
      <a href={href} className="text-gold hover:text-gold/80 underline underline-offset-2 transition-colors">{children}</a>
    ),
    hr: () => <hr className="border-hairline/40 my-8" />,
    ...components,
  };
}
