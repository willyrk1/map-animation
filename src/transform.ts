
export type XY = [number, number]
type Triangle = [XY, XY, XY]
export type Quadrilateral = [XY, XY, XY, XY]
type MatrixRow = [number, number, number]
export type Matrix33 = [MatrixRow, MatrixRow, MatrixRow]

function trianglesToAffineTransform([[x1, y1], [x2, y2], [x3, y3]]: Triangle, [[X1, Y1], [X2, Y2], [X3, Y3]]: Triangle): Matrix33 {
  // Calculate determinants for solving the system of equations
  const det = x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2);

  if (Math.abs(det) < 1e-9) { // Check for collinear points (degenerate triangle)
    throw new Error("Source triangle points are collinear.");
  }

  // Calculate matrix coefficients
  const a = (X1 * (y2 - y3) + X2 * (y3 - y1) + X3 * (y1 - y2)) / det;
  const b = (X1 * (x3 - x2) + X2 * (x1 - x3) + X3 * (x2 - x1)) / det;
  const c = (X1 * (x2 * y3 - x3 * y2) + X2 * (x3 * y1 - x1 * y3) + X3 * (x1 * y2 - x2 * y1)) / det;

  const d = (Y1 * (y2 - y3) + Y2 * (y3 - y1) + Y3 * (y1 - y2)) / det;
  const e = (Y1 * (x3 - x2) + Y2 * (x1 - x3) + Y3 * (x2 - x1)) / det;
  const f = (Y1 * (x2 * y3 - x3 * y2) + Y2 * (x3 * y1 - x1 * y3) + Y3 * (x1 * y2 - x2 * y1)) / det;

  return [[a, b, c], [d, e, f], [0, 0, 1]]
}

// This returns a matrix to transform [(0,1), (0,0), (1,0), (a,b)] -> [(0,1), (0,0), (1,0), (c,d)]
function getFractionalLinearTransform([a, b]: XY, [c, d]: XY): Matrix33 {
  const s = a + b - 1
  const t = c + d - 1
  return [[b * c * s, 0, 0], [0, a * d * s, 0], [b * (c * s - a * t), a * (d * s - b * t), a * b * t]]
}

export function applyTransform([x, y]: XY, [[m00, m01, m02], [m10, m11, m12], [m20, m21, m22]]: Matrix33): XY {
  // Convert to homogeneous coordinates
  const px = m00 * x + m01 * y + m02;
  const py = m10 * x + m11 * y + m12;
  const pw = m20 * x + m21 * y + m22;

  // Divide by w (homogeneous coordinate) for Cartesian coordinates
  return [px / pw, py / pw];
}

export function getPerspectiveTransform(srcQuad: Quadrilateral, destQuad: Quadrilateral): Matrix33 {
  // Steps per https://rethunk.medium.com/perspective-transform-from-quadrilateral-to-quadrilateral-in-swift-5a9adf2175c3
  // 1.) Get affine matrix P to get 3 of 4 src points to form [(0,1), (0,0), (1,0), (a,b)].
  // 2.) Get affine matrix Q to get 3 of 4 dest points to form [(0,1), (0,0), (1,0), (c,d)].
  // 3.) Get fractional linear transform F to get from [(0,1), (0,0), (1,0), (a,b)] to [(0,1), (0,0), (1,0), (c,d)].
  // 4.) Final answer is P * F * Q^-1
  const [src4th, ...srcTriangle] = srcQuad
  const [dest4th, ...destTriangle] = destQuad
  const unitTriangle: Triangle = [[0, 1], [0, 0], [1, 0]]

  const matrixP = trianglesToAffineTransform(srcTriangle, unitTriangle)
  const matrixQ = trianglesToAffineTransform(destTriangle, unitTriangle)

  const p4th = applyTransform(src4th, matrixP)
  const q4th = applyTransform(dest4th, matrixQ)

  const matrixF = getFractionalLinearTransform(p4th, q4th)

  return multiply3x3(invertMatrix(matrixQ), multiply3x3(matrixF, matrixP))
}

function invertMatrix([
  [a, b, c],
  [d, e, f],
  [g, h, i]
]: Matrix33): Matrix33 {
  const A = e * i - f * h;
  const B = -(d * i - f * g);
  const C = d * h - e * g;
  const D = -(b * i - c * h);
  const E = a * i - c * g;
  const F = -(a * h - b * g);
  const G = b * f - c * e;
  const H = -(a * f - c * d);
  const I = a * e - b * d;

  const det = a * A + b * B + c * C;
  if (det === 0) throw new Error('matrix is singular');

  return [
    [A, D, G].map(x => x / det) as MatrixRow,
    [B, E, H].map(x => x / det) as MatrixRow,
    [C, F, I].map(x => x / det) as MatrixRow,
  ];
}

function multiply3x3(m1: Matrix33, m2: Matrix33): Matrix33 {
  const result: Matrix33 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let sum = 0;
      for (let k = 0; k < 3; k++) {
        sum += m1[i][k] * m2[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}
