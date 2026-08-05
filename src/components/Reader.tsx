import { useMemo, useState } from "react";
import {
  getChapterById,
  getChapterContent,
  getFirstChapter,
  getNextChapter,
  getPreviousChapter,
} from "../content/chapters";
import { getProgreso, setCapituloActual } from "../content/progress";
import { useConfiguracion } from "../hooks/useConfiguracion";
import { HeaderNav } from "./HeaderNav";
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
  const [config, setConfig] = useConfiguracion();

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
      <HeaderNav chapter={chapter} onSelect={irA} />

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

      <MeditationTimer tituloCapitulo={chapter.titulo} config={config} onConfigChange={setConfig} />
    </div>
  );
}
