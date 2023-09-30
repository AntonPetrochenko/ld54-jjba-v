import { setupInputSystem } from "./engine/input"
import { setupGameplayLoop } from "./engine/loop"
import { init, update } from "./game"

export function start() {
  document.body.innerHTML = '<div class="background"><div data-background="0" class="background-second"></div><div data-background="1" class="background-second"></div><div data-background="2" class="background-second"></div></div>';

  setupInputSystem()
  setupGameplayLoop(init, update)
}

