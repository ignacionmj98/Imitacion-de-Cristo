import { useEffect, useState } from "react";
import {
  type Configuracion,
  FUENTES,
  TAMANOS_LETRA,
  getConfiguracion,
  setConfiguracion,
} from "../content/settings";

export function useConfiguracion() {
  const [config, setConfigState] = useState<Configuracion>(getConfiguracion);

  useEffect(() => {
    const root = document.documentElement;

    if (config.tema === "automatico") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", config.tema === "oscuro" ? "dark" : "light");
    }

    root.style.setProperty("--fuente-lectura", FUENTES[config.fuente].pila);
    root.style.setProperty("--tamano-base", TAMANOS_LETRA[config.tamanoLetra].valor);

    setConfiguracion(config);
  }, [config]);

  return [config, setConfigState] as const;
}
