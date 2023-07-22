import {
  SECONDS_TIMER_BEFORE_START_GAME,
  SECONDS_FOR_GAME,
} from "./helpers/constants.mjs";

const timer = document.getElementById("timer");
const textContainer = document.getElementById("text-container");
const gameTimer = document.getElementById("game-timer");
const gameTimerSeconds = document.getElementById("game-timer-seconds");
const readyStatusBtn = document.getElementById("ready-btn");
const quitRoomBtn = document.getElementById("quit-room-btn");

export class Game {
  #textForGame;
  #userList;
  #timerBefore = SECONDS_TIMER_BEFORE_START_GAME;
  #timerForGame = SECONDS_FOR_GAME;

  constructor({ text, list }) {
    this.#textForGame = text;
    this.#userList = list;
  }

  showElement = (...array) => {
    array.map((element) => element.classList.remove("display-none"));
  };

  hideElement = (...array) => {
    array.map((element) => element.classList.add("display-none"));
  };

  setTimerBefore = () => {
    let timerId = setInterval(() => {
      timer.textContent = this.#timerBefore;
      this.#timerBefore -= 1;

      if (this.#timerBefore === 0) {
        clearInterval(timerId);
        this.hideElement(timer);
        this.showElement(textContainer, gameTimer);
        this.setTimerForGame();
      }
    }, 1000);
  };

  setTimerForGame = () => {
    let timerId = setInterval(() => {
      gameTimerSeconds.textContent = this.#timerForGame;
      this.#timerForGame -= 1;

      if (this.#timerForGame === 0) {
        clearInterval(timerId);
        this.hideElement(textContainer, gameTimer);
      }
    }, 1000);
  };

  start() {
    this.showElement(timer);
    this.hideElement(readyStatusBtn, quitRoomBtn);
    console.log(this.#textForGame);
    textContainer.textContent = this.#textForGame;

    this.setTimerBefore();
  }
}
