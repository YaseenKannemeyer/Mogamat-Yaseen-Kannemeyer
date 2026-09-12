import { useEffect, useRef, useState } from "react";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * True only while the element is on screen, the tab is visible, and the user
 * has not asked for reduced motion. Use it to gate requestAnimationFrame loops
 * so they cost nothing when nobody can see them.
 */
export function useActiveWhenVisible<T extends Element>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;

    let onScreen = false;

    const sync = () => setActive(onScreen && !document.hidden);

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin, threshold: 0 },
    );
    observer.observe(el);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [rootMargin]);

  return [ref, active] as const;
}
