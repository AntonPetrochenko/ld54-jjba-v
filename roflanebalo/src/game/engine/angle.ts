export interface BomjEulerAngles {
  yaw: number,
  pitch: number,
  roll: number
}

export function rotateVector(vector: [number, number], angleDegrees: number): [number, number] {
  // Convert the angle from degrees to radians
  const angleRadians = (angleDegrees * Math.PI) / 180;

  // Extract the x and y components of the vector
  const [x, y] = vector;

  // Calculate the rotated x and y components using the rotation matrix
  const rotatedX = x * Math.cos(angleRadians) - y * Math.sin(angleRadians);
  const rotatedY = x * Math.sin(angleRadians) + y * Math.cos(angleRadians);

  // Return the rotated vector
  return [rotatedX, rotatedY];
}

export function clampDegrees(angleDegrees: number): number {
  // Calculate the equivalent angle within the range of -360 to 360
  const clampedAngle = angleDegrees % 360;

  // Adjust the angle if it falls outside the range of 0 to 360
  return clampedAngle < 0 ? clampedAngle + 360 : clampedAngle;
}