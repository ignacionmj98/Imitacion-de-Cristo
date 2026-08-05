import { Capacitor } from "@capacitor/core";

export function estaInstalada(): boolean {
  if (Capacitor.isNativePlatform()) return true;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  if ((window.navigator as unknown as { standalone?: boolean }).standalone === true) return true;
  return false;
}

export function esIOS(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}
