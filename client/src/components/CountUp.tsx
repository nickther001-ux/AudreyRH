import { useEffect, useRef } from "react";
import { useMotionValue, useTransform, animate, motion, useInView } from "framer-motion";

type CountUpProps = {
  from?: number;
  to: number;
  duration?: number;
  decimals?: number;
  className?: string;
};

export function CountUp({ from = 0, to, duration = 2, decimals, className }: CountUpProps) {
  const count = useMotionValue(from);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  const autoDecimals = decimals ?? (Number.isInteger(to) ? 0 : 1);

  const display = useTransform(count, (v) => v.toFixed(autoDecimals));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, {
      duration,
      ease: "easeOut",
    });
    return controls.stop;
  }, [inView, count, to, duration]);

  return <motion.span ref={ref} className={className}>{display}</motion.span>;
}
