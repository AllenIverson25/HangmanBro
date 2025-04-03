
// Sound Effects - These are audio files that play during the game
// Each Audio object is initialized with the path to its sound file
const correctGuessSound = new Audio('correct-guess.mp3'); // Plays when a correct letter is guessed
const wrongGuessSound = new Audio('wrong-guess.mp3');     // Plays when a wrong letter is guessed
const gameOverSound = new Audio('gameover.mp3');          // Plays when the game is lost (6 seconds)
const winSound = new Audio('win.mp3');                    // Plays when the game is won (8 seconds)

// Background Audio for Welcome - Getting DOM elements for the welcome screen
// These elements handle the introduction sequence when the game first loads
const backgroundAudio = document.getElementById('backgroundAudio'); // Background music during intro
const welcomeVideo = document.getElementById('welcomeVideo');       // Welcome animation/video
const welcomeScreen = document.getElementById('welcomeScreen');     // Container for welcome content
const skipVideoBtn = document.getElementById('skipVideoBtn');       // Button to skip intro

// Word List - A list of St. Patrick's Day themed words to guess
// Words are categorized by length for different difficulty levels
const wordList = [
    'gold', 'luck', 'clover', 'rain', 'charm',           // Short words (easy)
    'parade', 'leprechaun', 'treasure', 'celebration',    // Medium and longer words
    'greenery', 'shenanigans', 'tradition'                // Longer words (hard)
];

// Score Tracker - Keeps track of wins and losses throughout gameplay sessions
let wins = 0;                    // Counter for games won
let losses = 0;                  // Counter for games lost

// Game Variables - These control the current game state
let selectedWord = '';           // The word the player needs to guess (selected from wordList)
let displayedWord = '';          // The word shown with underscores or revealed letters
let wrongGuesses = 0;            // Count of incorrect guesses (max is maxMistakes)
let guessedLetters = [];         // Array to track letters already guessed to prevent duplicates
const maxMistakes = 6;           // Maximum number of wrong guesses allowed before losing

// Welcome Video and Audio Handling
// This event listener runs when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Play the welcome video and background audio when page loads
    // .catch() handles any errors that might occur if media can't play
    welcomeVideo.play().catch(error => console.error('Video playback failed:', error));
    backgroundAudio.play().catch(error => console.error('Audio playback failed:', error));

    // Fade out and hide welcome screen after 14 seconds
    // Sets a timer to automatically end the welcome screen
    const fadeOutTimeout = setTimeout(() => {
        endWelcomeScreen();
    }, 14000); // 14 seconds duration for the welcome video

    // Skip button functionality - allows user to bypass the welcome video
    skipVideoBtn.addEventListener('click', () => {
        clearTimeout(fadeOutTimeout); // Cancel the automatic timeout
        endWelcomeScreen();           // Immediately end the welcome screen
    });

    // Ensure the game area is hidden initially until video finishes
    // This prevents the game from being visible during the welcome sequence
    document.getElementById('gameArea').classList.add('d-none');
    document.getElementById('difficultyBox').classList.add('d-none');
    document.getElementById('difficultySelection').classList.remove('d-none');
});

// Function to end the welcome screen
// This transitions from the intro to the game difficulty selection
function endWelcomeScreen() {
    welcomeScreen.style.display = 'none';     // Hide the welcome screen container
    backgroundAudio.pause();                   // Stop the background music
    backgroundAudio.currentTime = 0;           // Reset audio to beginning
    welcomeVideo.pause();                      // Stop the welcome video
    welcomeVideo.currentTime = 0;              // Reset video to beginning
}

// Start Game Function - Begins a new game with the chosen difficulty
// The level parameter is 'easy', 'medium', or 'hard'
function startGame(level) {
    // Reset game variables to start fresh
    wrongGuesses = 0;                          // Reset wrong guess counter
    guessedLetters = [];                       // Clear previously guessed letters
    selectedWord = getRandomWord(level);       // Pick a random word based on difficulty
    displayedWord = '_'.repeat(selectedWord.length);  // Set up underscores for each letter in the word

    // Update the display and show the game area
    updateDifficultyDisplay(level);            // Show the current difficulty on screen
    updateUI();                                // Update the word display with underscores

    // Show the game area and hide the difficulty selection
    // These toggle CSS classes to show/hide appropriate game elements
    document.getElementById('gameArea').classList.remove('d-none');
    document.getElementById('difficultyBox').classList.remove('d-none');
    document.getElementById('difficultySelection').classList.add('d-none');

    // Reset the shamrock image to full lives (6 shamrocks) and focus on input
    document.getElementById('shamrock').src = 'imgs/image6.jpg'; // Full health image
    document.getElementById('wrongLetters').textContent = 'Wrong Guesses: '; // Clear wrong guesses
    document.getElementById('letterInput').focus();              // Focus cursor on input field
    updateScoreDisplay();                                        // Update win/loss counter
}

// Get Random Word - Selects a word based on the difficulty level
// Filters the word list by length according to the specified difficulty
function getRandomWord(level) {
    let filteredWords = wordList.filter(word => {
        if (level === 'easy') return word.length <= 4;            // Easy: 4 letters or fewer
        if (level === 'medium') return word.length >= 5 && word.length <= 7; // Medium: 5-7 letters
        if (level === 'hard') return word.length >= 8;            // Hard: 8+ letters
    });
    // Return a random word from filtered list, or fallback to first word if none match
    return filteredWords[Math.floor(Math.random() * filteredWords.length)] || wordList[0];
}

// Update Difficulty Display - Shows the current difficulty on the screen
// Applies appropriate styling and text based on the selected difficulty
function updateDifficultyDisplay(level) {
    let difficultyBox = document.getElementById('difficultyBox');
    // Remove all difficulty classes to start fresh
    difficultyBox.classList.remove('difficulty-box', 'medium', 'hard');

    // Apply appropriate class and text based on difficulty level
    if (level === 'easy') {
        difficultyBox.textContent = 'Difficulty: Easy 🍀';         // Easy level with shamrock emoji
        difficultyBox.classList.add('difficulty-box');            // Basic styling
    } else if (level === 'medium') {
        difficultyBox.textContent = 'Difficulty: Medium 🌟';       // Medium level with star emoji
        difficultyBox.classList.add('difficulty-box', 'medium');  // Add medium-specific styling
    } else if (level === 'hard') {
        difficultyBox.textContent = 'Difficulty: Hard 💀';         // Hard level with skull emoji
        difficultyBox.classList.add('difficulty-box', 'hard');    // Add hard-specific styling
    }
}

// Update UI - Refreshes the word display with current progress
// Shows underscores for hidden letters and revealed letters for correct guesses
function updateUI() {
    // Add spaces between characters for better readability
    document.getElementById('wordDisplay').textContent = displayedWord.split('').join('  ');
}

// Guess Letter - Handles the player's letter input
// Processes the guessed letter and updates game state accordingly
function guessLetter() {
    let inputField = document.getElementById('letterInput');
    let guessedLetter = inputField.value.toLowerCase();  // Convert to lowercase for consistency

    // Check if the input is a single letter using regex
    if (!guessedLetter.match(/^[a-z]$/)) {
        alert('Please enter a valid letter (A-Z)!');     // Show error for invalid input
        inputField.value = '';                           // Clear the input field
        return;                                          // Exit function
    }

    // Check if the letter was already guessed to prevent duplicates
    if (guessedLetters.includes(guessedLetter)) {
        alert(`You already guessed '${guessedLetter}'. Try a different letter!`);
        inputField.value = '';                           // Clear the input field
        return;                                          // Exit function
    }

    // Add the guessed letter to the list of attempts
    guessedLetters.push(guessedLetter);

    // Check if the letter is in the word and handle accordingly
    if (selectedWord.includes(guessedLetter)) {
        correctGuessSound.play().catch(error => console.error('Correct guess sound failed:', error));
        updateCorrectGuess(guessedLetter);               // Process correct guess
    } else {
        wrongGuessSound.play().catch(error => console.error('Wrong guess sound failed:', error));
        updateWrongGuess(guessedLetter);                 // Process incorrect guess
    }

    // Clear the input and focus for the next guess
    inputField.value = '';                               // Reset input field
    document.getElementById('letterInput').focus();      // Return focus to input
}

// Update Correct Guess - Fills in the correct letter in the word
// Reveals all instances of the guessed letter in the word
function updateCorrectGuess(guessedLetter) {
    let newDisplayedWord = '';
    // Loop through each letter in the selected word
    for (let i = 0; i < selectedWord.length; i++) {
        if (selectedWord[i] === guessedLetter) {
            newDisplayedWord += guessedLetter;           // Reveal the guessed letter
        } else {
            newDisplayedWord += displayedWord[i];        // Keep existing state (letter or underscore)
        }
    }
    displayedWord = newDisplayedWord;                    // Update the displayed word
    updateUI();                                          // Refresh the display

    // Check if the player has won (no underscores remain)
    if (!displayedWord.includes('_')) {
        wins++;                                          // Increment win counter
        showGameResult(true);                            // Show win screen
    }
}

// Update Wrong Guess - Handles incorrect guesses and updates lives
// Decrements remaining lives and updates the shamrock image
function updateWrongGuess(guessedLetter) {
    wrongGuesses++;                                      // Increment wrong guess counter
    document.getElementById('wrongLetters').textContent += ` ${guessedLetter}`; // Add to wrong letters list
    const remainingHealth = maxMistakes - wrongGuesses;  // Calculate remaining lives
    // Update shamrock image, starting from image6.jpg down to image0.jpg
    document.getElementById('shamrock').src = `imgs/image${remainingHealth}.jpg`;

    // End game when no shamrocks remain (remainingHealth reaches 0)
    if (remainingHealth === 0) {
        losses++;                                        // Increment loss counter
        showGameResult(false);                           // Show game over screen
    }
}

// Show Game Result - Displays the end screen and plays sound
// Different handling for win vs loss conditions
function showGameResult(isWin) {
    updateScoreDisplay();                                // Update win/loss counters
    // Get references to end game overlay elements
    const overlay = document.getElementById('endGameOverlay');
    const endGameText = document.getElementById('endGameText');
    const endGameSubtext = document.getElementById('endGameSubtext');
    const restartBtn = document.getElementById('endGameRestartBtn');

    if (isWin) {
        // Handle win condition
        endGameText.textContent = 'YOU WIN!';            // Set main message
        endGameText.className = 'end-game-text win';     // Apply win styling
        endGameSubtext.textContent = 'Great job! You guessed the word!'; // Set congratulatory message
        winSound.play().catch(error => console.error('Win sound failed:', error)); // Play win sound
        setTimeout(() => {
            restartBtn.classList.remove('disabled-btn'); // Enable restart button after sound
        }, 6000);                                        // Wait 8 seconds for win sound
    } else {
        // Handle loss condition
        endGameText.textContent = 'GAME OVER';           // Set main message
        endGameText.className = 'end-game-text lose';    // Apply loss styling
        endGameSubtext.textContent = `The word was: ${selectedWord}`; // Reveal the word
        gameOverSound.play().catch(error => console.error('Game over sound failed:', error)); // Play game over sound
        setTimeout(() => {
            restartBtn.classList.remove('disabled-btn'); // Enable restart button after sound
        }, 4000);                                        // Wait 6 seconds for game over sound
    }

    overlay.style.display = 'flex';                      // Show the end game overlay
    restartBtn.classList.add('disabled-btn');            // Initially disable button until sound finishes
}

// Update Score Display - Shows the current wins and losses
// Updates the score tracker element with latest counts
function updateScoreDisplay() {
    document.getElementById('scoreTracker').textContent = `Wins: ${wins} | Losses: ${losses}`;
}

// Get Current Difficulty - Determines the current game difficulty
// Checks CSS classes to identify the active difficulty level
function getCurrentDifficulty() {
    const difficultyBox = document.getElementById('difficultyBox');
    // Check which difficulty class is present and return appropriate string
    if (difficultyBox.classList.contains('difficulty-box') && !difficultyBox.classList.contains('medium') && !difficultyBox.classList.contains('hard')) return 'easy';
    if (difficultyBox.classList.contains('medium')) return 'medium';
    if (difficultyBox.classList.contains('hard')) return 'hard';
}

// Reset to Level Selection - Returns to the main menu
// Resets game state and shows difficulty selection screen
function resetToLevelSelection() {
    const restartBtn = document.getElementById('endGameRestartBtn');
    // Prevent early restart while sound is still playing (button is disabled)
    if (restartBtn.classList.contains('disabled-btn')) return;

    // Reset all game state variables
    wrongGuesses = 0;
    guessedLetters = [];
    selectedWord = '';
    displayedWord = '';

    // Hide game area and show difficulty selection
    document.getElementById('gameArea').classList.add('d-none');
    document.getElementById('difficultyBox').classList.add('d-none');
    document.getElementById('difficultySelection').classList.remove('d-none');

    // Reset UI elements to initial state
    document.getElementById('wrongLetters').textContent = 'Wrong Guesses: ';
    document.getElementById('letterInput').value = '';
    document.getElementById('shamrock').src = 'imgs/image6.jpg'; // Reset to full health
    document.getElementById('endGameOverlay').style.display = 'none'; // Hide end game overlay
}

// Listen for Enter key to submit a guess
// Adds keyboard functionality for better user experience
document.getElementById('letterInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission
        guessLetter();      // Process the letter input
    }
});

// Function to skip the welcome video - Adds interactivity to the "Skip" button
skipVideoBtn.addEventListener('click', function() { // Attaches a click event listener to the skip button
    // Immediately hides the welcome screen when the "Skip" button is clicked
    welcomeScreen.style.display = 'none'; // Sets the CSS display property to 'none', removing the welcome screen from view
    // Ensures the main game content is visible
    document.querySelector('main').style.display = 'block'; // Forces the main content (game interface) to appear by setting its display to 'block'
});