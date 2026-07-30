import { useEffect, useRef, useState } from "react";
import { CHAPTERS, getCapitulosDeLibro, getLibros, type Chapter } from "../content/chapters";

interface Props {
  chapter: Chapter;
  onSelect: (chapterId: string) => void;
}

function useCerrarAlClickAfuera(ref: React.RefObject<HTMLElement | null>, cerrar: () => void) {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cerrar();
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [ref, cerrar]);
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

  return (
    <div className="selector-header" ref={ref}>
      <button
        className="selector-header__boton"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
      >
        <span>{chapter.libroTitulo}</span>
        <span className={`selector-header__flecha${abierto ? " abierta" : ""}`}>▾</span>
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
      >
        <span>
          Capítulo {chapter.globalIndex + 1} de {CHAPTERS.length}
        </span>
        <span className={`selector-header__flecha${abierto ? " abierta" : ""}`}>▾</span>
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
