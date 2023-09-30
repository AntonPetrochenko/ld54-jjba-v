import { setupInputSystem } from "./engine/input"
import { setupGameplayLoop } from "./engine/loop"
import { init, update } from "./game"

export function start() {
  document.body.innerHTML = `
  <div class="perspective-container">
    <div class="perspective-object">
      хуй курва
    </div>
  </div>
  `

  setupInputSystem()
  setupGameplayLoop(init, update)
}

