import { PlayerState, hurtRandomPlayer } from "./engine/input";
import { easeInOutBack, easeInOutElastic, getRandomElement, lerp } from "./engine/util";
import { GameObject } from "./game";
import { refreshHud } from "./hud";

const atkSound = new Howl({src: ['/hurt.wav']})

const randomSoundPaths = [
  '/random/1.mp3',
  '/random/2.mp3',
  '/random/3.mp3',
  '/random/4.mp3',
  '/random/5.mp3',
  '/random/6.mp3',
  '/random/7.mp3',
  '/random/8.mp3',
];

export const randomImageSrcs = [
  '/enemy/1.png',
  '/enemy/2.png',
  '/enemy/3.png',
  '/enemy/4.png',
  '/enemy/5.png'
]

const randomSounds = randomSoundPaths.map( path => new Howl({src: path}) )
let phraseCountdown = 10
export class Enemy implements GameObject {
  public posX = window.innerWidth + 100
  public posY = window.innerHeight - Math.random()*700-100 


  public damageTimer = 3+Math.random() * 1

  public moveTimer = 1 + Math.random()*2

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

    if (Math.random() < 0.3 ) {
      this.src = getRandomElement(randomImageSrcs)
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

    // console.log('Started moving', this)
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

    this.moveTimer -= dt*0.8
    this.damageTimer -= dt
    // console.log(this.moveTimer)

    if (this.moveTimer < 0) {
      this.moveTimer = 4 + Math.floor(Math.random()*3)
      this.beginMoving(100+Math.random()*(window.innerWidth-200), 100+Math.random()*(window.innerHeight-200))
    }

    if (this.isMoving) {
      this.motionProgress += dt
      this.posX = lerp(this.prevPosX, this.posXgoal, easeInOutBack(this.motionProgress))
      this.posY = lerp(this.prevPosY, this.posYgoal, easeInOutElastic(this.motionProgress))
    }

    if (this.motionProgress > 1) {
      this.motionProgress = 0
      this.isMoving = false
    }

    if (this.damageTimer < 1) {
      this.imageTag.style.background = 'red';
    }

    if (this.damageTimer < 0) {
      this.imageTag.style.transform = 'scale(200%) translate(-50%, -50%)'
    } else {
      this.imageTag.style.transform = `translate(-50%, -50%)`
    }

    if (this.damageTimer < -0.3) {
      this.markedForDeletion = true
      hurtRandomPlayer()
      atkSound.play()
    }

    this.imageTag.style.left = `${this.posX}px`
    this.imageTag.style.top = `${this.posY}px`

    
  };

  public hit(iState?: PlayerState) {
    this.markedForDeletion = true
    if (iState) {
      iState.score += 30+Math.floor(Math.random()*100)
      refreshHud()
    }
    if (--phraseCountdown < 0) {
      phraseCountdown = 15
      getRandomElement(randomSounds).play()
    }
  }
}