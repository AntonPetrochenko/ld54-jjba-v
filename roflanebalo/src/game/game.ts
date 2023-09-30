import { InputState, inputState } from "./engine/input";

let ar: HTMLDivElement | null

let spam = false
export function init() {
  ar = document.querySelector<HTMLDivElement>('.perspective-object')
  document.addEventListener('keydown', () => {
    window.spam = true
  })
  document.addEventListener('keyup', () => {
    window.spam = false
  })
}



export function update(dt: number) {
  if (ar) {
    const j = inputState.find((e) => e !== undefined)
    if (j) {
      ar.style.transform = `
        translate3d(
          ${Math.floor(j.virtualPosition.x)}px,
          ${Math.floor(j.virtualPosition.y)}px,
          ${Math.floor(j.virtualPosition.z)}px
        )
      `;
      ar.innerText = `
          ${j.trackedOrientation.yaw}
          ${j.trackedOrientation.pitch}
          ${j.trackedOrientation.roll}
      `
    }
  }
}

