import { interpolateSceneParams } from './sceneParams.js';
import { drawSky } from './drawSky.js';
import { drawRoad } from './drawRoad.js';
import { drawHeadlights } from './drawHeadlights.js';
import { createBokehPool, drawBokeh } from './drawBokeh.js';

function lerp(a, b, t) { return a + (b - a) * t; }

export class NightDriveCanvas {
  constructor(canvas, isMobile) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isMobile = isMobile;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = 0; this.h = 0;
    this.tick = 0;
    this.rafId = null;
    this.lastFrameTime = 0;
    this.frameBudget = isMobile ? 33.4 : 16.7;
    this.target = interpolateSceneParams(0);
    this.current = { ...this.target };
    this.particles = [];
    this.resize();
  }

  resize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w * this.dpr;
    this.canvas.height = this.h * this.dpr;
    this.canvas.style.width = this.w + 'px';
    this.canvas.style.height = this.h + 'px';
    this.ctx.scale(this.dpr, this.dpr);
    const count = this.isMobile ? 25 : 60;
    this.particles = createBokehPool(this.w, this.h, count);
  }

  setScrollProgress(progress) {
    this.target = interpolateSceneParams(progress);
  }

  _lerpCurrent() {
    const t = 0.04;
    for (const key of Object.keys(this.target)) {
      if (this.current[key] == null) this.current[key] = this.target[key];
      this.current[key] = lerp(this.current[key], this.target[key], t);
    }
  }

  _frame(timestamp) {
    this.rafId = requestAnimationFrame((ts) => this._frame(ts));
    if (timestamp - this.lastFrameTime < this.frameBudget) return;
    this.lastFrameTime = timestamp;
    this.tick += 1;
    this._lerpCurrent();
    const { ctx, w, h, tick, current, particles } = this;
    ctx.clearRect(0, 0, w, h);
    drawSky(ctx, w, h, current);
    drawRoad(ctx, w, h, current, tick);
    drawHeadlights(ctx, w, h, current);
    drawBokeh(ctx, particles, w, h, tick, current.bokehDensity);
  }

  start() {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame((ts) => this._frame(ts));
  }

  stop() {
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }
  }

  destroy() { this.stop(); }
}