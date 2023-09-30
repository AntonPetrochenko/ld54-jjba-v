import { inputState } from "./engine/input";

let ar: HTMLDivElement | null

export function init() {
  ar = document.querySelector<HTMLDivElement>('.arrow')
}

export function update() {
  if (ar) {
    console.log(inputState[0].trackedOrientation)
    ar.style.transform = `rotate3D(${inputState[0].trackedOrientation.a}deg, ${inputState[0].trackedOrientation.b}deg, ${inputState[0].trackedOrientation.c}deg)`
  }
}