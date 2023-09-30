import { setupInputSystem } from "./engine/input"
import { setupGameplayLoop } from "./engine/loop"
import { init, update } from "./game"

export function start() {
  document.body.innerHTML = '<div class="arrow"></div>'

  setupInputSystem()
  setupGameplayLoop(init, update)
}

