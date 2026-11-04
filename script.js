
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const victoryScreen = document.getElementById('victoryScreen');
const videoScreen = document.getElementById('videoScreen');

const startBtn = document.getElementById('startBtn');
const revealBtn = document.getElementById('revealBtn');

const buttons = [...document.querySelectorAll('.color-btn')];
const levelText = document.getElementById('level');
const statusText = document.getElementById('status');
const description = document.getElementById('gameDescription');
const progressBar = document.getElementById('progressBar');
const attemptInfo = document.getElementById('attemptInfo');

let level = 1;
let sequence = [];
let playerSequence = [];
let canClick = false;
let mistakes = 0;
let gameToken = 0;

const levelLengths = [2, 3, 4, 5, 6];

function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
    });
    screen.classList.add('active');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomColor() {
    return Math.floor(Math.random() * 4);
}

function lightButton(index, duration = 500) {
    const button = buttons[index];
    button.classList.add('lit');

    setTimeout(() => {
        button.classList.remove('lit');
    }, duration);
}

function updateProgress() {
    progressBar.style.width = `${(level - 1) / 5 * 100}%`;
}

async function showSequence(token) {
    canClick = false;
    playerSequence = [];

    statusText.textContent = 'Смотри и запоминай...';
    description.textContent = 'Повтори цвета в том же порядке';

    await sleep(700);

    for (const color of sequence) {
        if (token !== gameToken) return;

        lightButton(color, 450);
        await sleep(750);
    }

    if (token !== gameToken) return;

    statusText.textContent = 'давай давааааййй❤️';
    canClick = true;
}

function startLevel() {
    const token = ++gameToken;

    levelText.textContent = level;
    updateProgress();

    sequence = Array.from(
        { length: levelLengths[level - 1] },
        randomColor
    );

    playerSequence = [];
    showSequence(token);
}

function handleClick(index) {
    if (!canClick) return;

    lightButton(index, 250);

    const expected = sequence[playerSequence.length];

    if (index !== expected) {
        canClick = false;
        mistakes++;

        statusText.textContent = 'ну не Попробуй ещё раз.';
        attemptInfo.textContent = `Попытка ${mistakes + 1}`;

        setTimeout(() => {
            startLevel();
        }, 1100);

        return;
    }

    playerSequence.push(index);

    if (playerSequence.length === sequence.length) {
        canClick = false;

        statusText.textContent = 'люблю тя  ❤️';
        progressBar.style.width = `${level / 5 * 100}%`;

        setTimeout(() => {
            if (level === 5) {
                showScreen(victoryScreen);
            } else {
                level++;
                startLevel();
            }
        }, 1000);
    }
}

buttons.forEach((button, index) => {
    button.addEventListener('click', () => handleClick(index));
});

startBtn.addEventListener('click', () => {
    level = 1;
    mistakes = 0;
    attemptInfo.textContent = '';
    showScreen(gameScreen);
    startLevel();
});

revealBtn.addEventListener('click', () => {
    showScreen(videoScreen);
    const video = document.getElementById('loveVideo');

    video.play().catch(() => {
        // Если браузер запретил автозапуск,
        // Рита сможет нажать Play сама.
    });
});
