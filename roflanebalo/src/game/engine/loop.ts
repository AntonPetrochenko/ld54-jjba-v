let lastTime = 0;

function a(dt: number) {}

let stateFunc = a

export function setupGameplayLoop(handler: ((dt: number) => void)) {
  stateFunc = handler
  requestAnimationFrame(frame)
}

function frame(currentTime: number) {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  stateFunc(deltaTime)

  requestAnimationFrame(frame)
}