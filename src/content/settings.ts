export type Tema = "claro" | "oscuro" | "automatico";
export type Fuente = "clasica" | "moderna" | "suave";
export type TamanoLetra = "pequena" | "mediana" | "grande";

export interface Configuracion {
  tema: Tema;
  fuente: Fuente;
  tamanoLetra: TamanoLetra;
  mostrarBotonMeditar: boolean;
}

export const CONFIGURACION_POR_DEFECTO: Configuracion = {
  tema: "automatico",
  fuente: "clasica",
  tamanoLetra: "mediana",
  mostrarBotonMeditar: true,
};

const STORAGE_KEY = "icc:config:v1";

export function getConfiguracion(): Configuracion {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return CONFIGURACION_POR_DEFECTO;
  try {
    return { ...CONFIGURACION_POR_DEFECTO, ...(JSON.parse(raw) as Partial<Configuracion>) };
  } catch {
    return CONFIGURACION_POR_DEFECTO;
  }
}

export function setConfiguracion(config: Configuracion): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export const FUENTES: Record<Fuente, { etiqueta: string; pila: string }> = {
  clasica: {
    etiqueta: "Clásica",
    pila: 'Georgia, "Iowan Old Style", "Palatino Linotype", serif',
  },
  moderna: {
    etiqueta: "Moderna",
    pila: 'system-ui, "Segoe UI", Roboto, sans-serif',
  },
  suave: {
    etiqueta: "Suave",
    pila: '"Trebuchet MS", Verdana, "Segoe UI", sans-serif',
  },
};

export const TAMANOS_LETRA: Record<TamanoLetra, { etiqueta: string; valor: string }> = {
  pequena: { etiqueta: "Pequeña", valor: "16px" },
  mediana: { etiqueta: "Mediana", valor: "19px" },
  grande: { etiqueta: "Grande", valor: "23px" },
};
