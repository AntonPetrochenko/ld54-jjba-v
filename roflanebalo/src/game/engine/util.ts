export function multiplyMatrices(m1:number[][], m2:number[][]) {
  var result: number[][] = [];
  for (var i = 0; i < m1.length; i++) {
      result[i] = [];
      for (var j = 0; j < m2[0].length; j++) {
          var sum = 0;
          for (var k = 0; k < m1[0].length; k++) {
              sum += m1[i][k] * m2[k][j];
          }
          result[i][j] = sum;
      }
  }
  return result;
}

export function rotMatrixRoll(angle: number): number[][] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  
  return [
    [1, 0, 0],
    [0, c, -s],
    [0, s, c]
  ];
}

export function rotMatrixPitch(angle: number): number[][] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  
  return [
    [c, 0, s],
    [0, 1, 0],
    [-s, 0, c]
  ];
}

export function rotMatrixYaw(angle: number): number[][] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  
  return [
    [c, -s, 0],
    [s, c, 0],
    [0, 0, 1]
  ];
}

export function lerp(start: number, end: number, t: number): number {
  return (1 - t) * start + t * end;
}

export function easeOutElastic(x: number): number {
  const c4 = (2 * Math.PI) / 3;

  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

export function easeInOutBack(x: number): number {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  
  return x < 0.5
    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
  }