import { useRef, useState } from "react";
import { CHAPTERS, getCapitulosDeLibro, getLibros, type Chapter } from "../content/chapters";
import { useCerrarAlClickAfuera } from "../hooks/useCerrarAlClickAfuera";

interface Props {
  chapter: Chapter;
  onSelect: (chapterId: string) => void;
}

const ROMANOS: [number, string][] = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

function toRomano(n: number): string {
  let resto = n;
  let out = "";
  for (const [valor, simbolo] of ROMANOS) {
    while (resto >= valor) {
      out += simbolo;
      resto -= valor;
    }
  }
  return out;
}

function Chevron({ abierto }: { abierto: boolean }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 12 12"
      fill="none"
      className={`selector-header__flecha${abierto ? " abierta" : ""}`}
    >
      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HeaderNav({ chapter, onSelect }: Props) {
  return (
    <header className="reader__progreso">
      <LibroSelector chapter={chapter} onSelect={onSelect} />
      <CapituloSelector chapter={chapter} onSelect={onSelect} />
    </header>
  );
}

function LibroSelector({ chapter, onSelect }: Props) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useCerrarAlClickAfuera(ref, () => setAbierto(false));
  const libros = getLibros();
  const indiceLibro = libros.findIndex((l) => l.slug === chapter.libroSlug) + 1;

  return (
    <div className="selector-header" ref={ref}>
      <button
        className="selector-header__boton"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        title={chapter.libroTitulo}
      >
        <span>Libro {toRomano(indiceLibro)}</span>
        <Chevron abierto={abierto} />
      </button>
      {abierto && (
        <ul className="selector-header__lista">
          {libros.map((libro) => (
            <li key={libro.slug}>
              <button
                className={libro.slug === chapter.libroSlug ? "activo" : ""}
                onClick={() => {
                  onSelect(libro.primerCapituloId);
                  setAbierto(false);
                }}
              >
                {libro.titulo}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CapituloSelector({ chapter, onSelect }: Props) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useCerrarAlClickAfuera(ref, () => setAbierto(false));
  const capitulos = getCapitulosDeLibro(chapter.libroSlug);

  return (
    <div className="selector-header selector-header--derecha" ref={ref}>
      <button
        className="selector-header__boton"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        title={chapter.titulo}
      >
        <span>
          Cap. {chapter.globalIndex + 1}/{CHAPTERS.length}
        </span>
        <Chevron abierto={abierto} />
      </button>
      {abierto && (
        <ul className="selector-header__lista selector-header__lista--derecha">
          {capitulos.map((cap) => (
            <li key={cap.id}>
              <button
                className={cap.id === chapter.id ? "activo" : ""}
                onClick={() => {
                  onSelect(cap.id);
                  setAbierto(false);
                }}
              >
                {cap.titulo}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
