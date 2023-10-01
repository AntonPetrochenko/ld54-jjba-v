import { GameObject } from "./game";

class Chel implements GameObject {
  posX: number
  posY: number
  stopTimer: number
  shootTimer: number
  isStopped: boolean
  image: string | null
  markedForDeletion: boolean

  htmlRepresentation: HTMLImageElement | undefined

  constructor(posX: number, posY: number, stopTimer: number, shootTimer: number, isStopped:boolean, image: string | null) {
    this.posX = posX
    this.posY = posY
    this.stopTimer = stopTimer
    this.shootTimer = shootTimer
    this.isStopped = isStopped
    this.image = image
    this.markedForDeletion = false
  }

  spawn () {
    const body: HTMLDivElement | null = document.querySelector<HTMLDivElement>('body')
    const chelHtml: HTMLImageElement = document.createElement("img")

    this.htmlRepresentation = chelHtml
    chelHtml.className = 'chel'
    if (this.image) {
      chelHtml.src = this.image
    }
    chelHtml.style.top = `${this.posY}px`
    chelHtml.style.left = `${this.posX}px`

    if (body) {
      body.appendChild(chelHtml)
    }
  }

  logic () {

  }

  despawn () {

  }

  update(dt: number) {

  }
}

export default Chel