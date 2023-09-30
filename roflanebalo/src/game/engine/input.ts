import { connectedJoyCons } from "joy-con-webhid-ts";

const inputState = {
  virtualPosition: {
    x: 0,
    y: 0,
    z: 0
  },
  trackedOrientation: {
    a: 0,
    b: 0,
    c: 0
  }
}

export { inputState }

export function setupInputSystem(): void {
  setInterval(async () => {
    // @ts-ignore
    window.cons = connectedJoyCons.values()
    for (const joyCon of connectedJoyCons.values()) {
      // @ts-ignore lmao
      if (joyCon.eventListenerAttached) {
        continue;
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
          inputState.trackedOrientation.a = parseFloat(detail.actualOrientation.alpha)
          inputState.trackedOrientation.b = parseFloat(detail.actualOrientation.beta)
          inputState.trackedOrientation.c = parseFloat(detail.actualOrientation.gamma)
        }
        console.log('*')
      });
      console.log('Event listener set')
      // @ts-ignore lol
      joyCon.eventListenerAttached = true;
    }
  }, 100);
}
