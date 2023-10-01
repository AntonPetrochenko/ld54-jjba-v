import { PlayerState, inputState } from "./engine/input";
import { Enemy } from "./testTarget";

let backgrounds: NodeListOf<HTMLDivElement> | null | undefined
let backgroundsWidth: number
let backgroundsWidthWithMargin: number

let spam = false
let ar: HTMLDivElement | null

export interface GameObject {
  update: (dt: number) => void
  despawn: () => void
  spawn: () => void

  hitboxElement?: HTMLElement
  hit?: () => void

  markedForDeletion: boolean
}

const worldObjects: Array<GameObject> = []

function spawnWorldObject(object: GameObject) {
  worldObjects.push(object)
  object.spawn()
}

let spawnTimer = 0;


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

export function dealDamage(crosshairElement: HTMLElement, iState?: PlayerState) {
  worldObjects.forEach( (obj) => {
    if (obj.hitboxElement && obj.hit) {

      if (crosshairElement) {
        const rect1 = crosshairElement.getBoundingClientRect()
        const rect2 = obj.hitboxElement.getBoundingClientRect()
  
        if (  rect1.x < rect2.x + rect2.width &&
              rect1.x + rect1.width > rect2.x &&
              rect1.y < rect2.y + rect2.height &&
              rect1.y + rect1.height > rect2.y  ) {
          obj.hit()
          if (iState) {

          }
        }
      }
    }
  })
}

let testSpawnPosition = 0

export function update(dt: number) {
  if (ar) {
    ar.innerText = worldObjects.length.toString()
  }
  if (!frameSkpped) {
    frameSkpped = !frameSkpped
    return
  }

  spawnTimer += dt

  if (spawnTimer > 0.4 && worldObjects.length < 3) {
    testSpawnPosition++
    spawnWorldObject(new Enemy('/target.png', Math.random()*window.innerWidth, Math.random()*window.innerHeight))
    spawnTimer = 0
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