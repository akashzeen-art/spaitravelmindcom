import { useEffect, useMemo, useRef, useState } from 'react';

const HOLD_MS = 4300;
const EXIT_MS = 700;
const TOTAL_MS = HOLD_MS + EXIT_MS;

const DESTINATIONS = [
  'Paris',
  'Delhi',
  'Dubai',
  'Rio',
  'Sydney',
  'Istanbul',
  'Amsterdam',
  'Bangkok',
];

const PINS = [
  { city: 'Paris', angle: -12 },
  { city: 'Delhi', angle: 38 },
  { city: 'Dubai', angle: 82 },
  { city: 'Rio', angle: 128 },
  { city: 'Sydney', angle: 168 },
  { city: 'Istanbul', angle: 214 },
  { city: 'Amsterdam', angle: 258 },
  { city: 'Bangkok', angle: 304 },
];

const METEORS = [
  { delay: '0.6s', top: '12%', duration: '1.8s' },
  { delay: '1.9s', top: '28%', duration: '2.1s' },
  { delay: '3.2s', top: '18%', duration: '1.6s' },
];

function makeDust(count) {
  return Array.from({ length: count }, (_, i) => {
    const seed = (i * 73 + 19) % 997;
    return {
      id: i,
      left: `${seed % 100}%`,
      top: `${(seed * 3) % 100}%`,
      size: 1 + (seed % 4),
      delay: `${(seed % 24) / 10}s`,
      duration: `${7 + (seed % 10)}s`,
      hue: seed % 3,
    };
  });
}

function runStarfield(canvas, reduced) {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return () => {};

  const stars = [];
  const started = performance.now();
  let width = 0;
  let height = 0;
  let raf = 0;
  let running = true;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#02040a';
    ctx.fillRect(0, 0, width, height);
  };

  const spawn = (count) => {
    stars.length = 0;
    for (let i = 0; i < count; i += 1) {
      stars.push({
        x: (Math.random() - 0.5) * width,
        y: (Math.random() - 0.5) * height,
        z: Math.random() * width,
        pz: 0,
        shade: Math.random() > 0.78 ? 'gold' : Math.random() > 0.55 ? 'cyan' : 'white',
      });
    }
  };

  const paint = (now) => {
    if (!running) return;
    const elapsed = (now - started) / 1000;
    const warp = reduced ? 0.12 : Math.max(0.14, 2.8 * Math.exp(-elapsed * 1.15) + 0.16);

    ctx.fillStyle = 'rgba(3, 6, 14, 0.42)';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height * 0.42;

    for (const star of stars) {
      star.pz = star.z;
      star.z -= warp * 18;
      if (star.z < 1) {
        star.x = (Math.random() - 0.5) * width;
        star.y = (Math.random() - 0.5) * height;
        star.z = width;
        star.pz = star.z;
      }

      const k = 180 / star.z;
      const px = cx + star.x * k;
      const py = cy + star.y * k;
      const pk = 180 / star.pz;
      const ox = cx + star.x * pk;
      const oy = cy + star.y * pk;
      const size = Math.max(0.4, (1 - star.z / width) * 2.6);

      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(px, py);
      ctx.lineWidth = size;
      ctx.lineCap = 'round';
      ctx.strokeStyle =
        star.shade === 'gold'
          ? 'rgba(231, 223, 163, 0.95)'
          : star.shade === 'cyan'
            ? 'rgba(151, 201, 217, 0.9)'
            : 'rgba(246, 241, 232, 0.92)';
      ctx.stroke();
    }

    raf = requestAnimationFrame(paint);
  };

  resize();
  spawn(reduced ? 40 : 180);
  window.addEventListener('resize', resize);
  raf = requestAnimationFrame(paint);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
  };
}

export default function Preloader({ onDone }) {
  const canvasRef = useRef(null);
  const dust = useMemo(() => makeDust(28), []);
  const [progress, setProgress] = useState(0);
  const [placeIndex, setPlaceIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const leavingRef = useRef(false);
  const doneRef = useRef(false);
  const skipRef = useRef(() => {});

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stopStars = canvasRef.current ? runStarfield(canvasRef.current, reduced) : () => {};
    const hold = reduced ? 900 : HOLD_MS;
    const total = reduced ? 1400 : TOTAL_MS;
    const started = performance.now();
    let finishAt = started + total;
    let raf = 0;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      document.body.classList.remove('is-preloading');
      onDone?.();
    };

    const beginExit = () => {
      if (leavingRef.current) return;
      leavingRef.current = true;
      setLeaving(true);
      setProgress(1);
      finishAt = Math.min(finishAt, performance.now() + EXIT_MS);
    };
    skipRef.current = beginExit;

    document.body.classList.add('is-preloading');

    const tick = (now) => {
      const t = Math.min(1, (now - started) / Math.max(finishAt - started, 1));
      if (!leavingRef.current) setProgress(t);
      if (now - started >= hold) beginExit();
      if (now >= finishAt) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const places = window.setInterval(() => {
      setPlaceIndex((i) => (i + 1) % DESTINATIONS.length);
    }, reduced ? 400 : 520);

    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') beginExit();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      stopStars();
      cancelAnimationFrame(raf);
      window.clearInterval(places);
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-preloading');
    };
  }, [onDone]);

  return (
    <div
      className={`tx-preloader${leaving ? ' is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Trip XAI está preparando tu viaje"
    >
      <canvas ref={canvasRef} className="tx-preloader__starfield" aria-hidden="true" />
      <div className="tx-preloader__sky" />
      <div className="tx-preloader__nebula tx-preloader__nebula--violet" />
      <div className="tx-preloader__nebula tx-preloader__nebula--gold" />
      <div className="tx-preloader__nebula tx-preloader__nebula--cyan" />
      <div className="tx-preloader__milkyway" />
      <div className="tx-preloader__dust" aria-hidden="true">
        {dust.map((speck) => (
          <span
            key={speck.id}
            className={`tx-preloader__speck tx-preloader__speck--${speck.hue}`}
            style={{
              left: speck.left,
              top: speck.top,
              width: speck.size,
              height: speck.size,
              animationDelay: speck.delay,
              animationDuration: speck.duration,
            }}
          />
        ))}
      </div>
      {METEORS.map((meteor) => (
        <span
          key={meteor.delay}
          className="tx-preloader__meteor"
          style={{
            top: meteor.top,
            animationDelay: meteor.delay,
            animationDuration: meteor.duration,
          }}
        />
      ))}
      <div className="tx-preloader__clouds tx-preloader__clouds--back" />
      <div className="tx-preloader__mountains" />
      <div className="tx-preloader__clouds tx-preloader__clouds--front" />
      <div className="tx-preloader__vignette" />

      <div className="tx-preloader__stage">
        <div className="tx-preloader__orbit" aria-hidden="true">
          <span className="tx-preloader__halo" />
          <span className="tx-preloader__planet" />
          <span className="tx-preloader__ring tx-preloader__ring--outer" />
          <span className="tx-preloader__ring tx-preloader__ring--mid" />
          <span className="tx-preloader__ring tx-preloader__ring--inner" />
          {PINS.map((pin) => (
            <span
              key={pin.city}
              className="tx-preloader__pin"
              style={{ '--pin-angle': `${pin.angle}deg` }}
              title={pin.city}
            >
              <span className="tx-preloader__pin-dot" />
            </span>
          ))}
          <div className="tx-preloader__mark">
            <img src="/images/logo.png" alt="" />
          </div>
        </div>

        <p className="tx-preloader__kicker">Trip XAI</p>
        <h1 className="tx-preloader__title">Tu viaje comienza</h1>
        <p className="tx-preloader__place">{DESTINATIONS[placeIndex]}</p>
        <p className="tx-preloader__tagline">Guías de viaje con IA · ciudades · idiomas</p>

        <div
          className="tx-preloader__track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-label="Cargando"
        >
          <span className="tx-preloader__fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <button
          type="button"
          className="tx-preloader__skip"
          onClick={() => skipRef.current()}
        >
          Saltar intro
        </button>
      </div>
    </div>
  );
}
