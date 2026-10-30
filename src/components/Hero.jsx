import { useEffect, useRef } from 'react';

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function damp(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function round(n) {
  return Math.round(n * 100) / 100;
}

/**
 * Desktop + mobile hero parallax.
 * - Layers are siblings (independent depth)
 * - Scroll smoothing is frame-rate independent
 * - Avoid opacity/animation thrash that causes blink on desktop
 */
export default function Hero({ showArrow }) {
  const stageRef = useRef(null);
  const skyRef = useRef(null);
  const cloudsBackRef = useRef(null);
  const mountainsRef = useRef(null);
  const cloudsFrontRef = useRef(null);
  const guyRef = useRef(null);
  const arrowRef = useRef(null);

  const showArrowRef = useRef(showArrow);
  const targetScroll = useRef(0);
  const smoothScroll = useRef(0);
  const targetMouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const lastTs = useRef(0);
  const reducedMotion = useRef(false);
  const lastPaint = useRef('');

  showArrowRef.current = showArrow;

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const readScroll = () => window.scrollY || window.pageYOffset || 0;

    const setTransform = (el, value) => {
      if (el && el.style.transform !== value) el.style.transform = value;
    };

    const paint = (scrollY, mx, my, isMobile) => {
      const stageH = stageRef.current?.offsetHeight || window.innerHeight || 1;
      const p = clamp(scrollY / stageH, 0, 1.2);

      const d = isMobile
        ? {
            sky: 0.08,
            clouds: 0.16,
            cloudsX: 0.04,
            mid: 0.28,
            midX: -0.08,
            front: 0.36,
            guy: 0.45,
            skyScale: 0.02,
            midScale: 0.04,
            guyScale: 0.06,
            mouse: 0,
          }
        : {
            sky: 0.05,
            clouds: 0.1,
            cloudsX: 0.06,
            mid: 0.2,
            midX: -0.22,
            front: 0.26,
            guy: 0.34,
            skyScale: 0.02,
            midScale: 0.04,
            guyScale: 0.07,
            mouse: 0.4,
          };

      const m = d.mouse;
      const skyY = round(p * stageH * d.sky);
      const cloudsY = round(p * stageH * d.clouds);
      const cloudsX = round(p * stageH * d.cloudsX + mx * 8 * m);
      const midY = round(p * stageH * d.mid + my * 4 * m);
      const midX = round(p * stageH * d.midX + mx * 10 * m);
      const frontY = round(p * stageH * d.front);
      const guyY = round(p * stageH * d.guy + my * 5 * m);
      const guyX = round(mx * 12 * m);

      const skyScale = round(1 + p * d.skyScale);
      const midScale = round(1 + p * d.midScale);
      const guyScale = round(1 + p * d.guyScale);
      const arrowFade = showArrowRef.current
        ? round(clamp(1 - p * 2.1, 0, 1))
        : 0;

      const key = [
        skyY, cloudsY, cloudsX, midY, midX, frontY, guyY, guyX,
        skyScale, midScale, guyScale, arrowFade,
      ].join('|');
      if (key === lastPaint.current) return;
      lastPaint.current = key;

      setTransform(
        skyRef.current,
        `translate3d(0, ${skyY}px, 0) scale(${skyScale})`,
      );
      setTransform(
        cloudsBackRef.current,
        `translate3d(${cloudsX}px, ${cloudsY}px, 0)`,
      );
      setTransform(
        mountainsRef.current,
        `translate3d(${midX}px, ${midY}px, 0) scale(${midScale})`,
      );
      setTransform(
        cloudsFrontRef.current,
        `translate3d(${round(mx * 10 * m)}px, ${frontY}px, 0)`,
      );
      setTransform(
        guyRef.current,
        `translate3d(${guyX}px, ${guyY}px, 0) scale(${guyScale})`,
      );

      if (arrowRef.current) {
        if (arrowRef.current.style.opacity !== String(arrowFade)) {
          arrowRef.current.style.opacity = String(arrowFade);
        }
        arrowRef.current.style.pointerEvents = arrowFade < 0.08 ? 'none' : 'auto';
      }
    };

    const tick = (ts) => {
      const prev = lastTs.current || ts;
      const dt = clamp((ts - prev) / 1000, 0.001, 0.049);
      lastTs.current = ts;

      const isMobile = window.innerWidth < 992;
      const scrollLambda = reducedMotion.current ? 50 : isMobile ? 16 : 13;
      const mouseLambda = reducedMotion.current ? 50 : 8;

      targetScroll.current = readScroll();
      smoothScroll.current = damp(
        smoothScroll.current,
        targetScroll.current,
        scrollLambda,
        dt,
      );
      smoothMouse.current = {
        x: damp(smoothMouse.current.x, targetMouse.current.x, mouseLambda, dt),
        y: damp(smoothMouse.current.y, targetMouse.current.y, mouseLambda, dt),
      };

      const mx = reducedMotion.current || isMobile ? 0 : smoothMouse.current.x;
      const my = reducedMotion.current || isMobile ? 0 : smoothMouse.current.y;

      paint(smoothScroll.current, mx, my, isMobile);

      // Pause loop when far past hero and settled (saves CPU)
      const stageH = stageRef.current?.offsetHeight || window.innerHeight || 1;
      const settled =
        Math.abs(smoothScroll.current - targetScroll.current) < 0.4 &&
        Math.abs(smoothMouse.current.x) < 0.01 &&
        Math.abs(smoothMouse.current.y) < 0.01;
      const farPast = targetScroll.current > stageH * 1.35;

      if (farPast && settled) {
        rafRef.current = 0;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const ensureLoop = () => {
      if (!rafRef.current) {
        lastTs.current = 0;
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    targetScroll.current = readScroll();
    smoothScroll.current = targetScroll.current;
    lastTs.current = 0;
    rafRef.current = requestAnimationFrame(tick);

    const onScroll = () => {
      targetScroll.current = readScroll();
      ensureLoop();
    };

    const onPointerMove = (e) => {
      if (reducedMotion.current || window.innerWidth < 992) return;
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      if (e.clientY > rect.bottom || e.clientY < rect.top) {
        targetMouse.current = { x: 0, y: 0 };
        return;
      }
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.5;
      targetMouse.current = {
        x: clamp((e.clientX - cx) / (rect.width * 0.5), -1, 1) * 0.5,
        y: clamp((e.clientY - cy) / (rect.height * 0.5), -1, 1) * 0.5,
      };
      ensureLoop();
    };

    const onPointerLeave = () => {
      targetMouse.current = { x: 0, y: 0 };
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollNext = () => {
    const next = document.querySelector('.first');
    const targetY = next
      ? next.getBoundingClientRect().top + window.scrollY - 40
      : window.innerHeight;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <div ref={stageRef} className="container-fluid vh-100 px-0 hero-stage">
      <div className="flexbox hero-stage__frame">
        <div ref={skyRef} className="background_0 index0 hero-stage__layer" />
        <div
          ref={cloudsBackRef}
          className="background_clouds2 index1 hero-stage__layer"
        />
        <div
          ref={mountainsRef}
          className="background_3 index2 hero-stage__layer"
        />
        <div
          ref={cloudsFrontRef}
          className="clouds index3 hero-stage__layer hero-stage__clouds"
        />
        <div ref={guyRef} className="background_guy index4 hero-stage__layer" />

        <button
          ref={arrowRef}
          type="button"
          className="arrow index6 hero-stage__arrow"
          style={{ display: showArrow ? undefined : 'none' }}
          onClick={scrollNext}
          aria-label="Scroll to explore"
        >
          <span className="hero-stage__chevron" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>
    </div>
  );
}
