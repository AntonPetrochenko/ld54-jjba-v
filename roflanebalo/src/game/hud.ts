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
    playerScore.innerHTML = `SCORE: ${player.score}`
    playerScore.classList.add('hudtext')
    playerScore.style.color = player.isLeftJoyCon ? 'red' : 'blue'

    scoreContainer.appendChild(playerScore)
  })
}