const STORAGE_KEY = "icc:progreso:v1";

export interface Progreso {
  capituloActualId: string;
  fechaUltimaActividad: number;
}

export function getProgreso(): Progreso | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Progreso;
  } catch {
    return null;
  }
}

export function setCapituloActual(capituloActualId: string): void {
  const progreso: Progreso = {
    capituloActualId,
    fechaUltimaActividad: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progreso));
}
