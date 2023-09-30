export interface BomjEulerAngles {
  yaw: number;
  pitch: number;
  roll: number;
}

export function rotateEulerAngles(original: BomjEulerAngles, rotation: BomjEulerAngles): BomjEulerAngles {
  // Convert degrees to radians
  const yawRad = (rotation.yaw * Math.PI) / 180;
  const pitchRad = (rotation.pitch * Math.PI) / 180;
  const rollRad = (rotation.roll * Math.PI) / 180;

  // Perform rotation using Euler angles
  const cosYaw = Math.cos(yawRad);
  const sinYaw = Math.sin(yawRad);
  const cosPitch = Math.cos(pitchRad);
  const sinPitch = Math.sin(pitchRad);
  const cosRoll = Math.cos(rollRad);
  const sinRoll = Math.sin(rollRad);

  const rotated: BomjEulerAngles = {
    yaw: original.yaw,
    pitch: original.pitch,
    roll: original.roll
  };

  // Rotate yaw
  rotated.yaw += cosYaw * cosPitch * cosRoll - sinYaw * sinRoll;
  // Rotate pitch
  rotated.pitch += sinYaw * cosPitch * cosRoll + cosYaw * sinRoll;
  // Rotate roll
  rotated.roll += sinPitch * cosRoll;

  return rotated;
}

export function invertEulerAngles(angles: BomjEulerAngles): BomjEulerAngles {
  return {
    yaw: -angles.yaw,
    pitch: -angles.pitch,
    roll: -angles.roll
  };
}