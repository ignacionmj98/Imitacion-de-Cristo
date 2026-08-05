import { LocalNotifications } from "@capacitor/local-notifications";

export const DURACIONES_MINUTOS = [10, 15, 20, 30] as const;
export type DuracionMinutos = (typeof DURACIONES_MINUTOS)[number];

interface Hito {
  porcentaje: number;
  titulo: string;
  mensaje: string;
}

// Momentos de aviso: 25%, 50%, 80% y la finalización de la meditación.
const HITOS: Hito[] = [
  { porcentaje: 25, titulo: "Momento de meditación", mensaje: "Vas por el 25% de tu meditación." },
  { porcentaje: 50, titulo: "Momento de meditación", mensaje: "Vas por la mitad de tu meditación." },
  { porcentaje: 80, titulo: "Momento de meditación", mensaje: "Vas por el 80% de tu meditación." },
  { porcentaje: 100, titulo: "Meditación completada", mensaje: "Terminaste tu tiempo de meditación." },
];

let idsProgramados: number[] = [];

export async function solicitarPermiso(): Promise<boolean> {
  try {
    const estado = await LocalNotifications.checkPermissions();
    if (estado.display === "granted") return true;
    const solicitado = await LocalNotifications.requestPermissions();
    return solicitado.display === "granted";
  } catch {
    // Sin soporte de notificaciones (p. ej. navegador de escritorio sin permiso).
    return false;
  }
}

/**
 * Programa avisos locales para los hitos de 25/50/80/100% de la duración
 * elegida. Estos avisos usan el programador nativo del sistema operativo
 * (vía Capacitor), por lo que disparan aunque la pantalla esté bloqueada
 * o el usuario esté usando otra app, sin depender de un servidor.
 */
export async function iniciarSesionMeditacion(
  tituloCapitulo: string,
  duracionMinutos: DuracionMinutos,
): Promise<void> {
  await cancelarSesionMeditacion();

  const permitido = await solicitarPermiso();
  if (!permitido) return;

  const ahora = Date.now();
  const duracionMs = duracionMinutos * 60_000;
  const base = ahora % 1_000_000;

  const notifications = HITOS.map((hito, i) => ({
    id: base + i,
    title: hito.titulo,
    body: `${tituloCapitulo} — ${hito.mensaje}`,
    schedule: { at: new Date(ahora + duracionMs * (hito.porcentaje / 100)) },
  }));

  idsProgramados = notifications.map((n) => n.id);
  try {
    await LocalNotifications.schedule({ notifications });
  } catch {
    idsProgramados = [];
  }
}

export async function cancelarSesionMeditacion(): Promise<void> {
  if (idsProgramados.length === 0) return;
  const idsPrevios = idsProgramados;
  idsProgramados = [];
  try {
    await LocalNotifications.cancel({
      notifications: idsPrevios.map((id) => ({ id })),
    });
  } catch {
    // No hay nada que cancelar si la plataforma no soporta notificaciones.
  }
}
