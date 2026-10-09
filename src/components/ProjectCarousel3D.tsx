import { useEffect, useRef, useState } from "react";

interface Props {
  images: string[];
  title: string;
}

/** 3D ring carousel with continuous 360° auto-rotation, pause on hover and drag to spin. */
const ProjectCarousel3D = ({ images, title }: Props) => {
  const [angle, setAngle] = useState(0);
  const paused = useRef(false);
  const drag = useRef<{ x: number; a: number } | null>(null);

  const list = images.length ? images : ["/placeholder.svg"];
  const single = list.length === 1;
  const step = 360 / list.length;
  const radius = Math.round(220 / (2 * Math.tan(Math.PI / Math.max(list.length, 3))));

  useEffect(() => {
    if (single) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      if (!paused.current && !drag.current) setAngle((a) => a - dt * 0.018);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [single]);

  if (single) {
    return (
      <div className="relative h-64 md:h-80 flex items-center justify-center [perspective:1000px]">
        <img
          src={list[0]}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover rounded-xl border border-primary/30 shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.4)] transition-transform duration-700 [transform:rotateY(-8deg)_rotateX(4deg)] hover:[transform:rotateY(0)_rotateX(0)]"
        />
      </div>
    );
  }

  return (
    <div
      className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden select-none cursor-grab active:cursor-grabbing [perspective:1000px] touch-pan-y"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => { paused.current = false; drag.current = null; }}
      onPointerDown={(e) => { drag.current = { x: e.clientX, a: angle }; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); }}
      onPointerMove={(e) => { if (drag.current) setAngle(drag.current.a + (e.clientX - drag.current.x) * 0.4); }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
      aria-label={`Galeria 3D de ${title}`}
    >
      <div
        className="relative w-[220px] h-[140px] md:w-[260px] md:h-[165px] [transform-style:preserve-3d]"
        style={{ transform: `translateZ(-${radius}px) rotateY(${angle}deg)` }}
      >
        {list.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt={`${title} — imagem ${i + 1}`}
            draggable={false}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover rounded-lg border border-primary/40 bg-card shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.5)] [backface-visibility:hidden]"
            style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default ProjectCarousel3D;
