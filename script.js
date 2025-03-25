// Sound Effects
const correctGuessSound = new Audio('correct-guess.mp3')
const wrongGuessSound = new Audio('wrong-guess.mp3')

// Word List
const wordList = [
  'gold', 'luck', 'clover', 'rain', 'charm', 
  'parade', 'leprechaun', 'treasure', 'celebration', 
  'greenery', 'shenanigans', 'tradition'
]

// Score Tracker
let wins = 0
let losses = 0

//declare variables
let selectedWord = ''
let displayedWord = ''
let wrongGuesses = 0
let guessedLetters = []
const maxMistakes = 6

// Start Game Function (runs everything)
function startGame(level) {
  //reset game
  wrongGuesses = 0
  guessedLetters = []

  selectedWord = getRandomWord(level)
  displayedWord = '_'.repeat(selectedWord.length)

  updateDifficultyDisplay(level)
  updateUI()
  
  //Show Game Area/Difficulty Display , hide selection buttons
  document.getElementById('gameArea').classList.remove('d-none')
  document.getElementById('difficultyBox').classList.remove('d-none')
  document.getElementById('difficultySelection').classList.add('d-none')
  
  // Reset shamrock image
  document.getElementById('shamrock').src = 'img/image6.jpg'
  
  // Reset wrong letters
  document.getElementById('wrongLetters').textContent = 'Wrong Guesses: '
  
  //Auto-focus on input
  document.getElementById('letterInput').focus()

  // Update Score Display
  updateScoreDisplay()
}

function getRandomWord(level) {
  let filteredWords = wordList.filter(word => {
    if (level === 'easy') return word.length <= 4
    if (level === 'medium') return word.length >= 5 && word.length <= 7
    if (level === 'hard') return word.length >= 8
  })
  return filteredWords[Math.floor(Math.random() * filteredWords.length)]
}

//update Difficulty Display
function updateDifficultyDisplay(level) {
  let difficultyBox = document.getElementById('difficultyBox')
  difficultyBox.classList.remove('easy', 'medium', 'hard')

  if (level === 'easy') {
    difficultyBox.textContent = 'Difficulty: Easy 🍀'
    difficultyBox.classList.add('easy')
  } else if (level === 'medium') {
    difficultyBox.textContent = 'Difficulty: Medium 🌟'
    difficultyBox.classList.add('medium')
  } else if (level === 'hard') {
    difficultyBox.textContent = 'Difficulty: Hard 💀'
    difficultyBox.classList.add('hard')
  }
}

function updateUI() {
  document.getElementById('wordDisplay').textContent = displayedWord.split('').join('  ') // Show word progress with spaces
}

function guessLetter() {
  let inputField = document.getElementById('letterInput') // Get input field
  let guessedLetter = inputField.value.toLowerCase() // Convert input to lowercase

  //Check if input is a valid letter (A-Z)
  if (!guessedLetter.match(/^[a-z]$/)){
    alert('Please enter a valid letter (A-Z)!')
    inputField.value = '' // Clear input field
    return // Exit function
  }
  
  //Check if letter was already guessed
  if(guessedLetters.includes(guessedLetter)){
    alert(`You already guessed '${guessedLetter}'. Try a different letter!`)
    inputField.value = '' // Clear input field
    return
  }

  //Store guessed letter
  guessedLetters.push(guessedLetter)

  //Check if guessed letter is in the selected word
  if (selectedWord.includes(guessedLetter)){
    correctGuessSound.play()
    updateCorrectGuess(guessedLetter)
  } else {
    wrongGuessSound.play()
    updateWrongGuess(guessedLetter)
  }

  inputField.value = '' // Clear input field
  document.getElementById('letterInput').focus() // Refocus input field for next guess
}

function updateWrongGuess(guessedLetter){ 
  wrongGuesses++
  document.getElementById('wrongLetters').textContent += ` ${guessedLetter}`
  document.getElementById('shamrock').src = `img/image${6-wrongGuesses}.jpg`

  if (wrongGuesses === maxMistakes){
    losses++
    showGameResult(false)
  }
}

function updateCorrectGuess(guessedLetter){
  let newDisplayedWord =''

  for (let i=0; i < selectedWord.length; i++){
    if (selectedWord[i] === guessedLetter){
      newDisplayedWord += guessedLetter // Replace underscore with correct letter
    }else{
      newDisplayedWord += displayedWord[i] // Keep existing correct letters
    }
  }

  displayedWord = newDisplayedWord
  updateUI()

  //  Check if the player has guessed all letters
  if (!displayedWord.includes('_')) {
    wins++
    showGameResult(true)
  }
}

function showGameResult(isWin) {
  updateScoreDisplay()
  
  // Determine message
  const messageElement = document.getElementById('resultMessage')
  const modalTitle = document.getElementById('resultTitle')
  
  if (isWin) {
    messageElement.textContent = 'Congratulations! You won!'
    modalTitle.textContent = 'Winner! 🎉'
    modalTitle.className = 'modal-title text-success'
  } else {
    messageElement.textContent = `Game Over! The word was: ${selectedWord}`
    modalTitle.textContent = 'Game Over 😢'
    modalTitle.className = 'modal-title text-danger'
  }
  
  // Show modal
  const resultModal = new bootstrap.Modal(document.getElementById('resultModal'))
  resultModal.show()
  
  // Auto reset after 3 seconds
  setTimeout(() => {
    resultModal.hide()
    resetToLevelSelection()
  }, 3000)
}

function updateScoreDisplay() {
  document.getElementById('scoreTracker').textContent = `Wins: ${wins} | Losses: ${losses}`
}

function resetToLevelSelection() {
  document.getElementById('gameArea').classList.add('d-none')
  document.getElementById('difficultyBox').classList.add('d-none')
  document.getElementById('difficultySelection').classList.remove('d-none')
  
  // Reset UI Elements
  document.getElementById('wrongLetters').textContent = 'Wrong Guesses: '
  document.getElementById('letterInput').value = ''
  document.getElementById('shamrock').src = 'img/image6.jpg'
}

// Add Enter key event listener
document.getElementById('letterInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    guessLetter()
  }
})