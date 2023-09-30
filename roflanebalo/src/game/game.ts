import { InputState, inputState } from "./engine/input";

let backgrounds: NodeListOf<HTMLDivElement> | null
let backgroundsWidth: number
let backgroundsWidthWithMargin: number

let spam = false
let ar: HTMLDivElement | null
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
}