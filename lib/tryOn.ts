/**
 * Lumière — Virtual Try-On (/try-on) data + capability detection.
 *
 * The try-on experience renders a 3D ring (Three.js) onto a hand detected by
 * MediaPipe's Hand Landmarker, both loaded from CDN at runtime. Only rings are
 * try-on eligible in this phase.
 */
import { METALS, PRODUCTS, type Metal, type Product } from "./products";

/** Rings are the try-on eligible catalogue (hand landmarks → ring finger). */
export const TRY_ON_PRODUCTS: Product[] = PRODUCTS.filter(
  (p) => p.category === "rings"
);

/** Metals the wearer can switch between in real time. */
export const TRY_ON_METALS = METALS;

/** Index of a metal within TRY_ON_METALS (for the live recolour). */
export function metalIndexOf(metal: Metal): number {
  const i = TRY_ON_METALS.findIndex((m) => m.value === metal);
  return i < 0 ? 0 : i;
}

/** Pre-written Instagram caption shown after capture. */
export function tryOnCaption(productName: string): string {
  return `Just tried on the ${productName} at Lumière 💎 Lab-grown, sustainably crafted. Link in bio.`;
}

/** Short text for the native Web Share sheet. */
export function tryOnShareText(productName: string): string {
  return `I tried on the ${productName} at Lumière`;
}

/* ---- CDN endpoints (loaded at runtime, never bundled) ---- */
export const CDN = {
  three: "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
  visionModule:
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs",
  visionWasm: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm",
  handModel:
    "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
} as const;

/**
 * Feature detection — camera + WebAssembly + WebGL. Runs client-side only.
 * Used to decide between the live experience and the graceful fallback.
 */
export function isTryOnSupported(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  const hasCamera = Boolean(
    navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function"
  );
  const hasWasm = typeof WebAssembly === "object";
  let hasWebGL = false;
  try {
    const c = document.createElement("canvas");
    hasWebGL = Boolean(
      c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl")
    );
  } catch {
    hasWebGL = false;
  }
  return hasCamera && hasWasm && hasWebGL;
}
