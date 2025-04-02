// Sound Effects - These are audio files that play during the game
const correctGuessSound = new Audio('correct-guess.mp3'); // Plays when a correct letter is guessed
const wrongGuessSound = new Audio('wrong-guess.mp3');     // Plays when a wrong letter is guessed
const gameOverSound = new Audio('gameover.mp3');          // Plays when the game is lost (6 seconds)
const winSound = new Audio('win.mp3');                    // Plays when the game is won (8 seconds)

// Background Audio for Welcome
const backgroundAudio = document.getElementById('backgroundAudio');
const welcomeVideo = document.getElementById('welcomeVideo');
const welcomeScreen = document.getElementById('welcomeScreen');

// Word List - A list of St. Patrick's Day themed words to guess
const wordList = [
    'gold', 'luck', 'clover', 'rain', 'charm',
    'parade', 'leprechaun', 'treasure', 'celebration',
    'greenery', 'shenanigans', 'tradition', "    "
];

// Score Tracker - Keeps track of wins and losses
let wins = 0;
let losses = 0;

// Game Variables - These control the current game state
let selectedWord = '';           // The word the player needs to guess
let displayedWord = '';          // The word shown with underscores or letters
let wrongGuesses = 0;            // Count of incorrect guesses
let guessedLetters = [];         // List of letters already guessed
const maxMistakes = 6;           // Maximum number of wrong guesses allowed

// Welcome Video and Audio Handling
document.addEventListener('DOMContentLoaded', () => {
    // Play the welcome video and background audio
    welcomeVideo.play();
    backgroundAudio.play();

    // Fade out and hide welcome screen after 14 seconds
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        backgroundAudio.pause(); // Stop the background audio after video
        backgroundAudio.currentTime = 0; // Reset audio
    }, 14000); // 14 seconds

    // Ensure the game area is hidden initially until video finishes
    document.getElementById('gameArea').classList.add('d-none');
    document.getElementById('difficultyBox').classList.add('d-none');
    document.getElementById('difficultySelection').classList.remove('d-none');
});

// Start Game Function - Begins a new game with the chosen difficulty
function startGame(level) {
    // Reset game variables to start fresh
    wrongGuesses = 0;
    guessedLetters = [];
    selectedWord = getRandomWord(level);  // Pick a random word based on difficulty
    displayedWord = '_'.repeat(selectedWord.length);  // Set up underscores for the word

    // Update the display and show the game area
    updateDifficultyDisplay(level);
    updateUI();

    // Show the game area and hide the difficulty selection
    document.getElementById('gameArea').classList.remove('d-none');
    document.getElementById('difficultyBox').classList.remove('d-none');
    document.getElementById('difficultySelection').classList.add('d-none');

    // Reset the shamrock image to full lives (6 shamrocks) and focus on input
    document.getElementById('shamrock').src = 'imgs/image6.jpg';
    document.getElementById('wrongLetters').textContent = 'Wrong Guesses: ';
    document.getElementById('letterInput').focus();
    updateScoreDisplay();
}

// Get Random Word - Selects a word based on the difficulty level
function getRandomWord(level) {
    let filteredWords = wordList.filter(word => {
        if (level === 'easy') return word.length <= 4;
        if (level === 'medium') return word.length >= 5 && word.length <= 7;
        if (level === 'hard') return word.length >= 8;
    });
    return filteredWords[Math.floor(Math.random() * filteredWords.length)] || wordList[0]; // Fallback to first word if none match
}

// Update Difficulty Display - Shows the current difficulty on the screen
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

// Update UI - Refreshes the word display with current progress
function updateUI() {
    document.getElementById('wordDisplay').textContent = displayedWord.split('').join('  ');
}

// Guess Letter - Handles the player's letter input
function guessLetter() {
    let inputField = document.getElementById('letterInput');
    let guessedLetter = inputField.value.toLowerCase();

    // Check if the input is a single letter
    if (!guessedLetter.match(/^[a-z]$/)) {
        alert('Please enter a valid letter (A-Z)!');
        inputField.value = '';
        return;
    }

    // Check if the letter was already guessed
    if (guessedLetters.includes(guessedLetter)) {
        alert(`You already guessed '${guessedLetter}'. Try a different letter!`);
        inputField.value = '';
        return;
    }

    // Add the guessed letter to the list
    guessedLetters.push(guessedLetter);

    // Check if the letter is in the word
    if (selectedWord.includes(guessedLetter)) {
        correctGuessSound.play();
        updateCorrectGuess(guessedLetter);
    } else {
        wrongGuessSound.play();
        updateWrongGuess(guessedLetter);
    }

    // Clear the input and focus for the next guess
    inputField.value = '';
    document.getElementById('letterInput').focus();
}

// Update Correct Guess - Fills in the correct letter in the word
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

    // Check if the player has won
    if (!displayedWord.includes('_')) {
        wins++;
        showGameResult(true);
    }
}

// Update Wrong Guess - Handles incorrect guesses and updates lives
function updateWrongGuess(guessedLetter) {
    wrongGuesses++;
    document.getElementById('wrongLetters').textContent += ` ${guessedLetter}`;
    const remainingHealth = maxMistakes - wrongGuesses;
    // Update shamrock image, starting from image6.jpg down to image0.jpg
    document.getElementById('shamrock').src = `imgs/image${remainingHealth}.jpg`;

    // End game when no shamrocks remain (remainingHealth reaches 0)
    if (remainingHealth === 0) {
        losses++;
        showGameResult(false);
    }
}

// Show Game Result - Displays the end screen and plays sound
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
        }, 6000); // Wait 8 seconds for win sound
    } else {
        endGameText.textContent = 'GAME OVER';
        endGameText.className = 'end-game-text lose';
        endGameSubtext.textContent = `The word was: ${selectedWord}`;
        gameOverSound.play();
        setTimeout(() => {
            restartBtn.classList.remove('disabled-btn');
        }, 4000); // Wait 6 seconds for game over sound
    }

    overlay.style.display = 'flex';
    restartBtn.classList.add('disabled-btn');
}

// Update Score Display - Shows the current wins and losses
function updateScoreDisplay() {
    document.getElementById('scoreTracker').textContent = `Wins: ${wins} | Losses: ${losses}`;
}

// Get Current Difficulty - Determines the current game difficulty
function getCurrentDifficulty() {
    const difficultyBox = document.getElementById('difficultyBox');
    if (difficultyBox.classList.contains('difficulty-box') && !difficultyBox.classList.contains('medium') && !difficultyBox.classList.contains('hard')) return 'easy';
    if (difficultyBox.classList.contains('medium')) return 'medium';
    if (difficultyBox.classList.contains('hard')) return 'hard';
}

// Reset to Level Selection - Returns to the main menu
function resetToLevelSelection() {
    const restartBtn = document.getElementById('endGameRestartBtn');
    if (restartBtn.classList.contains('disabled-btn')) return; // Wait for sound to finish

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

// Listen for Enter key to submit a guess
document.getElementById('letterInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission
        guessLetter();
    }
});