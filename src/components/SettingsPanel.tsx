import { useEffect, useState } from "react";
import type { Configuracion, Fuente, Tema, TamanoLetra } from "../content/settings";
import { FUENTES, TAMANOS_LETRA } from "../content/settings";
import {
  alternarPantallaCompleta,
  estaEnPantallaCompleta,
  soportaPantallaCompleta,
} from "../services/fullscreen";

interface Props {
  config: Configuracion;
  onChange: (config: Configuracion) => void;
}

const TEMAS: { valor: Tema; etiqueta: string }[] = [
  { valor: "claro", etiqueta: "Claro" },
  { valor: "oscuro", etiqueta: "Oscuro" },
  { valor: "automatico", etiqueta: "Automático" },
];

/** Campos de ajustes, pensados para embeberse dentro del panel del reloj. */
export function SettingsPanel({ config, onChange }: Props) {
  const [enPantallaCompleta, setEnPantallaCompleta] = useState(estaEnPantallaCompleta);

  useEffect(() => {
    const handler = () => setEnPantallaCompleta(estaEnPantallaCompleta());
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  function actualizar<K extends keyof Configuracion>(campo: K, valor: Configuracion[K]) {
    onChange({ ...config, [campo]: valor });
  }

  return (
    <>
      <section className="ajustes-seccion">
        <p className="ajustes-seccion__titulo">Apariencia</p>
        <div className="ajustes-opciones">
          {TEMAS.map((t) => (
            <button
              key={t.valor}
              className={config.tema === t.valor ? "activo" : ""}
              onClick={() => actualizar("tema", t.valor)}
            >
              {t.etiqueta}
            </button>
          ))}
        </div>
      </section>

      <section className="ajustes-seccion">
        <p className="ajustes-seccion__titulo">Tamaño de letra</p>
        <div className="ajustes-opciones">
          {(Object.keys(TAMANOS_LETRA) as TamanoLetra[]).map((t) => (
            <button
              key={t}
              className={config.tamanoLetra === t ? "activo" : ""}
              onClick={() => actualizar("tamanoLetra", t)}
            >
              {TAMANOS_LETRA[t].etiqueta}
            </button>
          ))}
        </div>
      </section>

      <section className="ajustes-seccion">
        <p className="ajustes-seccion__titulo">Tipo de letra</p>
        <div className="ajustes-opciones">
          {(Object.keys(FUENTES) as Fuente[]).map((f) => (
            <button
              key={f}
              className={config.fuente === f ? "activo" : ""}
              onClick={() => actualizar("fuente", f)}
              style={{ fontFamily: FUENTES[f].pila }}
            >
              {FUENTES[f].etiqueta}
            </button>
          ))}
        </div>
      </section>

      {soportaPantallaCompleta() && (
        <section className="ajustes-seccion">
          <p className="ajustes-seccion__titulo">Pantalla completa</p>
          <button
            onClick={async () => {
              await alternarPantallaCompleta();
              setEnPantallaCompleta(estaEnPantallaCompleta());
            }}
          >
            {enPantallaCompleta ? "Salir de pantalla completa" : "Activar pantalla completa"}
          </button>
        </section>
      )}
    </>
  );
}
