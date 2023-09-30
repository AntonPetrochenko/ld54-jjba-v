import { connectedJoyCons } from "joy-con-webhid-ts";

interface InputState {
  virtualPosition: {
    x: number,
    y: number,
    z: number,
  }
  trackedOrientation: {
    a: number,
    b: number,
    c: number
  }
}

const inputState: InputState[] = []

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
      // Open the device and enable standard full mode and inertial measurement
      // unit mode, so the Joy-Con activates the gyroscope and accelerometers.
      await joyCon.open();
      
      await joyCon.enableStandardFullMode();
      await joyCon.enableIMUMode();
      await joyCon.enableVibration();
      // Get information about the connected Joy-Con.
      // @ts-ignore lmao?
      await joyCon.rumble(600, 600, 0.5);
      // Listen for HID input reports.
      console.log('Setting event listener')
      console.log(joyCon.opened)
      joyCon.addEventListener('hidinput', ({ detail }) => {

        if (detail.actualOrientation) {
          inputState[key].trackedOrientation.a = parseFloat(detail.actualOrientation.alpha)
          inputState[key].trackedOrientation.b = parseFloat(detail.actualOrientation.beta)
          inputState[key].trackedOrientation.c = parseFloat(detail.actualOrientation.gamma)
        }
        console.log('*')
      });
      console.log('Event listener set')
      // @ts-ignore lol
      joyCon.eventListenerAttached = true;
    })
  }, 100);
}
