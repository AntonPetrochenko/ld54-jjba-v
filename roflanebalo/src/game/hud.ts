import { inputState } from "./engine/input";

const scoreContainer = document.createElement('div')

export function createHud() {
  document.body.appendChild(scoreContainer)
  scoreContainer.classList.add('hud')
}

export function refreshHud() {
  scoreContainer.innerHTML = '';


  inputState.forEach( (player) => {
    const playerScore = document.createElement('div')
    playerScore.classList.add('hudtext')
    playerScore.style.color = player.isLeftJoyCon ? 'blue' : 'red'
    
    if (player.health > 0) {
      playerScore.innerHTML = ` ${player.playerName.toUpperCase()} SCORE: ${player.score.toString().padStart(5, '0')} LIVES: ${player.health}`
    } else {
      playerScore.innerHTML = ` VMER SCORE: ${player.score.toString().padStart(5, '0')}`
    }
    scoreContainer.appendChild(playerScore)
  })
}