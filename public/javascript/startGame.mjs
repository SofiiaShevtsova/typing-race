import {
  SECONDS_TIMER_BEFORE_START_GAME,
  SECONDS_FOR_GAME,
  PROGRESS,
} from "./helpers/constants.mjs";
import { setProgress } from "./views/user.mjs";
import { gameResult, sendUserProgress } from "./room.mjs";

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
      const range = new Range();
      const content = textContainer.firstChild;
      range.setStart(content, 0);
      range.setEnd(content, index);
      const selection = document.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      if (index === text.length - 1) {
        setProgress({ username: user, progress: 100 });
        sendUserProgress({ username: user, progress: 100 });
        document.removeEventListener("keydown", functionForTyping);
      }
      const progress = countProgress(text, index);
      setProgress({ username: user, progress });
      sendUserProgress({ username: user, progress });
    }
  };
};

export class Game {
  #textForGame;
  #user;
  #timerBefore = SECONDS_TIMER_BEFORE_START_GAME;
  #timerForGame = SECONDS_FOR_GAME;

  constructor({ text, user }) {
    this.#textForGame = text;
    this.#user = user;
  }

  showElement = (...array) => {
    array.map((element) => element.classList.remove("display-none"));
  };

  hideElement = (...array) => {
    array.map((element) => element.classList.add("display-none"));
  };

  setTimerBefore = (functionForTyping) => {
    let timerId = setInterval(() => {
      timer.textContent = this.#timerBefore;
      this.#timerBefore -= 1;

      if (this.#timerBefore < 0) {
        clearInterval(timerId);
        this.hideElement(timer);
        this.showElement(textContainer, gameTimer);
        this.setTimerForGame();
        document.addEventListener("keydown", functionForTyping);
      }
    }, 1000);
  };

  setTimerForGame = (functionForTyping) => {
    let timerId = setInterval(() => {
      gameTimerSeconds.textContent = this.#timerForGame;
      this.#timerForGame -= 1;

      if (this.#timerForGame === 0) {
        clearInterval(timerId);
        document.removeEventListener("keydown", functionForTyping);
        gameResult(this.#user);
        this.hideElement(textContainer, gameTimer);
      }
    }, 1000);
  };

  start() {
    this.showElement(timer);
    this.hideElement(readyStatusBtn, quitRoomBtn);
    textContainer.textContent = this.#textForGame;
    const functionForTyping = typingText(this.#textForGame, this.#user);
    this.setTimerBefore(functionForTyping);
  }
}
