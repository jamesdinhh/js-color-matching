import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from "./constants.js";
import { getColorElementList, getColorListElement, getInActiveColorList, getPlayAgainButton} from "./selectors.js";
import { createTimer, getRandomColorPairs, hidePlayAgainButton, setTimerText, showPlayAgainButton, setBackgroundColor } from "./utils.js";

//Global variables
let selections = [];
let gameState = GAME_STATUS.PLAYING;
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleChange,
  onFinish: handleFinish,
})

function handleChange(second) {
  const fullSecond = `0${second}`.slice(-2)
  setTimerText(fullSecond)
}

function handleFinish() {
  console.log('finish');
  gameState = GAME_STATUS.FINISHED
  setTimerText('YOU LOSE 😏');
  showPlayAgainButton()
}

function handleColorClick(liElement) {
  const shouldBlockClick = [GAME_STATUS.FINISHED, GAME_STATUS.BLOCKING].includes(gameState);

  const isClicked = liElement.classList.contains('active');
  if (!liElement || shouldBlockClick || isClicked) return;
  // console.log(liElement);
  liElement.classList.add('active');

  selections.push(liElement);
  if(selections.length < 2) return;

  // check match
  const firstColor = selections[0].dataset.color;
  const secondColor = selections[1].dataset.color;
  const isMatch = firstColor === secondColor;
  if (isMatch) {
    setBackgroundColor(firstColor)
    //check win
     const isWin = getInActiveColorList().length === 0;
     if (isWin) {
      //show replay
      showPlayAgainButton()
      // show you win
      setTimerText('YOU WIN 🤌');
      timer.clear()
      gameState = GAME_STATUS.FINISHED;
     }
    selections = [];
    return;
  }
  gameState = GAME_STATUS.BLOCKING;

  //in case not match
  setTimeout(() => {
    // console.log('object');
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')

  //reset
    selections = [];

  //race-condition
    if (gameState !== GAME_STATUS.FINISHED) {
      gameState = GAME_STATUS.PLAYING;
    }
  }, 500)
}

function initColors() {
  //random
  const colorList = getRandomColorPairs(PAIRS_COUNT);
  
  //bind li to div.overlay elements
  const liList = getColorElementList();
  liList.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index];

    const overlayElement = liElement.querySelector('.overlay');
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index];
  })
}

function attachEventForColorList() {
  const ulElement = getColorListElement();
  if (!ulElement) return;

  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return;
    handleColorClick(event.target);
  }
  )
}

function resetGame() {
  // reset global vars -> reset DOM elements -> generate new colors
  gameState = GAME_STATUS.PLAYING;
  selections = [];

  const colorElementList = getColorElementList();
  for (const colorElement of colorElementList) {
    colorElement.classList.remove('active')
  }
  hidePlayAgainButton();
  setTimerText('');
  initColors();
  setBackgroundColor('goldenrod')
  startTimer()
}

function attachEventForPlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (!playAgainButton) return;
  playAgainButton.addEventListener('click', resetGame)  
}

function startTimer() {
   timer.start()
};

(() => {
  initColors();
  attachEventForColorList();
  attachEventForPlayAgainButton();
  startTimer();
}) ()
