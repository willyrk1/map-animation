import React from "react";
import { position2XY, Zoom } from "./utility";
import { MapArrow } from "./mapReducer";

type CurvedArrowProps = MapArrow & Zoom;

// Renders a filled, optionally-bordered arrow between two map coordinates,
// following a quadratic (parabolic) curve. The whole arrow — shaft plus head —
// is built as one closed outline so the border strokes cleanly all the way
// around it. Every size is expressed in the same base units the rest of the
// map uses and divided by `zoom`, so the arrow keeps a constant on-screen size
// at any magnification (matching PulsingCircle/CountryHighlight).
export default React.memo(function CurvedArrow(props: Readonly<CurvedArrowProps>) {
  const {
    start, end, width, color,
    borderColor, borderWidth = 1,
    curvature = 0, headLength = 2.6, headWidth = 2.4,
    opacity, zoom,
  } = props;

  const d = arrowPath({ start, end, width, curvature, headLength, headWidth, zoom });

  return (
    <path
      d={d}
      fill={color}
      stroke={borderColor}
      strokeWidth={borderColor ? borderWidth / zoom : undefined}
      strokeLinejoin="round"
      opacity={opacity}
    />
  );
});

interface ArrowPathArgs {
  start: [number, number] | number[]
  end: [number, number] | number[]
  width: number
  curvature: number
  headLength: number
  headWidth: number
  zoom: number
}

// Builds the SVG path `d` for the arrow outline in projected (viewBox) space.
// The shaft follows a quadratic Bézier whose control point is the straight
// midpoint pushed sideways by `curvature * length` (0 = a straight line); it's
// sampled into a polyline, offset by ±half-width on each side, and capped with
// a triangular head at the end coordinate.
function arrowPath({ start, end, width, curvature, headLength, headWidth, zoom }: ArrowPathArgs): string {
  const [x0, y0] = position2XY(start);
  const [x1, y1] = position2XY(end);

  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1e-6;
  // Left-hand normal of the straight start→end line, used to bow the curve.
  const nx = -dy / len;
  const ny = dx / len;

  // Quadratic Bézier control point.
  const cx = (x0 + x1) / 2 + nx * curvature * len;
  const cy = (y0 + y1) / 2 + ny * curvature * len;

  const unit = 1 / zoom;
  const halfW = (width * unit) / 2;
  const headLen = width * unit * headLength;
  const headHalfW = (width * unit * headWidth) / 2;

  // Sample the curve, recording each point's left normal plus cumulative length.
  const steps = 48;
  const pts: Array<{ x: number; y: number; nx: number; ny: number; s: number }> = [];
  let total = 0;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    const x = mt * mt * x0 + 2 * mt * t * cx + t * t * x1;
    const y = mt * mt * y0 + 2 * mt * t * cy + t * t * y1;
    // Derivative → tangent → left normal.
    const tx = 2 * mt * (cx - x0) + 2 * t * (x1 - cx);
    const ty = 2 * mt * (cy - y0) + 2 * t * (y1 - cy);
    const tl = Math.hypot(tx, ty) || 1e-6;
    const pnx = -ty / tl;
    const pny = tx / tl;
    if (i > 0) total += Math.hypot(x - pts[i - 1].x, y - pts[i - 1].y);
    pts.push({ x, y, nx: pnx, ny: pny, s: total });
  }

  // The arrowhead occupies the last `headLen` of arc length; the shaft is
  // everything before that.
  const baseS = Math.max(total - headLen, 0);
  let baseIdx = pts.findIndex(p => p.s >= baseS);
  if (baseIdx < 1) baseIdx = 1;
  const base = pts[baseIdx];
  const tip = pts[pts.length - 1];

  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= baseIdx; i++) {
    const p = pts[i];
    left.push(`${p.x + p.nx * halfW},${p.y + p.ny * halfW}`);
    right.push(`${p.x - p.nx * halfW},${p.y - p.ny * halfW}`);
  }

  const outline = [
    ...left,
    `${base.x + base.nx * headHalfW},${base.y + base.ny * headHalfW}`,
    `${tip.x},${tip.y}`,
    `${base.x - base.nx * headHalfW},${base.y - base.ny * headHalfW}`,
    ...right.reverse(),
  ];

  return `M ${outline.join(" L ")} Z`;
}
