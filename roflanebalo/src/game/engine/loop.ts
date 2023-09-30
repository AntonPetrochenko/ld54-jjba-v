let lastTime = 0;

function a(dt: number) {}

let stateFunc = a

export function setupGameplayLoop(init: () => void, handler: ((dt: number) => void)) {
  init()
  stateFunc = handler
  requestAnimationFrame(frame)
}

function frame(currentTime: number) {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  stateFunc(deltaTime)

  requestAnimationFrame(frame)
}