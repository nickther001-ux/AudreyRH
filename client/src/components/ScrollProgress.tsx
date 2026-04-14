import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        height: "3px",
        width: `${progress}%`,
        background: "linear-gradient(90deg, #239b56 0%, #1e3a5f 60%, #3b82f6 100%)",
        transition: "width 0.08s linear",
        pointerEvents: "none",
        boxShadow: "0 0 8px rgba(35,155,86,0.5)",
      }}
    />
  );
}
