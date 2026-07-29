import { LocalNotifications } from "@capacitor/local-notifications";

export interface RecordatorioConfig {
  minutos: number;
  titulo: string;
  cuerpo: string;
}

// Momentos de aviso por defecto. Los momentos definitivos se configurarán
// más adelante; esta lista solo deja la estructura lista para usarse.
export const RECORDATORIOS_POR_DEFECTO: RecordatorioConfig[] = [
  {
    minutos: 5,
    titulo: "Momento de meditación",
    cuerpo: "Llevás 5 minutos. Seguí en silencio con el texto.",
  },
  {
    minutos: 10,
    titulo: "Momento de meditación",
    cuerpo: "Llevás 10 minutos. ¿Qué te está diciendo este capítulo?",
  },
];

let idsProgramados: number[] = [];

export async function solicitarPermiso(): Promise<boolean> {
  const estado = await LocalNotifications.checkPermissions();
  if (estado.display === "granted") return true;
  const solicitado = await LocalNotifications.requestPermissions();
  return solicitado.display === "granted";
}

export async function iniciarSesionMeditacion(
  tituloCapitulo: string,
  recordatorios: RecordatorioConfig[] = RECORDATORIOS_POR_DEFECTO,
): Promise<void> {
  await cancelarSesionMeditacion();

  const permitido = await solicitarPermiso();
  if (!permitido) return;

  const ahora = Date.now();
  const notifications = recordatorios.map((r, i) => ({
    id: (ahora % 1_000_000) + i,
    title: r.titulo,
    body: `${tituloCapitulo} — ${r.cuerpo}`,
    schedule: { at: new Date(ahora + r.minutos * 60_000) },
  }));

  idsProgramados = notifications.map((n) => n.id);
  await LocalNotifications.schedule({ notifications });
}

export async function cancelarSesionMeditacion(): Promise<void> {
  if (idsProgramados.length === 0) return;
  await LocalNotifications.cancel({
    notifications: idsProgramados.map((id) => ({ id })),
  });
  idsProgramados = [];
}
