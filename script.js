// Word List
const wordList = [
  "gold",
  "luck",
  "clover",
  "rain",
  "charm",
  "parade",
  "leprechaun",
  "treasure",
  "celebration",
  "greenery",
  "shenanigans",
  "tradition",
];

//decare variables
let selectedWord = "";
let displayedWord = "";
let wrongGuesses = 0;
let guessedLetters = [];
const maxMistakes = 6;

// Start Game Function (runs everything)
function startGame(level) {
  //reset game
  wrongGuesses = 0;
  guessedLetters = [];

  selectedWord = getRandomWord(level);
  displayedWord = "_".repeat(selectedWord.length);
  updateDifficultyDisplay(level);
  updateUI();

  //Show Game Area/Difficulty Display , hide selection buttons
  document.getElementById("gameArea").classList.remove("d-none");
  document.getElementById("gameArea").classList.add("d-block");

  document.getElementById("difficultyBox").classList.remove("d-none");
  document.getElementById("difficultyBox").classList.add("d-block");

  document.getElementById("difficultySelection").classList.add("d-none");
  //Auto focus on input
  document.getElementById("letterInput").focus();
}

function getRandomWord(level) {
  let filteredWords = wordList.filter((word) => {
    if (level === "easy") return word.length <= 4;
    if (level === "medium") return word.length >= 5 && word.length <= 7;
    if (level === "hard") return word.length >= 8;
  });
  return filteredWords[Math.floor(Math.random() * filteredWords.length)];
}

//update Difficulty Display
function updateDifficultyDisplay(level) {
  let difficultyBox = document.getElementById("difficultyBox");
  difficultyBox.classList.remove("easy", "medium", "hard");

  if (level === "easy") {
    difficultyBox.textContent = "Difficulty: Easy 🍀";
    difficultyBox.classList.add("easy");
  } else if (level === "medium") {
    difficultyBox.textContent = "Difficulty: Medium 🌟";
    difficultyBox.classList.add("medium");
  } else if (level === "hard") {
    difficultyBox.textContent = "Difficulty: Hard 💀";
    difficultyBox.classList.add("hard");
  }
}

function updateUI() {
  document.getElementById("wordDisplay").textContent = displayedWord
    .split("")
    .join(" ");
}

function guessLetter() {
  let inputField = document.getElementById("letterInput"); // Get the input field
  let gusssedLetter = inputField.value.toLowerCase(); // Convert to lowercase
  // check if the input is a letter
  if (!gusssedLetter.match(/^[a-z]$/)) {
    alert("Please enter a letter from a-z"); // Show an alert
    inputField.value = ""; // Clear the input field
    return; // Exit the function
  }
  // check if the letter is in the word
  if (guessedLetters.includes(gusssedLetter)) {
    alert(`You already guessed ${guessedLetter}. Try Again`); // Show an alert
    inputField.value = '';
    return;
  }

  guessedLetters.push(gusssedLetter); // Add the guessed letter to the guessedLetters array

  // Check if the guessed letter is in the selected word

  if (selectedWord.includes(gusssedLetter)) {
   updateCorrectGuesses(gusssedLetter)
} else {
    updateWrongGuesses(guessLetter);
  }

inputField.value = ''; // Clear the input field
document.getElementById('letterInput').focus(); // Auto focus on input



}