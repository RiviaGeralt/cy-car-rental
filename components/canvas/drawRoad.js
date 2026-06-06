export function drawRoad(ctx, w, h, params, tick) {
  const horizonY = h * 0.46;
  const vpX = w * 0.5;
  const roadHalfWidthAtBase = w * 0.42;
  const roadHalfWidthAtHorizon = w * 0.012;

  // Road base
  const roadGrad = ctx.createLinearGradient(0, horizonY, 0, h);
  roadGrad.addColorStop(0, '#080808');
  roadGrad.addColorStop(1, '#0e0c0a');
  ctx.fillStyle = roadGrad;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // Road edges
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.18)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(vpX - roadHalfWidthAtHorizon, horizonY);
  ctx.lineTo(vpX - roadHalfWidthAtBase, h);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(vpX + roadHalfWidthAtHorizon, horizonY);
  ctx.lineTo(vpX + roadHalfWidthAtBase, h);
  ctx.stroke();

  // Lateral grid lines
  const gridCount = 10;
  for (let i = 1; i < gridCount; i++) {
    const factor = i / gridCount;
    const y = horizonY + (h - horizonY) * factor;
    const alpha = 0.03 + factor * 0.07;
    const halfW = roadHalfWidthAtHorizon + (roadHalfWidthAtBase - roadHalfWidthAtHorizon) * factor;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(vpX - halfW, y);
    ctx.lineTo(vpX + halfW, y);
    ctx.stroke();
  }

  // Animated center lane dashes
  const segH = h * 0.09;
  const gapH = h * 0.06;
  const totalSeg = segH + gapH;
  const offset = (tick * params.speed * 1.2) % totalSeg;
  const dashCount = 12;
  for (let i = 0; i < dashCount; i++) {
    const rawY = horizonY + offset + i * totalSeg;
    if (rawY > h || rawY < horizonY) continue;
    const factor = (rawY - horizonY) / (h - horizonY);
    const endY = Math.min(rawY + segH * factor, h);
    if (endY <= rawY) continue;
    const halfW = (roadHalfWidthAtHorizon + (roadHalfWidthAtBase - roadHalfWidthAtHorizon) * factor) * 0.06;
    const alpha = factor * 0.55;
    ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
    ctx.fillRect(vpX - halfW, rawY, halfW * 2, (endY - rawY) * 0.9);
  }
}