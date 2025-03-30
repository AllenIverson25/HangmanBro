// Sound Effects
const correctGuessSound = new Audio('correct-guess.mp3');
const wrongGuessSound = new Audio('wrong-guess.mp3');
const gameOverSound = new Audio('gameover.mp3');
const winSound = new Audio('win.mp3');

// Word List
const wordList = [
    'gold', 'luck', 'clover', 'rain', 'charm',
    'parade', 'leprechaun', 'treasure', 'celebration',
    'greenery', 'shenanigans', 'tradition'
];

// Score Tracker
let wins = 0;
let losses = 0;

// Game Variables
let selectedWord = '';
let displayedWord = '';
let wrongGuesses = 0;
let guessedLetters = [];
const maxMistakes = 6;

// Start Game Function
function startGame(level) {
    wrongGuesses = 0;
    guessedLetters = [];
    selectedWord = getRandomWord(level);
    displayedWord = '_'.repeat(selectedWord.length);

    updateDifficultyDisplay(level);
    updateUI();

    document.getElementById('gameArea').classList.remove('d-none');
    document.getElementById('difficultyBox').classList.remove('d-none');
    document.getElementById('difficultySelection').classList.add('d-none');

    document.getElementById('shamrock').src = 'imgs/image6.jpg';
    document.getElementById('wrongLetters').textContent = 'Wrong Guesses: ';
    document.getElementById('letterInput').focus();
    updateScoreDisplay();
}

function getRandomWord(level) {
    let filteredWords = wordList.filter(word => {
        if (level === 'easy') return word.length <= 4;
        if (level === 'medium') return word.length >= 5 && word.length <= 7;
        if (level === 'hard') return word.length >= 8;
    });
    return filteredWords[Math.floor(Math.random() * filteredWords.length)];
}

function updateDifficultyDisplay(level) {
    let difficultyBox = document.getElementById('difficultyBox');
    difficultyBox.classList.remove('difficulty-box', 'medium', 'hard');

    if (level === 'easy') {
        difficultyBox.textContent = 'Difficulty: Easy 🍀';
        difficultyBox.classList.add('difficulty-box');
    } else if (level === 'medium') {
        difficultyBox.textContent = 'Difficulty: Medium 🌟';
        difficultyBox.classList.add('difficulty-box', 'medium');
    } else if (level === 'hard') {
        difficultyBox.textContent = 'Difficulty: Hard 💀';
        difficultyBox.classList.add('difficulty-box', 'hard');
    }
}

function updateUI() {
    document.getElementById('wordDisplay').textContent = displayedWord.split('').join('  ');
}

function guessLetter() {
    let inputField = document.getElementById('letterInput');
    let guessedLetter = inputField.value.toLowerCase();

    if (!guessedLetter.match(/^[a-z]$/)) {
        alert('Please enter a valid letter (A-Z)!');
        inputField.value = '';
        return;
    }
    
    if (guessedLetters.includes(guessedLetter)) {
        alert(`You already guessed '${guessedLetter}'. Try a different letter!`);
        inputField.value = '';
        return;
    }

    guessedLetters.push(guessedLetter);

    if (selectedWord.includes(guessedLetter)) {
        correctGuessSound.play();
        updateCorrectGuess(guessedLetter);
    } else {
        wrongGuessSound.play();
        updateWrongGuess(guessedLetter);
    }

    inputField.value = '';
    document.getElementById('letterInput').focus();
}

function updateWrongGuess(guessedLetter) {
    wrongGuesses++;
    document.getElementById('wrongLetters').textContent += ` ${guessedLetter}`;
    const remainingHealth = maxMistakes - wrongGuesses;
    document.getElementById('shamrock').src = `imgs/image${remainingHealth + 1}.jpg`;

    if (wrongGuesses === maxMistakes) {
        losses++;
        showGameResult(false);
    }
}

function updateCorrectGuess(guessedLetter) {
    let newDisplayedWord = '';
    for (let i = 0; i < selectedWord.length; i++) {
        if (selectedWord[i] === guessedLetter) {
            newDisplayedWord += guessedLetter;
        } else {
            newDisplayedWord += displayedWord[i];
        }
    }
    displayedWord = newDisplayedWord;
    updateUI();

    if (!displayedWord.includes('_')) {
        wins++;
        showGameResult(true);
    }
}

function showGameResult(isWin) {
    updateScoreDisplay();
    const overlay = document.getElementById('endGameOverlay');
    const endGameText = document.getElementById('endGameText');
    const endGameSubtext = document.getElementById('endGameSubtext');
    const restartBtn = document.getElementById('endGameRestartBtn');

    if (isWin) {
        endGameText.textContent = 'YOU WIN!';
        endGameText.className = 'end-game-text win';
        endGameSubtext.textContent = 'Great job! You guessed the word!';
        winSound.play();
        setTimeout(() => {
            restartBtn.classList.remove('disabled-btn');
        }, 6000); // 8 seconds for win sound
    } else {
        endGameText.textContent = 'GAME OVER';
        endGameText.className = 'end-game-text lose';
        endGameSubtext.textContent = `The word was: ${selectedWord}`;
        gameOverSound.play();
        setTimeout(() => {
            restartBtn.classList.remove('disabled-btn');
        }, 4000); // 6 seconds for game over sound
    }

    overlay.style.display = 'flex';
    restartBtn.classList.add('disabled-btn');
}

function updateScoreDisplay() {
    document.getElementById('scoreTracker').textContent = `Wins: ${wins} | Losses: ${losses}`;
}

function getCurrentDifficulty() {
    const difficultyBox = document.getElementById('difficultyBox');
    if (difficultyBox.classList.contains('difficulty-box') && !difficultyBox.classList.contains('medium') && !difficultyBox.classList.contains('hard')) return 'easy';
    if (difficultyBox.classList.contains('medium')) return 'medium';
    if (difficultyBox.classList.contains('hard')) return 'hard';
}

function resetToLevelSelection() {
    const restartBtn = document.getElementById('endGameRestartBtn');
    if (restartBtn.classList.contains('disabled-btn')) return;

    wrongGuesses = 0;
    guessedLetters = [];
    selectedWord = '';
    displayedWord = '';
    
    document.getElementById('gameArea').classList.add('d-none');
    document.getElementById('difficultyBox').classList.add('d-none');
    document.getElementById('difficultySelection').classList.remove('d-none');
    
    document.getElementById('wrongLetters').textContent = 'Wrong Guesses: ';
    document.getElementById('letterInput').value = '';
    document.getElementById('shamrock').src = 'imgs/image6.jpg';
    document.getElementById('endGameOverlay').style.display = 'none';
}

document.getElementById('letterInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        guessLetter();
    }
});