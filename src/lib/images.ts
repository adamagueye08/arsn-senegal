/**
 * Images responsives du site.
 *
 * Les fichiers de src/assets/img/ sont nommés `<nom>-<largeur>.webp`
 * (ex. hero-1-1280.webp). Cette aide construit le `srcSet` à partir de toutes
 * les largeurs disponibles : le navigateur ne télécharge que la plus adaptée à
 * l'écran (mobile, ordinateur, écran Retina). Toutes les pages passent par ici
 * pour rester cohérentes.
 */
const urls = import.meta.glob("../assets/img/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

type Variant = { w: number; url: string };
const index: Record<string, Variant[]> = {};

for (const [path, url] of Object.entries(urls)) {
  const m = path.match(/\/([a-z0-9-]+)-(\d+)\.webp$/);
  if (!m) continue;
  (index[m[1]] ??= []).push({ w: Number(m[2]), url });
}
for (const name of Object.keys(index)) index[name].sort((a, b) => a.w - b.w);

export function responsiveImage(name: string, sizes: string) {
  const variants = index[name] ?? [];
  if (variants.length === 0) return { src: "", srcSet: undefined, sizes };
  const fallback = variants[Math.floor((variants.length - 1) / 2)];
  return {
    src: fallback.url,
    srcSet: variants.map((v) => `${v.url} ${v.w}w`).join(", "),
    sizes,
  };
}
