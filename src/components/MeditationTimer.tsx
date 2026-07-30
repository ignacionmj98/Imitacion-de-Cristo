import { useEffect, useRef, useState } from "react";
import {
  DURACIONES_MINUTOS,
  type DuracionMinutos,
  iniciarSesionMeditacion,
  cancelarSesionMeditacion,
} from "../services/meditationTimer";

type Estado =
  | { fase: "inactivo" }
  | { fase: "eligiendo" }
  | { fase: "en-curso"; duracionMinutos: DuracionMinutos; inicio: number }
  | { fase: "completada" };

interface Props {
  tituloCapitulo: string;
  mostrarBoton: boolean;
  onAbrirAjustes: () => void;
}

export function MeditationTimer({ tituloCapitulo, mostrarBoton, onAbrirAjustes }: Props) {
  const [estado, setEstado] = useState<Estado>({ fase: "inactivo" });
  const [transcurridoMs, setTranscurridoMs] = useState(0);
  const [minimizado, setMinimizado] = useState(false);
  const intervaloRef = useRef<number | undefined>(undefined);

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
    if (!mostrarBoton) return null;
    return (
      <button
        className="meditacion-fab"
        onClick={() => setEstado({ fase: "eligiendo" })}
        aria-label="Iniciar tiempo de meditación"
        title="Iniciar tiempo de meditación"
      >
        ⏱
      </button>
    );
  }

  if (estado.fase === "eligiendo") {
    return (
      <div className="meditacion-panel meditacion-panel--elegir">
        <p>Duración de la meditación</p>
        <div className="meditacion-opciones">
          {DURACIONES_MINUTOS.map((min) => (
            <button key={min} onClick={() => elegirDuracion(min)}>
              {min} min
            </button>
          ))}
        </div>
        <div className="meditacion-panel__pie">
          <button className="meditacion-cerrar" onClick={onAbrirAjustes}>
            Ajustes
          </button>
          <button className="meditacion-cerrar" onClick={() => setEstado({ fase: "inactivo" })}>
            Cancelar
          </button>
        </div>
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
