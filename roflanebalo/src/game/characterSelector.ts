import { Character } from "./characters";
import { PlayerState } from "./engine/input";
import { GameObject } from "./game";

import { Howl } from "howler";

export class CharacterSelector implements GameObject {
  
  characterData: Character
  hitboxElement?: HTMLElement | undefined;
  markedForDeletion = false

  textElement: HTMLElement | undefined;
  posX: number
  posY: number

  textCaption: string = ''

  constructor(c: Character, x: number, y: number, text: string) {
    this.characterData = c
    this.posX = x
    this.posY = y

    this.textCaption = text
  }
  
  public spawn() {
    let icon = document.createElement('img')
    icon.classList.add('mobile')
    icon.src = this.characterData.image

    let text = document.createElement('div') 

    text.classList.add('hudtext')
    text.classList.add('mobile')



    icon.style.left = `${this.posX}px`
    icon.style.top = `${this.posY}px`
    text.style.left = `${this.posX}px`
    text.style.top = `${this.posY}px`
    document.body.appendChild(icon)
    document.body.appendChild(text)
    text.innerText = this.textCaption
    text.style.fontSize = '40px';
    this.hitboxElement = icon

    this.textElement = text
  }

  public despawn() {
    if (this.hitboxElement) {
      this.hitboxElement.remove()
    }
    if (this.textElement) {
      this.textElement.remove()
    }
  }

  public update() {

  }

  public hit(iState?: PlayerState) {
    if (iState) {
      if (!iState.playerSet) {
        iState.playerSet = true
        iState.playerName = this.characterData.name
        iState.shootSound = new Howl({src: [this.characterData.firesound]})
        this.markedForDeletion = true
      }
    }
  }
}