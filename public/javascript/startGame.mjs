import {
  SECONDS_TIMER_BEFORE_START_GAME,
  SECONDS_FOR_GAME,
  PROGRESS,
} from "./helpers/constants.mjs";
import { setProgress } from "./views/user.mjs";

const timer = document.getElementById("timer");
const textContainer = document.getElementById("text-container");
const gameTimer = document.getElementById("game-timer");
const gameTimerSeconds = document.getElementById("game-timer-seconds");
const readyStatusBtn = document.getElementById("ready-btn");
const quitRoomBtn = document.getElementById("quit-room-btn");

let index = 0;

const countProgress = (text, number) => {
  const progress = (PROGRESS / text.length) * number;
  return progress;
};

const typingText = (text, user) => {
  return (event) => {
    if (event.key === text[index]) {
      index += 1;
      let range = new Range();
      const content = textContainer.firstChild;
      range.setStart(content, 0);
      range.setEnd(content, index);
      const selection = document.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      const progress = countProgress(text, index);
      setProgress({ username: user, progress });
    }
  };
};

export class Game {
  #textForGame;
  #userList;
  #functionForTyping;
  #timerBefore = SECONDS_TIMER_BEFORE_START_GAME;
  #timerForGame = SECONDS_FOR_GAME;

  constructor({ text, list, user }) {
    this.#textForGame = text;
    this.#userList = list;
    this.#functionForTyping = typingText(text, user);
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

      if (this.#timerBefore < 0) {
        clearInterval(timerId);
        this.hideElement(timer);
        this.showElement(textContainer, gameTimer);
        this.setTimerForGame();
        document.addEventListener("keydown", this.#functionForTyping);
      }
    }, 1000);
  };

  setTimerForGame = () => {
    let timerId = setInterval(() => {
      gameTimerSeconds.textContent = this.#timerForGame;
      this.#timerForGame -= 1;

      if (this.#timerForGame === 0) {
        clearInterval(timerId);
        document.removeEventListener("keydown", this.#functionForTyping);
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
