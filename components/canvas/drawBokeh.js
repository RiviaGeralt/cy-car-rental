const TAU = Math.PI * 2;

export function createBokehPool(w, h, count) {
  const colors = [[255,220,100],[255,255,255],[200,210,255],[212,175,55]];
  return Array.from({ length: count }, (_, i) => ({
    x: Math.random() * w,
    y: Math.random() * h * 0.48,
    r: Math.random() * 2.5 + 0.5,
    drift: (Math.random() - 0.5) * 0.12,
    rise: -(Math.random() * 0.08 + 0.02),
    alpha: Math.random() * 0.35 + 0.05,
    pulseFreq: Math.random() * 0.002 + 0.001,
    phase: Math.random() * TAU,
    color: colors[i % colors.length],
  }));
}

export function drawBokeh(ctx, particles, w, h, tick, densityFactor) {
  const activeCount = Math.floor(particles.length * Math.max(0.1, densityFactor));
  for (let i = 0; i < activeCount; i++) {
    const p = particles[i];
    p.x += p.drift;
    p.y += p.rise;
    if (p.y < -10) { p.y = h * 0.48; p.x = Math.random() * w; }
    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    const pulse = 0.5 + 0.5 * Math.sin(tick * p.pulseFreq + p.phase);
    const a = p.alpha * pulse;
    // shadowBlur removed — Canvas2D software blur is the #1 scroll jank cause
    ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${a})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 1.4, 0, TAU); // slightly larger radius compensates for no glow
    ctx.fill();
  }
}