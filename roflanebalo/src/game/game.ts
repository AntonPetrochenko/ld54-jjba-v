import { InputState, inputState } from "./engine/input";

let backgrounds: NodeListOf<HTMLDivElement> | null
let backgroundsWidth: number
let backgroundsWidthWithMargin: number

let spam = false
let ar: HTMLDivElement | null

interface GameObject {
  update: (dt: number) => void
  despawn: () => void
  spawn: () => void

  markedForDeletion: boolean
}

const worldObjects: Array<GameObject> = []

function spawnWorldObject(object: GameObject) {
  worldObjects.push(object)
  object.spawn()
}

export function init() {
  ar = document.querySelector<HTMLDivElement>('.perspective-object')
  document.addEventListener('keydown', () => {
    window.spam = true
  })
  document.addEventListener('keyup', () => {
    window.spam = false
  })

  backgrounds = document.querySelectorAll<HTMLDivElement>('.background-second')
  if (backgrounds) {
    backgrounds.forEach((value: HTMLDivElement, key: number) => {
      if (backgrounds) {
        backgrounds[key].posX = value.getBoundingClientRect().x
      }
      if (key == 0) {
        backgroundsWidth = value.getBoundingClientRect().width;
        backgroundsWidthWithMargin = backgroundsWidth + 30;
      }
    })
  } 
}

let frameSkpped = false

export function update(dt: number) {
  if (!frameSkpped) {
    frameSkpped = !frameSkpped
    return
  }

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
  
  if (backgrounds) {
    backgrounds.forEach((value: HTMLDivElement, key: number) => {
      if (value.posX != undefined) {
        value.posX -= 300*dt
        value.style.left = `${value.posX}px`

        if (value.posX < -backgroundsWidthWithMargin) {
          let newPos: number = 0
          if (backgrounds) {          
            backgrounds.forEach((secondValue: HTMLDivElement) => {
              if (secondValue.posX != undefined) {
                if (secondValue.posX > newPos) {
                  newPos = secondValue.posX
                }
              }
            })

            backgrounds[key].posX = newPos + backgroundsWidth
            value.style.left = `${backgrounds[key].posX}px`
          }
        }
      }
    })
  }

  worldObjects.forEach( (worldObject, idx) => {
    worldObject.update(dt)

    if (worldObject.markedForDeletion) {
      worldObject.despawn()
      worldObjects.splice(idx, 1)
    }
  })
}