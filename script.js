// Word List
const wordList = [
    'gold',
    'luck',
    'clover',
    'rain',
    'charm',
    'parade',
    'leprechaun',
    'treasure',
    'celebration',
    'greenery',
    'shenanigans',
    'tradition'
  ]
  
  //decare variables
  let selectedWord = ''
  let displayedWord = ''
  let wrongGuesses = 0
  let guessedLetters = []
  const maxMistakes = 6
  
  // Start Game Function (runs everything)
  function startGame (level) {
    //reset game
    wrongGuesses = 0
    guessedLetters = []
  
    selectedWord = getRandomWord(level)
  
    updateDifficultyDisplay(level)
    
  
    //Show Game Area/Difficulty Display , hide selection buttons
    document.getElementById('gameArea').classList.remove('d-none')
    document.getElementById('gameArea').classList.add('d-block')
  
    document.getElementById('difficultyBox').classList.remove('d-none')
    document.getElementById('difficultyBox').classList.add('d-block')
  
    document.getElementById('difficultySelection').classList.add('d-none')
  }
  
  function getRandomWord (level) {
    let filteredWords = wordList.filter(word => {
      if (level === 'easy') return word.length <= 4
      if (level === 'medium') return word.length >= 5 && word.length <= 7
      if (level === 'hard') return word.length >= 8
    })
    return filteredWords[Math.floor(Math.random() * filteredWords.length)]
  }
  
  //update Difficulty Display
  function updateDifficultyDisplay (level) {
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