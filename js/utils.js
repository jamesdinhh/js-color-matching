import { getColorBackground, getPlayAgainButton, getTimerElement } from "./selectors.js";

function shuffle(arr) {
    if (!Array.isArray(arr) || arr.length <2) return arr;
    for (let i = arr.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * i);

        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;

    }
}

export const getRandomColorPairs = (count) => {
    const colorList = [];
    const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome'];

    for (let i = 0; i < count; i++) {
        const color = window.randomColor({
            luminosity: 'dark',
            hue: hueList[i % hueList.length],
        })
        colorList.push(color);
    }
    // double color list
    const fullColorList = [...colorList, ...colorList]
    // shuffle color list
    shuffle(fullColorList);
    return fullColorList;
}

export function showPlayAgainButton() {
    const playAgainButton = getPlayAgainButton()
    if (playAgainButton) playAgainButton.classList.add('show')
    console.log('object');
}
export function hidePlayAgainButton() {
    const playAgainButton = getPlayAgainButton()
    if (playAgainButton) playAgainButton.classList.remove('show')
}

export function setTimerText(text) {
    const timerElement = getTimerElement();
    if (timerElement) timerElement.textContent = text;
}

export function createTimer(seconds, onChange, onFinish) {
    let intervalId = null

    function start() {
        clear()
        let currentSecond = seconds
        intervalId = setInterval(() =>{
            // if(onChange) onChange(currentSecond)
            onChange?.(currentSecond)
            currentSecond--;
            if(currentSecond = 0) {
                clear();
                onFinish?.()
            }
        }, 1000)
    }
    function clear() {
        clearInterval(intervalId)
    }

    return {
        start,
        clear,
    }
}

export function setBackgroundColor(color) {
    const backgroundColor = getColorBackground();
    if (backgroundColor) backgroundColor.style.backgroundColor = color;
}