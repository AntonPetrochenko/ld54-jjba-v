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