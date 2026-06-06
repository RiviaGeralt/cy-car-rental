export function drawSky(ctx, w, h, params) {
  const horizonY = h * 0.46;
  const grad = ctx.createLinearGradient(0, 0, 0, horizonY);
  grad.addColorStop(0,    '#050510');
  grad.addColorStop(0.6,  '#07041a');
  grad.addColorStop(0.85, `rgba(30, 12, 2, ${params.horizonAmber * 0.6})`);
  grad.addColorStop(1,    `rgba(${params.headlightR * 0.5 | 0}, ${params.headlightG * 0.3 | 0}, 10, ${params.horizonAmber * 0.35})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, horizonY);
}