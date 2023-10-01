import { JoyConLeft, connectedJoyCons } from "joy-con-webhid-ts";
import { BomjEulerAngles, clampDegrees, rotateVector } from "./angle";
import { dealDamage } from "../game";
import { refreshHud } from "../hud";

const correction = 1.2

export interface PlayerState {
  virtualPosition: {
    x: number,
    y: number,
    z: number,
  }
  virtualPositionOffset: {
    x: number,
    y: number,
    z: number,
  },
  health: number
  ammo: number
  score: number
  crosshairElement: HTMLElement | undefined
  trackedOrientation: BomjEulerAngles
  initialOrientation: BomjEulerAngles
  isFireDownOld: boolean
  isLeftJoyCon: boolean
  dtUpdate: (dt: number) => void
}

const inputState: PlayerState[] = []

export { inputState }

export function setupInputSystem(): void {
  setInterval(async () => {
    // @ts-ignore
    window.cons = connectedJoyCons.values()

    connectedJoyCons.forEach( async (joyCon, key) => {

      if (!key) {
        return
      }
      // @ts-ignore lmao
      if (joyCon.eventListenerAttached) {
        return;
      }

      const crosshair = document.createElement('img')

      let isLeftJoyCon = false

      if (joyCon instanceof JoyConLeft) {
        crosshair.src = '/blue_crosshair.png'
        isLeftJoyCon = true
      } else {
        crosshair.src = '/red_crosshair.png'
      }

      crosshair.classList.add('mobile')

      inputState[key] = {
        trackedOrientation: {yaw:0,pitch:0,roll:0},
        virtualPosition: {x:0,y:0,z:0},
        virtualPositionOffset: {x:0,y:0,z:0},
        initialOrientation: {yaw:0,pitch:0,roll:0},
        score: 0,
        health: 10,
        ammo: 10,
        crosshairElement: crosshair,
        isFireDownOld: false,
        isLeftJoyCon: isLeftJoyCon,
        dtUpdate() {
          
        },
      }

      document.body.appendChild(crosshair)
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
            pitch: detail.gyroscopes[0][1].dps,
            roll: detail.gyroscopes[0][2].dps,
          }
        }

        const correctedVec = rotateVector([inputOrientation.pitch, inputOrientation.roll], clampDegrees(iState.trackedOrientation.yaw))
        

        // const preparedEulerAngles = rotateEulerAngles(inputOrientation, invertEulerAngles(iState.initialOrientation))
        const preparedEulerAngles = {
          yaw: inputOrientation.yaw / 100,
          pitch: correctedVec[0] / 100,
          roll: correctedVec[1] / 100
        }

        iState.trackedOrientation.yaw += preparedEulerAngles.yaw
        iState.trackedOrientation.pitch += preparedEulerAngles.pitch
        iState.trackedOrientation.roll += preparedEulerAngles.roll

        
        iState.virtualPosition.x = iState.trackedOrientation.pitch - iState.virtualPositionOffset.x
        iState.virtualPosition.y = iState.trackedOrientation.roll - iState.virtualPositionOffset.y
        // iState.virtualPosition.z = iState.virtualPosition.z - iState.virtualPositionOffset.z

        if (detail.buttonStatus?.sl || detail.buttonStatus?.sr) {
          iState.trackedOrientation.yaw = 0
          iState.trackedOrientation.pitch = 0
          iState.trackedOrientation.roll = 0
        }

        let isFireDown = false
        if (detail.buttonStatus) {
          isFireDown = !!(detail.buttonStatus.l || detail.buttonStatus.r || detail.buttonStatus.zl || detail.buttonStatus.zr)

          if (isFireDown && (isFireDown != iState.isFireDownOld) && iState.crosshairElement) {
            dealDamage(iState.crosshairElement)
            iState.virtualPosition.z = 100
            refreshHud()
            // joyCon.rumble(200,600,0.5)
            // setInterval( () => joyCon.rumble(0,0,0), 0.5)
          }
        }

        iState.isFireDownOld = isFireDown
        
        if (iState.crosshairElement) {
          iState.crosshairElement.style.left = `${window.innerWidth/2 + iState.virtualPosition.x*50-40}px`
          iState.crosshairElement.style.top = `${window.innerHeight/2 + iState.virtualPosition.y*50-40}px`
          iState.crosshairElement.style.transform= `scale(${100 + iState.virtualPosition.z}%)`
        }

        iState.virtualPosition.z *= 0.95
        

      });
      console.log('Event listener set')
      // @ts-ignore lol
      joyCon.eventListenerAttached = true;
    })
  }, 1000);
}
