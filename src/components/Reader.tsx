import { useMemo, useState } from "react";
import {
  CHAPTERS,
  getChapterById,
  getChapterContent,
  getFirstChapter,
  getNextChapter,
  getPreviousChapter,
} from "../content/chapters";
import { getProgreso, setCapituloActual } from "../content/progress";
import { MeditationTimer } from "./MeditationTimer";

function resolveInitialChapterId(): string {
  const progreso = getProgreso();
  if (progreso && getChapterById(progreso.capituloActualId)) {
    return progreso.capituloActualId;
  }
  return getFirstChapter().id;
}

export function Reader() {
  const [chapterId, setChapterId] = useState<string>(resolveInitialChapterId);

  const chapter = getChapterById(chapterId) ?? getFirstChapter();
  const { parrafos } = useMemo(() => getChapterContent(chapter), [chapter]);
  const siguiente = getNextChapter(chapter);
  const anterior = getPreviousChapter(chapter);

  function irA(id: string) {
    setCapituloActual(id);
    setChapterId(id);
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="reader">
      <header className="reader__progreso">
        <span>{chapter.libroTitulo}</span>
        <span>
          Capítulo {chapter.globalIndex + 1} de {CHAPTERS.length}
        </span>
      </header>

      <article className="reader__capitulo">
        <h1>{chapter.titulo}</h1>
        {parrafos.map((parrafo, i) => (
          <p key={i}>{parrafo}</p>
        ))}
      </article>

      <nav className="reader__nav">
        <button disabled={!anterior} onClick={() => anterior && irA(anterior.id)}>
          Anterior
        </button>
        <button disabled={!siguiente} onClick={() => siguiente && irA(siguiente.id)}>
          Siguiente
        </button>
      </nav>

      <MeditationTimer tituloCapitulo={chapter.titulo} />
    </div>
  );
}
