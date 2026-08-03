import { useEffect, useRef, useState } from "react";
import type { Configuracion } from "../content/settings";
import { useCerrarAlClickAfuera } from "../hooks/useCerrarAlClickAfuera";
import {
  DURACIONES_MINUTOS,
  type DuracionMinutos,
  iniciarSesionMeditacion,
  cancelarSesionMeditacion,
} from "../services/meditationTimer";
import { SettingsPanel } from "./SettingsPanel";

type Estado =
  | { fase: "inactivo" }
  | { fase: "eligiendo" }
  | { fase: "en-curso"; duracionMinutos: DuracionMinutos; inicio: number }
  | { fase: "completada" };

interface Props {
  tituloCapitulo: string;
  config: Configuracion;
  onConfigChange: (config: Configuracion) => void;
}

export function MeditationTimer({ tituloCapitulo, config, onConfigChange }: Props) {
  const [estado, setEstado] = useState<Estado>({ fase: "inactivo" });
  const [transcurridoMs, setTranscurridoMs] = useState(0);
  const [minimizado, setMinimizado] = useState(false);
  const [duracionSeleccionada, setDuracionSeleccionada] = useState<DuracionMinutos>(
    DURACIONES_MINUTOS[0],
  );
  const intervaloRef = useRef<number | undefined>(undefined);
  const panelElegirRef = useRef<HTMLDivElement>(null);
  useCerrarAlClickAfuera(panelElegirRef, () => {
    if (estado.fase === "eligiendo") setEstado({ fase: "inactivo" });
  });

  useEffect(() => {
    if (estado.fase !== "en-curso") return;
    const { inicio, duracionMinutos } = estado;
    const duracionMs = duracionMinutos * 60_000;

    intervaloRef.current = window.setInterval(() => {
      const t = Date.now() - inicio;
      if (t >= duracionMs) {
        setTranscurridoMs(duracionMs);
        setEstado({ fase: "completada" });
        return;
      }
      setTranscurridoMs(t);
    }, 250);

    return () => window.clearInterval(intervaloRef.current);
  }, [estado]);

  async function elegirDuracion(duracionMinutos: DuracionMinutos) {
    await iniciarSesionMeditacion(tituloCapitulo, duracionMinutos);
    setTranscurridoMs(0);
    setMinimizado(false);
    setEstado({ fase: "en-curso", duracionMinutos, inicio: Date.now() });
  }

  async function detener() {
    await cancelarSesionMeditacion();
    setTranscurridoMs(0);
    setMinimizado(false);
    setEstado({ fase: "inactivo" });
  }

  if (estado.fase === "inactivo") {
    return (
      <button
        className="meditacion-fab"
        onClick={() => setEstado({ fase: "eligiendo" })}
        aria-label="Iniciar tiempo de meditación y abrir ajustes"
        title="Meditar / Ajustes"
      >
        ⏱
      </button>
    );
  }

  if (estado.fase === "eligiendo") {
    return (
      <div className="meditacion-panel meditacion-panel--elegir" ref={panelElegirRef}>
        <p>Duración de la meditación</p>
        <div className="meditacion-opciones">
          {DURACIONES_MINUTOS.map((min) => (
            <button
              key={min}
              className={min === duracionSeleccionada ? "activo" : ""}
              onClick={() => setDuracionSeleccionada(min)}
            >
              {min} min
            </button>
          ))}
        </div>

        <SettingsPanel config={config} onChange={onConfigChange} />

        <button
          className="meditacion-comenzar"
          onClick={() => elegirDuracion(duracionSeleccionada)}
        >
          Comenzar meditación
        </button>

        <button className="meditacion-cerrar" onClick={() => setEstado({ fase: "inactivo" })}>
          Cerrar
        </button>
      </div>
    );
  }

  if (estado.fase === "en-curso") {
    const duracionMs = estado.duracionMinutos * 60_000;
    const porcentaje = Math.min(100, Math.round((transcurridoMs / duracionMs) * 100));
    const restanteSeg = Math.max(0, Math.ceil((duracionMs - transcurridoMs) / 1000));
    const mm = String(Math.floor(restanteSeg / 60)).padStart(2, "0");
    const ss = String(restanteSeg % 60).padStart(2, "0");

    if (minimizado) {
      return (
        <button
          className="meditacion-mini"
          onClick={() => setMinimizado(false)}
          aria-label={`Meditación en curso, ${porcentaje}% completado. Tocar para mostrar el temporizador.`}
          title="Mostrar temporizador de meditación"
        >
          <AnilloProgreso porcentaje={porcentaje} tamano={48} />
          <span className="meditacion-mini__icono">⏱</span>
        </button>
      );
    }

    return (
      <div className="meditacion-panel meditacion-panel--curso">
        <button
          className="meditacion-minimizar"
          onClick={() => setMinimizado(true)}
          aria-label="Ocultar el temporizador mientras medito"
          title="Ocultar temporizador"
        >
          ⌄
        </button>
        <AnilloProgreso porcentaje={porcentaje} />
        <div className="meditacion-tiempo">
          <strong>
            {mm}:{ss}
          </strong>
          <span>{porcentaje}%</span>
        </div>
        <button className="meditacion-cerrar" onClick={detener}>
          Detener
        </button>
      </div>
    );
  }

  return (
    <div className="meditacion-panel meditacion-panel--completa">
      <p>Meditación completada</p>
      <button onClick={() => setEstado({ fase: "inactivo" })}>Cerrar</button>
    </div>
  );
}

function AnilloProgreso({ porcentaje, tamano = 64 }: { porcentaje: number; tamano?: number }) {
  const radio = tamano / 2 - 6;
  const centro = tamano / 2;
  const circunferencia = 2 * Math.PI * radio;
  const offset = circunferencia * (1 - porcentaje / 100);

  return (
    <svg width={tamano} height={tamano} viewBox={`0 0 ${tamano} ${tamano}`} className="meditacion-anillo">
      <circle cx={centro} cy={centro} r={radio} className="meditacion-anillo__fondo" />
      <circle
        cx={centro}
        cy={centro}
        r={radio}
        className="meditacion-anillo__progreso"
        strokeDasharray={circunferencia}
        strokeDashoffset={offset}
      />
    </svg>
  );
}
