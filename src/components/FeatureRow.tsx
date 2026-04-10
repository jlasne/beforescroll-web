"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  index: number;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  reverse?: boolean;
};

export default function FeatureRow({
  index,
  eyebrow,
  title,
  body,
  image,
  alt,
  reverse = false,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const visibleClass = visible ? "is-visible" : "";

  return (
    <div
      ref={rootRef}
      className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${
        reverse ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div
        className={`reveal ${reverse ? "reveal-from-right" : "reveal-from-left"} ${visibleClass} flex justify-center`}
      >
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-6 md:-inset-10 bg-[radial-gradient(ellipse_at_center,_rgba(196,168,130,0.35)_0%,_transparent_70%)] blur-2xl"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={alt}
            loading={index === 0 ? "eager" : "lazy"}
            className="relative w-[260px] sm:w-[300px] md:w-[340px] h-auto rounded-[2rem] shadow-2xl ring-1 ring-black/5"
          />
        </div>
      </div>

      <div
        className={`reveal ${reverse ? "reveal-from-left" : "reveal-from-right"} reveal-delay-100 ${visibleClass} text-center md:text-left`}
      >
        <p className="text-accent font-semibold text-xs tracking-widest uppercase mb-3">
          {eyebrow}
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
          {title}
        </h2>
        <p className="text-muted text-lg md:text-xl leading-relaxed max-w-xl mx-auto md:mx-0">
          {body}
        </p>
      </div>
    </div>
  );
}
