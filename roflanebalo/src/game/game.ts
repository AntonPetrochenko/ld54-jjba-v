import { inputState } from "./engine/input";

const ar = document.querySelector<HTMLDivElement>('.arrow')
export function update() {
  if (ar) {
    console.log(inputState.trackedOrientation)
    ar.style.transform = `rotate3D(${inputState.trackedOrientation.a}deg, ${inputState.trackedOrientation.b}deg, ${inputState.trackedOrientation.c}deg)`
  }
}