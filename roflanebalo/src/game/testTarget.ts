import { easeInOutBack, lerp } from "./engine/util";
import { GameObject } from "./game";

export class Enemy implements GameObject {
  public posX = window.innerWidth + 100
  public posY = window.innerHeight - Math.random()*700-100 


  public moveTimer = 1 + Math.random()*3

  public markedForDeletion = false;

  public hitboxElement!: HTMLElement

  private imageTag!: HTMLImageElement


  public prevPosX = 0
  public prevPosY = 0

  public posXgoal = 0
  public posYgoal = 0
  public motionProgress = 0
  public isMoving = false

  public despawn() {
    this.imageTag.remove()
  }

  public src = '/target.png'

  constructor(src?: string, xPosition?: number, yPosition?: number) {
    if (src) {
      this.src = src
    }

    if (xPosition && yPosition) {
      const spawnSideLeft = Math.random() > 0.7

      this.posX = window.innerWidth + 300
      if (spawnSideLeft) {
        this.posX = -300
      }

      this.posY = Math.random()*window.innerHeight*1.2-200

      this.beginMoving(xPosition, yPosition)
    }
  }

  private beginMoving(goalX: number, goalY: number) {

    console.log('Started moving', this)
    this.prevPosX = this.posX
    this.prevPosY = this.posY

    this.posXgoal = goalX
    this.posYgoal = goalY

    this.isMoving = true
    this.motionProgress = 0
  }

  public spawn() {
    this.imageTag = document.createElement('img')
    this.imageTag.src = this.src

    this.imageTag.classList.add('mobile')

    document.body.appendChild(this.imageTag)

    this.hitboxElement = this.imageTag
  }

  public update(dt: number) {

    this.moveTimer -= dt
    console.log(this.moveTimer)

    if (this.moveTimer < 0) {
      this.moveTimer = 4 + Math.floor(Math.random()*3)
      this.beginMoving(100+Math.random()*(window.innerWidth-200), 100+Math.random()*(window.innerHeight-200))
    }

    if (this.isMoving) {
      this.motionProgress += dt
      this.posX = lerp(this.prevPosX, this.posXgoal, easeInOutBack(this.motionProgress))
      this.posY = lerp(this.prevPosY, this.posYgoal, easeInOutBack(this.motionProgress))
    }

    if (this.motionProgress > 1) {
      this.motionProgress = 0
      this.isMoving = false
    }

    this.imageTag.style.left = `${this.posX}px`
    this.imageTag.style.top = `${this.posY}px`
  };

  public hit() {
    this.markedForDeletion = true
  }
}