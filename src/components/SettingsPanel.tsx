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
  onClose: () => void;
}

const TEMAS: { valor: Tema; etiqueta: string }[] = [
  { valor: "claro", etiqueta: "Claro" },
  { valor: "oscuro", etiqueta: "Oscuro" },
  { valor: "automatico", etiqueta: "Automático" },
];

export function SettingsPanel({ config, onChange, onClose }: Props) {
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
    <div className="ajustes-panel">
      <div className="ajustes-panel__encabezado">
        <h2>Ajustes</h2>
        <button className="meditacion-cerrar" onClick={onClose} aria-label="Cerrar ajustes">
          Cerrar
        </button>
      </div>

      <section className="ajustes-seccion">
        <p className="ajustes-seccion__titulo">Botón de meditar</p>
        <label className="ajustes-switch">
          <input
            type="checkbox"
            checked={config.mostrarBotonMeditar}
            onChange={(e) => actualizar("mostrarBotonMeditar", e.target.checked)}
          />
          Mostrar botón de meditar
        </label>
      </section>

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
    </div>
  );
}
