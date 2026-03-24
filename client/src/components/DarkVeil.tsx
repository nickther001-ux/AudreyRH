import { useEffect, useRef } from "react";

type DarkVeilProps = {
  zIndex?: number;
  speed?: number;
  noiseIntensity?: number;
  warpIntensity?: number;
  className?: string;
};

export function DarkVeil({
  zIndex = 0,
  speed = 0.5,
  noiseIntensity = 0,
  warpIntensity = 0,
  className = "",
}: DarkVeilProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    let frame = 0;
    let animId: number;

    const tick = () => {
      frame += speed * 0.3;
      const a = (Math.sin(frame * 0.011) * 0.5 + 0.5) * 360;
      const b = (Math.cos(frame * 0.007) * 0.5 + 0.5) * 360;
      el.style.backgroundImage = `
        radial-gradient(ellipse 80% 60% at ${45 + Math.sin(frame * 0.008) * 10}% ${30 + Math.cos(frame * 0.006) * 8}%,
          rgba(15,23,42,0.95) 0%,
          rgba(15,23,42,0.7) 50%,
          transparent 100%
        ),
        radial-gradient(ellipse 60% 50% at ${60 + Math.cos(frame * 0.009) * 8}% ${70 + Math.sin(frame * 0.007) * 6}%,
          rgba(30,41,59,0.8) 0%,
          transparent 100%
        ),
        linear-gradient(${a}deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)
      `;
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={`absolute inset-0 ${className}`}
      style={{ zIndex }}
      aria-hidden="true"
    />
  );
}
