import { useEffect, useState } from "react";
import { estaInstalada, esIOS } from "../services/instalacion";

const CLAVE_DESCARTE = "icc:instalar-descartado:v1";
const DIAS_ESPERA_TRAS_DESCARTE = 14;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Variante = "nativo" | "ios";

function fueDescartadoRecientemente(): boolean {
  const guardado = localStorage.getItem(CLAVE_DESCARTE);
  if (!guardado) return false;
  const dias = (Date.now() - Number(guardado)) / (1000 * 60 * 60 * 24);
  return dias < DIAS_ESPERA_TRAS_DESCARTE;
}

export function useInstalarApp() {
  const [eventoDiferido, setEventoDiferido] = useState<BeforeInstallPromptEvent | null>(null);
  const [mostrar, setMostrar] = useState(false);
  const [variante, setVariante] = useState<Variante>("nativo");

  useEffect(() => {
    if (estaInstalada() || fueDescartadoRecientemente()) return;

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setEventoDiferido(e as BeforeInstallPromptEvent);
      setVariante("nativo");
      setMostrar(true);
    }

    function onAppInstalled() {
      setMostrar(false);
      setEventoDiferido(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    // iOS Safari no dispara beforeinstallprompt: no hay forma de detectar
    // instalabilidad, así que mostramos las instrucciones manuales igual.
    let temporizador: number | undefined;
    if (esIOS()) {
      temporizador = window.setTimeout(() => {
        setVariante("ios");
        setMostrar(true);
      }, 2000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
      if (temporizador) window.clearTimeout(temporizador);
    };
  }, []);

  async function instalar() {
    if (!eventoDiferido) return;
    await eventoDiferido.prompt();
    await eventoDiferido.userChoice;
    setEventoDiferido(null);
    setMostrar(false);
  }

  function descartar() {
    localStorage.setItem(CLAVE_DESCARTE, String(Date.now()));
    setMostrar(false);
  }

  return { mostrar, variante, instalar, descartar };
}
