"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/site";
import { formatPrice } from "@/lib/products";
import {
  CDN,
  TRY_ON_METALS,
  TRY_ON_PRODUCTS,
  isTryOnSupported,
  metalIndexOf,
} from "@/lib/tryOn";
import { ShareModal } from "./ShareModal";

/**
 * Native dynamic import that bundlers won't rewrite — loads the ESM builds of
 * Three.js + MediaPipe directly from CDN at runtime. Only ever runs in the
 * browser (this component is mounted with ssr:false).
 */
// eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
const cdnImport = new Function("u", "return import(u)") as (
  u: string
) => Promise<any>;

type Phase =
  | "checking"
  | "loading-models"
  | "requesting-camera"
  | "ready"
  | "needs-tap"
  | "unsupported"
  | "error";

/* Tuning constants (no live build to verify — generous clamps). */
const FINGER_DIAMETER_FRACTION = 0.46; // ring outer Ø as a fraction of palm width
const RING_TILT_X = 1.15; // radians — perspective tilt of the band
const TORUS_OUTER = 0.68; // geometry outer radius (R 0.5 + tube 0.18)

export function TryOnExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);

  // Runtime libraries + objects (kept in refs to survive re-renders).
  const threeRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const ringRef = useRef<any>(null);
  const materialRef = useRef<any>(null);
  const landmarkerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const lastDetectRef = useRef<number>(0);
  const lastVideoTimeRef = useRef<number>(-1);
  const handVisibleRef = useRef<boolean>(false);
  const mirrorRef = useRef<boolean>(false);

  const [phase, setPhase] = useState<Phase>("checking");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [mirror, setMirror] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [metalIndex, setMetalIndex] = useState(0);
  const [flash, setFlash] = useState(false);
  const [capture, setCapture] = useState<{ url: string; name: string; href: string } | null>(null);

  const product = TRY_ON_PRODUCTS[activeIndex];

  /* ---- Lock scroll while the experience is open ---- */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* ---- Recolour ring when the metal changes ---- */
  useEffect(() => {
    const THREE = threeRef.current;
    if (THREE && materialRef.current) {
      materialRef.current.color.set(TRY_ON_METALS[metalIndex].hex);
    }
  }, [metalIndex]);

  /* ---- When the active product changes, default to its metal ---- */
  useEffect(() => {
    if (product) setMetalIndex(metalIndexOf(product.metal));
  }, [product]);

  /* ---- Position / scale / orient the ring from hand landmarks ---- */
  const placeRing = useCallback((landmarks: Array<{ x: number; y: number; z: number }>) => {
    const THREE = threeRef.current;
    const ring = ringRef.current;
    const camera = cameraRef.current;
    const container = containerRef.current;
    const video = videoRef.current;
    if (!THREE || !ring || !camera || !container || !video) return;

    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const vw = video.videoWidth || cw;
    const vh = video.videoHeight || ch;

    // Map normalized landmark → on-screen pixel under object-fit: cover.
    const coverScale = Math.max(cw / vw, ch / vh);
    const dispW = vw * coverScale;
    const dispH = vh * coverScale;
    const offX = (cw - dispW) / 2;
    const offY = (ch - dispH) / 2;
    const toPx = (p: { x: number; y: number }) => {
      let px = p.x * vw * coverScale + offX;
      const py = p.y * vh * coverScale + offY;
      if (mirrorRef.current) px = cw - px;
      return { px, py };
    };
    const toNdc = (px: number, py: number) => ({
      x: (px / cw) * 2 - 1,
      y: -((py / ch) * 2 - 1),
    });

    const mcp = toPx(landmarks[13]); // ring-finger base (proximal phalanx start)
    const pip = toPx(landmarks[14]); // ring-finger first knuckle
    const idx = toPx(landmarks[5]);
    const pinky = toPx(landmarks[17]);

    // Anchor a little above the MCP, along the proximal phalanx.
    const anchorPx = mcp.px * 0.55 + pip.px * 0.45;
    const anchorPy = mcp.py * 0.55 + pip.py * 0.45;
    const a = toNdc(anchorPx, anchorPy);

    // Unproject the screen point onto the z = 0 plane.
    const v = new THREE.Vector3(a.x, a.y, 0.5).unproject(camera);
    const dir = v.sub(camera.position).clone().normalize();
    const dist = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(dist));
    ring.position.copy(pos);

    // Scale from palm width (index MCP → pinky MCP), converted to world units.
    const palmPx = Math.hypot(idx.px - pinky.px, idx.py - pinky.py);
    const fov = (camera.fov * Math.PI) / 180;
    const worldH = 2 * Math.tan(fov / 2) * Math.abs(camera.position.z);
    const palmWorld = (palmPx / ch) * worldH;
    const targetOuter = (palmWorld * FINGER_DIAMETER_FRACTION) / 2;
    const scale = THREE.MathUtils.clamp(targetOuter / TORUS_OUTER, 0.05, 1.6);
    ring.scale.setScalar(scale);

    // Orient: align the band's ellipse with the finger's screen angle.
    const an = toNdc(mcp.px, mcp.py);
    const bn = toNdc(pip.px, pip.py);
    const angle = Math.atan2(bn.y - an.y, bn.x - an.x);
    ring.rotation.set(RING_TILT_X, 0, angle - Math.PI / 2);
  }, []);

  /* ---- Set up the Three.js scene over the camera canvas ---- */
  const setupThree = useCallback((THREE: any) => {
    const canvas = glCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true, // needed to read pixels for capture
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    // Lighting — strong key + fill so the metal reads without an env map.
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(2, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xfff2cc, 1.0);
    rim.position.set(-3, -1, 2);
    scene.add(rim);
    const fill = new THREE.PointLight(0xffffff, 0.8);
    fill.position.set(0, 0, 6);
    scene.add(fill);

    const geometry = new THREE.TorusGeometry(0.5, 0.18, 28, 80);
    const material = new THREE.MeshStandardMaterial({
      color: TRY_ON_METALS[metalIndexOf(product?.metal ?? "Yellow Gold")].hex,
      metalness: 0.95,
      roughness: 0.32,
    });
    const ring = new THREE.Mesh(geometry, material);
    ring.visible = false;
    scene.add(ring);

    threeRef.current = THREE;
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    ringRef.current = ring;
    materialRef.current = material;

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return ro;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- Render / detect loop (~30fps detection, rAF render) ---- */
  const startLoop = useCallback(() => {
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const ring = ringRef.current;
      const landmarker = landmarkerRef.current;
      const video = videoRef.current;
      if (!renderer || !scene || !camera || !video) return;
      if (video.readyState < 2) return;

      const now = performance.now();
      const shouldDetect =
        now - lastDetectRef.current >= 32 && video.currentTime !== lastVideoTimeRef.current;

      if (shouldDetect && landmarker) {
        lastDetectRef.current = now;
        lastVideoTimeRef.current = video.currentTime;
        try {
          const result = landmarker.detectForVideo(video, now);
          const hand = result?.landmarks?.[0];
          if (hand && hand.length >= 21) {
            placeRing(hand);
            if (ring) ring.visible = true;
            if (!handVisibleRef.current) {
              handVisibleRef.current = true;
              setHandDetected(true);
            }
          } else {
            if (ring) ring.visible = false;
            if (handVisibleRef.current) {
              handVisibleRef.current = false;
              setHandDetected(false);
            }
          }
        } catch {
          /* transient detect error — skip this frame */
        }
      }

      renderer.render(scene, camera);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [placeRing]);

  /* ---- Boot: load models, open camera, start ---- */
  useEffect(() => {
    let cancelled = false;
    let observer: ResizeObserver | undefined;

    const boot = async () => {
      if (!isTryOnSupported()) {
        setPhase("unsupported");
        return;
      }
      try {
        setPhase("loading-models");

        // MediaPipe Hand Landmarker
        const vision = await cdnImport(CDN.visionModule);
        const fileset = await vision.FilesetResolver.forVisionTasks(CDN.visionWasm);
        const makeLandmarker = (delegate: "GPU" | "CPU") =>
          vision.HandLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: CDN.handModel, delegate },
            runningMode: "VIDEO",
            numHands: 1,
          });
        let landmarker: any;
        try {
          landmarker = await makeLandmarker("GPU");
        } catch {
          landmarker = await makeLandmarker("CPU");
        }
        if (cancelled) {
          landmarker?.close?.();
          return;
        }
        landmarkerRef.current = landmarker;

        // Three.js
        const THREE = await cdnImport(CDN.three);
        if (cancelled) return;
        observer = setupThree(THREE);

        // Camera
        setPhase("requesting-camera");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

        // Mirror only for the front ("user") camera.
        const facing = stream.getVideoTracks()[0]?.getSettings().facingMode;
        const isFront = facing === "user" || facing === undefined;
        mirrorRef.current = isFront;
        setMirror(isFront);

        const video = videoRef.current!;
        video.srcObject = stream;
        try {
          await video.play();
        } catch {
          setPhase("needs-tap");
          return;
        }

        setPhase("ready");
        startLoop();
      } catch (err: any) {
        if (cancelled) return;
        setErrorMsg(err?.name === "NotAllowedError" ? "Camera permission was declined." : String(err?.message || err));
        setPhase("error");
      }
    };

    boot();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      observer?.disconnect();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      try {
        landmarkerRef.current?.close?.();
      } catch {
        /* noop */
      }
      try {
        rendererRef.current?.dispose?.();
      } catch {
        /* noop */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- Resume after a tap (iOS autoplay guard) ---- */
  const resumeAfterTap = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
      setPhase("ready");
      startLoop();
    } catch {
      setErrorMsg("Could not start the camera preview.");
      setPhase("error");
    }
  };

  /* ---- Capture: composite video + ring + watermark ---- */
  const onCapture = useCallback(() => {
    const video = videoRef.current;
    const gl = glCanvasRef.current;
    if (!video || !gl) return;

    const w = gl.width;
    const h = gl.height;
    const out = document.createElement("canvas");
    out.width = w;
    out.height = h;
    const ctx = out.getContext("2d");
    if (!ctx) return;

    // 1) Camera frame (object-fit: cover), mirrored to match the display.
    const vw = video.videoWidth || w;
    const vh = video.videoHeight || h;
    const coverScale = Math.max(w / vw, h / vh);
    const dw = vw * coverScale;
    const dh = vh * coverScale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    ctx.save();
    if (mirrorRef.current) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, dx, dy, dw, dh);
    ctx.restore();

    // 2) The 3D ring layer.
    ctx.drawImage(gl, 0, 0, w, h);

    // 3) Watermark.
    const grad = ctx.createLinearGradient(0, h * 0.68, 0, h);
    grad.addColorStop(0, "rgba(10,10,9,0)");
    grad.addColorStop(1, "rgba(10,10,9,0.6)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, h * 0.68, w, h * 0.32);
    ctx.fillStyle = "rgba(249,246,240,0.96)";
    ctx.font = `600 ${Math.round(h * 0.042)}px Georgia, 'Times New Roman', serif`;
    ctx.fillText("◆ LUMIÈRE", w * 0.05, h * 0.92);
    ctx.fillStyle = "rgba(249,246,240,0.8)";
    ctx.font = `400 ${Math.round(h * 0.024)}px Georgia, serif`;
    ctx.fillText(`${product.name} · Lab-Grown Diamonds`, w * 0.05, h * 0.955);

    const url = out.toDataURL("image/png");
    setFlash(true);
    window.setTimeout(() => setFlash(false), 180);
    setCapture({ url, name: product.name, href: `/shop/rings/${product.slug}` });
  }, [product]);

  const consultUrl = buildWhatsAppUrl(
    "Hello Lumière — I'd like to book an in-person try-on consultation."
  );

  const showLoading = phase === "loading-models" || phase === "requesting-camera" || phase === "checking";

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] overflow-hidden bg-obsidian">
      {/* Camera + 3D layers (always mounted so refs exist) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: mirror ? "scaleX(-1)" : "none" }}
      />
      <canvas ref={glCanvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* Capture flash */}
      {flash && <div className="absolute inset-0 z-[110] bg-white" />}

      {/* Top bar */}
      {(phase === "ready" || phase === "needs-tap") && (
        <div className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4">
          <span className="flex items-baseline gap-2 text-ivory drop-shadow">
            <span className="text-gold">◆</span>
            <span className="font-display text-h3 tracking-[0.28em]">LUMIÈRE</span>
          </span>
          <Link
            href="/"
            className="rounded-full bg-obsidian/50 px-5 py-2 font-mono text-caption uppercase tracking-[0.16em] text-ivory backdrop-blur transition-colors hover:bg-obsidian/80"
          >
            Exit ✕
          </Link>
        </div>
      )}

      {/* "Raise your hand" hint */}
      {phase === "ready" && !handDetected && (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-40 -translate-y-1/2 text-center">
          <p className="mx-auto inline-block rounded-full bg-obsidian/45 px-5 py-2 font-mono text-caption uppercase tracking-[0.16em] text-ivory backdrop-blur">
            Raise your hand into view
          </p>
        </div>
      )}

      {/* Tap-to-start (iOS autoplay) */}
      {phase === "needs-tap" && (
        <button
          type="button"
          onClick={resumeAfterTap}
          className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-obsidian/70 text-ivory"
        >
          <span className="text-4xl text-gold">◆</span>
          <span className="font-mono text-caption uppercase tracking-[0.2em]">Tap to start the camera</span>
        </button>
      )}

      {/* Loading screen */}
      {showLoading && <LoadingScreen phase={phase} />}

      {/* Unsupported / error */}
      {(phase === "unsupported" || phase === "error") && (
        <Fallback
          title={phase === "unsupported" ? "Try-On not available" : "Something interrupted the camera"}
          message={
            phase === "unsupported"
              ? "Your browser doesn't support the live try-on. It works best on iOS Safari 16+ and Android Chrome 110+. We'd love to show you in person instead."
              : errorMsg || "Please check camera permissions and try again."
          }
          consultUrl={consultUrl}
        />
      )}

      {/* Controls (ready) */}
      {phase === "ready" && (
        <>
          {/* Desktop product panel */}
          <aside className="absolute right-5 top-1/2 z-50 hidden w-[320px] -translate-y-1/2 lg:block">
            <DetailsPanel
              product={product}
              metalIndex={metalIndex}
              onMetal={setMetalIndex}
            />
          </aside>

          {/* Shutter + share */}
          <div className="absolute inset-x-0 bottom-[112px] z-50 flex items-center justify-center gap-6 sm:bottom-[120px]">
            <button
              type="button"
              onClick={onCapture}
              aria-label="Capture"
              className="grid h-16 w-16 place-items-center rounded-full border-[3px] border-ivory bg-ivory/20 backdrop-blur transition-transform active:scale-95"
            >
              <span className="h-12 w-12 rounded-full bg-ivory" />
            </button>
          </div>

          {/* Mobile details bar */}
          <div className="absolute inset-x-0 bottom-[76px] z-40 px-4 lg:hidden">
            <MobileDetails
              product={product}
              metalIndex={metalIndex}
              onMetal={setMetalIndex}
            />
          </div>

          {/* Product switcher */}
          <div className="absolute inset-x-0 bottom-0 z-50 bg-gradient-to-t from-obsidian/80 to-transparent">
            <ProductStrip activeIndex={activeIndex} onSelect={setActiveIndex} metalIndex={metalIndex} />
          </div>
        </>
      )}

      {/* Share modal */}
      {capture && (
        <ShareModal
          image={capture.url}
          productName={capture.name}
          productHref={capture.href}
          onClose={() => setCapture(null)}
        />
      )}
    </div>
  );
}

/* ---------------- Sub-components ---------------- */

function LoadingScreen({ phase }: { phase: Phase }) {
  const label =
    phase === "requesting-camera"
      ? "Requesting camera…"
      : phase === "loading-models"
      ? "Warming up the atelier mirror…"
      : "Preparing…";
  return (
    <div className="absolute inset-0 z-[90] flex flex-col items-center justify-center gap-6 bg-obsidian text-ivory">
      <span className="animate-pulse text-4xl text-gold">◆</span>
      <span className="font-display text-h3 tracking-[0.28em]">LUMIÈRE</span>
      <div className="h-px w-40 overflow-hidden bg-ivory/20">
        <span className="block h-full w-1/2 animate-[loadbar_1.2s_ease-in-out_infinite] bg-gold" />
      </div>
      <span className="font-mono text-caption uppercase tracking-[0.18em] text-ivory/70">{label}</span>
      <style>{`@keyframes loadbar{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
    </div>
  );
}

function Fallback({
  title,
  message,
  consultUrl,
}: {
  title: string;
  message: string;
  consultUrl: string;
}) {
  return (
    <div className="absolute inset-0 z-[90] flex items-center justify-center bg-ivory px-6">
      <div className="max-w-md text-center">
        <span className="text-3xl text-gold">◆</span>
        <h1 className="mt-5 font-display text-h2 text-obsidian">{title}</h1>
        <p className="mx-auto mt-4 max-w-sm font-sans text-body text-carbon">{message}</p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href={consultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-button bg-obsidian px-8 py-3.5 font-mono text-caption uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold"
          >
            Book an In-Person Consultation
          </a>
          <Link
            href="/shop/rings"
            className="font-mono text-caption uppercase tracking-[0.18em] text-carbon link-underline hover:text-obsidian"
          >
            Browse the rings instead
          </Link>
        </div>
      </div>
    </div>
  );
}

function MetalSwitcher({
  metalIndex,
  onMetal,
}: {
  metalIndex: number;
  onMetal: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {TRY_ON_METALS.map((m, i) => {
        const active = i === metalIndex;
        return (
          <button
            key={m.value}
            type="button"
            aria-label={m.value}
            aria-pressed={active}
            onClick={() => onMetal(i)}
            className={cn(
              "h-7 w-7 rounded-full border-2 transition-transform",
              active ? "scale-110 border-gold" : "border-white/60 hover:scale-105"
            )}
            style={{ background: m.hex }}
          />
        );
      })}
    </div>
  );
}

function DetailsPanel({
  product,
  metalIndex,
  onMetal,
}: {
  product: (typeof TRY_ON_PRODUCTS)[number];
  metalIndex: number;
  onMetal: (i: number) => void;
}) {
  return (
    <div className="rounded-2xl bg-ivory/95 p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur">
      <span className="overline text-carbon/60">Now Trying</span>
      <h2 className="mt-2 font-display text-h3 text-obsidian">{product.name}</h2>
      <p className="mt-1 font-sans text-body text-carbon">{product.descriptor}</p>
      <p className="numeric mt-3 font-mono text-gold" style={{ fontSize: "1.25rem" }}>
        {formatPrice(product.price)}
      </p>

      <div className="mt-5">
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-carbon/60">
          Metal — {TRY_ON_METALS[metalIndex].value}
        </span>
        <div className="mt-2">
          <MetalSwitcher metalIndex={metalIndex} onMetal={onMetal} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          // eslint-disable-next-line no-console
          console.log("Add to cart from try-on:", product.id, TRY_ON_METALS[metalIndex].value);
        }}
        className="mt-6 w-full rounded-button bg-obsidian py-3 font-mono text-caption uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold"
      >
        Add to Cart
      </button>
      <Link
        href={`/shop/rings/${product.slug}`}
        className="mt-3 block text-center font-mono text-caption uppercase tracking-[0.16em] text-carbon link-underline hover:text-obsidian"
      >
        View full details →
      </Link>
    </div>
  );
}

function MobileDetails({
  product,
  metalIndex,
  onMetal,
}: {
  product: (typeof TRY_ON_PRODUCTS)[number];
  metalIndex: number;
  onMetal: (i: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-ivory/95 px-4 py-3 backdrop-blur">
      <div className="min-w-0">
        <p className="truncate font-display text-body-lg text-obsidian">{product.name}</p>
        <p className="numeric font-mono text-caption text-gold">{formatPrice(product.price)}</p>
      </div>
      <MetalSwitcher metalIndex={metalIndex} onMetal={onMetal} />
      <Link
        href={`/shop/rings/${product.slug}`}
        aria-label="View full details"
        className="shrink-0 rounded-full bg-obsidian px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ivory"
      >
        Details
      </Link>
    </div>
  );
}

function ProductStrip({
  activeIndex,
  onSelect,
  metalIndex,
}: {
  activeIndex: number;
  onSelect: (i: number) => void;
  metalIndex: number;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {TRY_ON_PRODUCTS.map((p, i) => {
        const active = i === activeIndex;
        const hex = active ? TRY_ON_METALS[metalIndex].hex : p.metal === "Platinum" ? "#cfd2d4" : undefined;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(i)}
            aria-pressed={active}
            className={cn(
              "relative grid h-16 w-16 shrink-0 place-items-center rounded-xl border-2 bg-champagne transition-transform",
              active ? "scale-105 border-gold" : "border-transparent opacity-80 hover:opacity-100"
            )}
            title={p.name}
          >
            <span
              className="h-8 w-8 rounded-full border border-black/10"
              style={{
                background: `radial-gradient(circle at 35% 30%, #ffffff, ${
                  hex ?? metalHexFor(p.metal)
                })`,
              }}
            />
            <span className="absolute -bottom-0.5 left-0 right-0 truncate px-1 text-center font-mono text-[0.5rem] uppercase tracking-[0.08em] text-carbon/70">
              {p.name.split(" ")[0]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function metalHexFor(metal: string): string {
  return TRY_ON_METALS.find((m) => m.value === metal)?.hex ?? "#d4af37";
}
