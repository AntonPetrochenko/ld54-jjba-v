import { Character } from "./characters";
import { PlayerState } from "./engine/input";
import { GameObject } from "./game";

import { Howl } from "howler";

export class CharacterSelector implements GameObject {
  
  characterData: Character
  hitboxElement?: HTMLElement | undefined;
  markedForDeletion = false

  posX: number
  posY: number

  constructor(c: Character, x: number, y: number) {
    this.characterData = c
    this.posX = x
    this.posY = y
  }
  
  public spawn() {
    let icon = document.createElement('img')
    icon.classList.add('mobile')
    icon.src = this.characterData.image

    icon.style.left = `${this.posX}px`
    icon.style.top = `${this.posY}px`
    document.body.appendChild(icon)
    this.hitboxElement = icon
  }

  public despawn() {
    if (this.hitboxElement) {
      this.hitboxElement.remove()
    }
  }

  public update() {

  }

  public hit(iState?: PlayerState) {
    if (iState) {
      iState.playerName = this.characterData.name
      iState.shootSound = new Howl({src: [this.characterData.firesound]})
      this.markedForDeletion = true
    }
  }
}