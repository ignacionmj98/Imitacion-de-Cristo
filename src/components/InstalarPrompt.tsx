import { useEffect, useRef } from "react";
import { useInstalarApp } from "../hooks/useInstalarApp";

export function InstalarPrompt() {
  const { mostrar, variante, instalar, descartar } = useInstalarApp();
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mostrar) {
      document.body.style.paddingTop = "";
      return;
    }
    document.body.style.paddingTop = `${bannerRef.current?.offsetHeight ?? 0}px`;
    return () => {
      document.body.style.paddingTop = "";
    };
  }, [mostrar]);

  if (!mostrar) return null;

  return (
    <div className="instalar-banner" ref={bannerRef} role="dialog" aria-label="Instalar la aplicación">
      <img
        src={`${import.meta.env.BASE_URL}pwa-192x192.png`}
        alt=""
        className="instalar-banner__icono"
      />
      <div className="instalar-banner__texto">
        <strong>Instalar Imitación de Cristo</strong>
        {variante === "ios" ? (
          <span>
            Tocá <strong>Compartir</strong> y luego <strong>Agregar a inicio</strong> para acceder directo.
          </span>
        ) : (
          <span>Agregala a tu pantalla de inicio para acceder directo, sin el navegador.</span>
        )}
      </div>
      <div className="instalar-banner__acciones">
        {variante === "nativo" && (
          <button className="instalar-banner__instalar" onClick={instalar}>
            Instalar
          </button>
        )}
        <button
          className="instalar-banner__cerrar"
          onClick={descartar}
          aria-label="Cerrar aviso de instalación"
          title="Cerrar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
