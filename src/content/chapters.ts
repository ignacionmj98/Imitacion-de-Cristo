import manifest from "../../content/imitacion-de-cristo/manifest.json";

const rawFiles = import.meta.glob("../../content/imitacion-de-cristo/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

export interface Chapter {
  id: string;
  globalIndex: number;
  libroSlug: string;
  libroTitulo: string;
  numero: number;
  titulo: string;
  archivo: string;
}

function resolveRaw(archivo: string): string {
  const key = Object.keys(rawFiles).find((path) => path.endsWith(`/imitacion-de-cristo/${archivo}`));
  if (!key) {
    throw new Error(`No se encontró el archivo de capítulo: ${archivo}`);
  }
  return rawFiles[key];
}

const chapters: Chapter[] = [];

for (const libro of manifest.libros) {
  for (const capitulo of libro.capitulos) {
    chapters.push({
      id: `${libro.slug}/${capitulo.numero}`,
      globalIndex: chapters.length,
      libroSlug: libro.slug,
      libroTitulo: libro.titulo,
      numero: capitulo.numero,
      titulo: capitulo.titulo,
      archivo: capitulo.archivo,
    });
  }
}

export const CHAPTERS: readonly Chapter[] = chapters;

export function getChapterById(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function getFirstChapter(): Chapter {
  return CHAPTERS[0];
}

export function getNextChapter(current: Chapter): Chapter | undefined {
  return CHAPTERS[current.globalIndex + 1];
}

export function getPreviousChapter(current: Chapter): Chapter | undefined {
  return CHAPTERS[current.globalIndex - 1];
}

export interface ParsedChapter {
  titulo: string;
  parrafos: string[];
}

export function getChapterContent(chapter: Chapter): ParsedChapter {
  const raw = resolveRaw(chapter.archivo);
  const lines = raw.split("\n");
  const bodyLines = lines[0]?.startsWith("### ") ? lines.slice(1) : lines;
  const parrafos = bodyLines
    .join("\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  return { titulo: chapter.titulo, parrafos };
}
