import { connectedJoyCons } from "joy-con-webhid-ts";
import { multiplyMatrices, rotMatrixRoll, rotMatrixPitch, rotMatrixYaw } from "./util";
import { BomjEulerAngles, invertEulerAngles, rotateEulerAngles } from "./angle";

const correction = 1.2

export interface InputState {
  virtualPosition: {
    x: number,
    y: number,
    z: number,
  }
  virtualPositionOffset: {
    x: number,
    y: number,
    z: number,
  }
  trackedOrientation: BomjEulerAngles
  initialOrientation: BomjEulerAngles
}

const inputState: InputState[] = []

export { inputState }

export function setupInputSystem(): void {
  setInterval(async () => {
    // @ts-ignore
    window.cons = connectedJoyCons.values()

    connectedJoyCons.forEach( async (joyCon, key) => {
      console.log(key)
      if (!key) {
        return
      }
      // @ts-ignore lmao
      if (joyCon.eventListenerAttached) {
        return;
      }

      inputState[key] = {
        trackedOrientation: {yaw:0,pitch:0,roll:0},
        virtualPosition: {x:0,y:0,z:0},
        virtualPositionOffset: {x:0,y:0,z:0},
        initialOrientation: {yaw:0,pitch:0,roll:0},
      }
      // Open the device and enable standard full mode and inertial measurement
      // unit mode, so the Joy-Con activates the gyroscope and accelerometers.
      await joyCon.open();
      
      await joyCon.enableStandardFullMode();
      await joyCon.enableIMUMode();
      await joyCon.enableVibration();
      // Get information about the connected Joy-Con.
      // @ts-ignore lmao?
      await joyCon.rumble(600, 600, 0.3);
      // Listen for HID input reports.
      console.log('Setting event listener')
      console.log(joyCon.opened)
      joyCon.addEventListener('hidinput', ({ detail }) => {
        let iState = inputState[key]

        let inputOrientation: BomjEulerAngles = {
          yaw: 0,
          pitch: 0,
          roll: 0
        };

        if (detail.gyroscopes) {
          inputOrientation = {
            yaw: detail.gyroscopes[0][0].dps * correction,
            pitch: detail.gyroscopes[0][1].dps * correction,
            roll: detail.gyroscopes[0][2].dps * correction,
          }
        }


        

        // const preparedEulerAngles = rotateEulerAngles(inputOrientation, invertEulerAngles(iState.initialOrientation))
        const preparedEulerAngles = {
          yaw: inputOrientation.yaw / 100,
          pitch: inputOrientation.pitch / 100,
          roll: inputOrientation.roll / 100
        }

        iState.trackedOrientation.yaw += preparedEulerAngles.yaw
        iState.trackedOrientation.pitch += preparedEulerAngles.pitch
        iState.trackedOrientation.roll += preparedEulerAngles.roll

        
        iState.virtualPosition.x = iState.trackedOrientation.pitch - iState.virtualPositionOffset.x
        iState.virtualPosition.y = iState.trackedOrientation.roll - iState.virtualPositionOffset.y
        // iState.virtualPosition.z = iState.virtualPosition.z - iState.virtualPositionOffset.z

        if (detail.buttonStatus?.sl) {
          iState.trackedOrientation.yaw = 0
          iState.trackedOrientation.pitch = 0
          iState.trackedOrientation.roll = 0

        }

      });
      console.log('Event listener set')
      // @ts-ignore lol
      joyCon.eventListenerAttached = true;
    })
  }, 1000);
}
