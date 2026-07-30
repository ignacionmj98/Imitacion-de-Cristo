export function estaEnPantallaCompleta(): boolean {
  return document.fullscreenElement != null;
}

export function soportaPantallaCompleta(): boolean {
  return typeof document.documentElement.requestFullscreen === "function";
}

export async function alternarPantallaCompleta(): Promise<void> {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
  } else {
    await document.documentElement.requestFullscreen();
  }
}
