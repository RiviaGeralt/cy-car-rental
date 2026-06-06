export function drawHeadlights(ctx, w, h, params) {
  const horizonY = h * 0.46;
  const vpX = w * 0.5;
  const { headlightR: r, headlightG: g, headlightB: b, headlightSpread } = params;
  const spreadW = w * 0.35 * headlightSpread;

  // Left cone
  const lx = vpX - 14;
  const lgr = ctx.createRadialGradient(lx, h, 0, vpX, horizonY, h * 0.72);
  lgr.addColorStop(0,   `rgba(${r|0},${g|0},${b|0},0.18)`);
  lgr.addColorStop(0.4, `rgba(${r|0},${g|0},${b|0},0.07)`);
  lgr.addColorStop(1,   'rgba(0,0,0,0)');
  const leftPath = new Path2D();
  leftPath.moveTo(lx, h);
  leftPath.lineTo(vpX - spreadW, horizonY);
  leftPath.lineTo(vpX, horizonY);
  leftPath.closePath();
  ctx.save(); ctx.clip(leftPath);
  ctx.fillStyle = lgr;
  ctx.fillRect(0, horizonY, w, h - horizonY);
  ctx.restore();

  // Right cone
  const rx = vpX + 14;
  const rgr = ctx.createRadialGradient(rx, h, 0, vpX, horizonY, h * 0.72);
  rgr.addColorStop(0,   `rgba(${r|0},${g|0},${b|0},0.18)`);
  rgr.addColorStop(0.4, `rgba(${r|0},${g|0},${b|0},0.07)`);
  rgr.addColorStop(1,   'rgba(0,0,0,0)');
  const rightPath = new Path2D();
  rightPath.moveTo(rx, h);
  rightPath.lineTo(vpX, horizonY);
  rightPath.lineTo(vpX + spreadW, horizonY);
  rightPath.closePath();
  ctx.save(); ctx.clip(rightPath);
  ctx.fillStyle = rgr;
  ctx.fillRect(0, horizonY, w, h - horizonY);
  ctx.restore();

  // Ground glow
  const glowGr = ctx.createRadialGradient(vpX, h * 0.88, 0, vpX, h * 0.88, w * 0.28);
  glowGr.addColorStop(0, `rgba(${r|0},${g|0},${b|0},0.13)`);
  glowGr.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glowGr;
  ctx.beginPath();
  ctx.ellipse(vpX, h * 0.88, w * 0.28, h * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();
}