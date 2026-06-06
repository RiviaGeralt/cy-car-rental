// Section keyframes: scroll progress 0→1 maps to 6 scene states
const KEYFRAMES = [
  { t: 0.00, speed: 0.35, headlightR: 255, headlightG: 230, headlightB: 150, headlightSpread: 0.55, horizonAmber: 0.45, bokehDensity: 0.7 },
  { t: 0.18, speed: 0.85, headlightR: 200, headlightG: 210, headlightB: 255, headlightSpread: 0.70, horizonAmber: 0.25, bokehDensity: 0.4 },
  { t: 0.38, speed: 0.50, headlightR: 240, headlightG: 220, headlightB: 130, headlightSpread: 0.60, horizonAmber: 0.40, bokehDensity: 0.6 },
  { t: 0.62, speed: 0.20, headlightR: 255, headlightG: 200, headlightB: 80,  headlightSpread: 0.45, horizonAmber: 0.65, bokehDensity: 0.9 },
  { t: 0.78, speed: 0.65, headlightR: 212, headlightG: 175, headlightB: 55,  headlightSpread: 0.80, horizonAmber: 0.75, bokehDensity: 0.5 },
  { t: 1.00, speed: 0.15, headlightR: 180, headlightG: 140, headlightB: 40,  headlightSpread: 0.35, horizonAmber: 0.35, bokehDensity: 0.3 },
];

function lerp(a, b, t) { return a + (b - a) * t; }

export function interpolateSceneParams(progress) {
  const p = Math.max(0, Math.min(1, progress));
  let lo = KEYFRAMES[0];
  let hi = KEYFRAMES[KEYFRAMES.length - 1];
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (p >= KEYFRAMES[i].t && p <= KEYFRAMES[i + 1].t) {
      lo = KEYFRAMES[i]; hi = KEYFRAMES[i + 1]; break;
    }
  }
  const range = hi.t - lo.t;
  const t = range === 0 ? 0 : (p - lo.t) / range;
  const result = {};
  for (const key of Object.keys(lo)) {
    if (key === 't') continue;
    result[key] = lerp(lo[key], hi[key], t);
  }
  return result;
}