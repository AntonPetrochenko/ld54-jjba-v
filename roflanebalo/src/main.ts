import { start } from './game';
import './style.css'
import * as JoyCon from 'joy-con-webhid-ts';

async function forgetAllHIDDevices() {
  try {
    // Get access to available HID devices
    const devices = await navigator.hid.getDevices();

    // Loop through the devices and forget them
    for (const device of devices) {
      await device.close();
    }

    console.log('All HID devices forgotten.');
  } catch (error) {
    console.error('Error forgetting HID devices:', error);
  }
}

let started = false

document.addEventListener('click', async () => {
  await JoyCon.connectJoyCon()
  if (!started) {
    await forgetAllHIDDevices()
    start()
  }
})

document.querySelector<HTMLDivElement>('#app')!.innerHTML = ``
