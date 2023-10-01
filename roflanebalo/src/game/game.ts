import { CharacterSelector } from "./characterSelector";
import { characters } from "./characters";
import { PlayerState, inputState } from "./engine/input";
import { getRandomElement, lerp } from "./engine/util";
import { Enemy, randomImageSrcs } from "./testTarget";

interface ParallaxEntity {
  elements?: NodeListOf<HTMLDivElement>
  width?: number
  widthWithMargin?: number
}

let backgrounds: ParallaxEntity = {}
let roads: ParallaxEntity = {}

let spam = false
let ar: HTMLDivElement | null

export interface GameObject {
  update: (dt: number) => void
  despawn: () => void
  spawn: () => void

  hitboxElement?: HTMLElement
  hit?: (iState?: PlayerState) => void

  markedForDeletion: boolean
}

const worldObjects: Array<GameObject> = []

function spawnWorldObject(object: GameObject) {
  worldObjects.push(object)
  object.spawn()
}

let spawnTimer = -10;


export function init() {
  ar = document.querySelector<HTMLDivElement>('.perspective-object')



  document.addEventListener('keydown', () => {
    window.spam = true
  })
  document.addEventListener('keyup', () => {
    window.spam = false
  })

  roads.elements = document.querySelectorAll<HTMLDivElement>('.background-second')
  backgrounds.elements = document.querySelectorAll<HTMLDivElement>('.body-background')
  parallaxInit(roads)
  parallaxInit(backgrounds)

  spawnWorldObject(new CharacterSelector(characters[0], 100, 100))
  spawnWorldObject(new CharacterSelector(characters[1], 500, 100))
}

function parallaxInit(px: ParallaxEntity) {
  if (px.elements) {
    px.elements.forEach((value: HTMLDivElement, key: number) => {
        value.posX = value.getBoundingClientRect().x
      if (key == 0) {
        px.width = value.getBoundingClientRect().width;
        px.widthWithMargin = px.width + 30;
      }
    })
  } 

  spawnWorldObject(new CharacterSelector(characters[0], 100, 100, 'КТО ТЫ, ВОИН?<br>СКОРО ВСЁ НАЧНЁТСЯ'))
  spawnWorldObject(new CharacterSelector(characters[1], 500, 100, 'ВЫБЕРИ ПЕРСОНАЖА<br>СКОРО ВСЁ НАЧНЁТСЯ'))

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
          obj.hit(iState)
          if (iState) {

          }
        }
      }
    }
  })
}

let testSpawnPosition = 0


function spawnLine(builder: (x: number, y: number) => GameObject, count: number, x1: number, y1: number, x2: number, y2: number) {
  for (let i = 0; i<count; i++) {
    const x = lerp(x1,x2,i/count)
    const y = lerp(y1,y2,i/count)
    const o = builder(x,y)
    spawnWorldObject(o)
  }
}

let gameStarted = false
const mus = new Howl({src: ['/music.mp3'], volume: 0.2, loop: true});

let gameEnded = false

export function update(dt: number) {
  if (ar) {
    ar.innerText = worldObjects.length.toString()
  }
  if (!frameSkpped) {
    frameSkpped = !frameSkpped
    return
  }

  spawnTimer += dt

  if (spawnTimer >= 0) {

    if (!gameStarted) {
      
      worldObjects.forEach( (o) => {
        if (o instanceof CharacterSelector) {
          o.markedForDeletion = true
        }
      })

      mus.play()
      gameStarted = true
    }

    if (spawnTimer > 0.4 && worldObjects.length < 3) {
      testSpawnPosition++
      // spawnWorldObject(new Enemy('/target.png', 100, 150))

      const src = getRandomElement(randomImageSrcs)

      const x1 = Math.random()*window.innerWidth/2;
      const y1 = Math.random()*window.innerHeight/2;
      const x2 = window.innerWidth/2 + Math.random()*window.innerWidth/2;
      const y2 = window.innerHeight/2 + Math.random()*window.innerHeight/2;
  
      const spawnCount = Math.ceil(Math.random()*4)
      spawnLine((x,y) => {
        return new Enemy(src, x,y);
      }, spawnCount, x1, y1, x2, y2);
  
      // Creating the coordinates for the mirrored line
      const mirrorX1 = window.innerWidth - x1;  // Mirrored X coordinate for x1
      const mirrorY1 = y1;                       // Mirrored Y coordinate for y1
      const mirrorX2 = window.innerWidth - x2;  // Mirrored X coordinate for x2
      const mirrorY2 = y2;                       // Mirrored Y coordinate for y2
  
      spawnLine((x,y) => {
        return new Enemy(src, x,y);
      }, spawnCount, mirrorX1, mirrorY1, mirrorX2, mirrorY2);
  
      spawnTimer = 0
    }

    let hasAlivePlayers = false
    inputState.forEach( (p) => {
      if (p.health > 0) {
        hasAlivePlayers = true
        
      }
    })

    if (!hasAlivePlayers && !gameEnded) {
      const gameOverText = document.createElement('div')
      gameOverText.textContent = 'ГЕЙМ ОВЕР'
      gameOverText.classList.add('hudtext')
      gameOverText.classList.add('mobile')
      
      gameOverText.style.top = '50vh'
      gameOverText.style.left= '50vw'
      gameOverText.style.color='red'

      document.body.appendChild(gameOverText)
      mus.stop()
        setInterval( () => {
          window.location.reload()
        }, 4000)
    }
  }

  parallaxUpdate(roads, 300, dt)
  parallaxUpdate(backgrounds, 200, dt)

  worldObjects.forEach( (worldObject, idx) => {
    worldObject.update(dt)

    if (worldObject.markedForDeletion) {
      worldObject.despawn()
      worldObjects.splice(idx, 1)
    }
  })
}

function parallaxUpdate(px: ParallaxEntity, speed: number, dt: number) {
  if (px.elements) {
    px.elements.forEach((value: HTMLDivElement, key: number) => {
      if (value.posX != undefined && px.width && px.widthWithMargin != undefined) {
        value.posX -= speed*dt
        value.style.left = `${value.posX}px`

        if (value.posX < -px.widthWithMargin) {
          let newPos: number = 0
          if (px.elements) {          
            px.elements.forEach((secondValue: HTMLDivElement) => {
              if (secondValue.posX != undefined) {
                if (secondValue.posX > newPos) {
                  newPos = secondValue.posX
                }
              }
            })

            value.posX = newPos + px.width
            value.style.left = `${value.posX}px`
          }
        }
      }
    })
  }
}