import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  format?: (n: number) => string;
  className?: string;
}

export function AnimatedNumber({ value, format, className }: AnimatedNumberProps) {
  const spring = useSpring(0, { duration: 300, bounce: 0 });
  const display = useTransform(spring, (v) => format ? format(v) : Math.round(v).toLocaleString());
  const [text, setText] = useState(format ? format(value) : value.toLocaleString());
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    spring.set(value);
    const unsub = display.on("change", (v) => setText(v));
    return unsub;
  }, [value, spring, display]);

  return <span className={className}>{text}</span>;
}
