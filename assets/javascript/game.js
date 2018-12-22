
// Assign variables to each important html tag
var mainContainer = document.getElementById("main-container");
var resultDiv = document.getElementById("result");
var h2Result = document.getElementById("h2-result");
var resultPara = document.getElementById("p-result");
var winsPara = document.getElementById("wins");
var currentWordPara = document.getElementById("current-word");
var guessesRemainingPara = document.getElementById("guesses-remaining");
var lettersGuessedPara = document.getElementById("letters-guessed");
var h1 = document.getElementById("h1");
var gamePrompt = document.getElementById("game-prompt");

// Declare and initialize additional variables
const maxGuesses = 7;
var isSolved = false;
var guessesRemaining = maxGuesses;
var wins = 0;
var currentWord = '';
var hiddenWord = '';
var meow = new Audio('assets/sounds/meow.mp3');
var angryMeow = new Audio('assets/sounds/angry-meow.mp3');
var letterChoices ='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var lettersGuessed = [' ']; // Space character is given in case of multi-word answers

// Create array to hold our cat breeds
var catBreeds = [ "Abyssinian",
                  "American Bobtail",
                  "American Curl",
                  "American Shorthair",
                  "American Wirehair",
                  "Balinese",
                  "Bengal",
                  "Birman",
                  "Bombay",
                  "British Shorthair",
                  "Burmese",
                  "Burmilla",
                  "Chartreux",
                  "Chinese Li Hua",
                  "Colorpoint Shorthair",
                  "Cornish Rex",
                  "Cymric",
                  "Devon Rex",
                  "Egyptian Mau",
                  "European Burmese",
                  "Havana Brown",
                  "Himalayan",
                  "Japanese Bobtail",
                  "Javanese",
                  "Korat",
                  "LaPerm",
                  "Maine Coon",
                  "Manx",
                  "Nebelung",
                  "Norwegian Forest",
                  "Ocicat",
                  "Persian",
                  "Ragamuffin",
                  "Ragdoll",
                  "Russian Blue",
                  "Savannah",
                  "Scottish Fold",
                  "Selkirk Rex",
                  "Siamese",
                  "Siberian",
                  "Singapura",
                  "Snowshoe",
                  "Somali",
                  "Sphynx",
                  "Tonkinese",
                  "Turkish Angora",
                  "Turkish Van" ];

//---------- FUNCTION DEFINITIONS ----------//

// Select random array element (for getting random cat breed)
function getRandomArrayElement(myArray) {
  return myArray[Math.floor(Math.random() * myArray.length)].toUpperCase();
}

// Initialize variables for next round
function initialize() {
  // Reset all values
  mainContainer.style.display = 'block';
  result.style.display = 'none';
  h1.innerHTML = "Guess the cat breed";
  gamePrompt.innerHTML = "Press any key to get started!";
  guessesRemaining = maxGuesses;
  isSolved = false;
  lettersGuessed = [];

  // Reset DOM display
  guessesRemainingPara.innerHTML = guessesRemaining;
  lettersGuessedPara.innerHTML = '';

  // Choose a new cat
  currentWord = getRandomArrayElement(catBreeds);
  console.log(currentWord); // for testing
  
  // Show unknown word as series of underscores
  hiddenWord = getBlankWord(currentWord)
  currentWordPara.innerHTML = displayBlankWord(hiddenWord);
}

// Show hidden word as underscores (except space and hyphen chars)
function getBlankWord(word) {
  var blankWord = '';
  for (var i = 0; i < word.length; i++) {
    if (word[i] === ' ') {
      blankWord += ' ';
    }
    else if (word[i] === '-') {
      blankWord += '-';
    }
    else {
      blankWord += "_";
    }
  }
  return blankWord;
}

// Create version of the blank word that is more legible
function displayBlankWord(word) {
  var blankWord = '';
  for (var i = 0; i < word.length; i++) {
    if (word[i] === ' ') {
      blankWord += '&nbsp;&nbsp;&nbsp;'
    }
    else { 
      blankWord += word[i] + ' ';
    }
  }
  return blankWord.trim();
}

// Update blank word with each correct guess
function updateBlankWord(word, blankWord, letter) { ;
  var newBlankWord = '';
  for (var i = 0; i < word.length; i++) {
    if (word[i] === letter) {
     newBlankWord += letter;
    }
    else {
      newBlankWord += blankWord[i];
    }
  }
  return newBlankWord;
}

// Check whether the word has been guessed
function checkProgress(word) {
  return !(word.includes('_'));
}

//---------- END FUNCTION DEFINITIONS ----------//

initialize();

document.onkeyup = function (event) {
  var guess = event.key.toUpperCase();

  // Prevent keystrokes from registering if game is over
  if ((isSolved) || (guessesRemaining == 0)) {
    return;
  }

  // Ignore input if not a letter
  if ( !(letterChoices.includes(guess)) ) {
    return;
  }

  // Check to see if letter has already been guessed
  if (lettersGuessed.includes(guess)) {
    alert("You've already guessed that letter.");
    return;
  }

  // Check if guessed letter is in the word
  // If so, fill in blanks. If not, add letter to 
  // guessed letters and decrease remaining guesses
  if (currentWord.includes(guess)) {
    hiddenWord = updateBlankWord(currentWord, hiddenWord, guess);
    lettersGuessed.push(guess);
    lettersGuessedPara.innerHTML += guess + ' ';
    currentWordPara.innerHTML = displayBlankWord(hiddenWord);
  } 
  else {
    lettersGuessed.push(guess);
    lettersGuessedPara.innerHTML += guess + ' ';
    guessesRemainingPara.innerHTML = isSolved ? guessesRemaining : --guessesRemaining;
  }

  // Check to see if the puzzle has been solved
  isSolved = checkProgress(hiddenWord);

  if (isSolved) {
    // Game won state - increment'wins', display message and restart
    meow.play();
    h1.innerHTML = "YOU WIN";
    gamePrompt.innerHTML = 'Congratulations!';
    h2Result.innerHTML = `Well done! You guessed ${currentWord}!`;
    resultPara.innerHTML = "Starting new game in 3... 2... 1...";
    mainContainer.style.display = 'none';
    result.style.display = 'block';
    hiddenWord = updateBlankWord(currentWord, hiddenWord, guess);
    currentWordPara.innerHTML = displayBlankWord(hiddenWord);
    winsPara.innerHTML = ++wins;
    setTimeout(initialize, 4000);
  }
  else if ((isSolved == false) && (guessesRemaining <= 0)) {
    // Game lost state - display message and restart
    angryMeow.play();
    h1.innerHTML = "YOU LOSE";
    gamePrompt.innerHTML = 'Better luck next time!';
    h2Result.innerHTML = `The correct answer was: ${currentWord}`;
    resultPara.innerHTML = "Starting new game in 3... 2... 1...";
    mainContainer.style.display = 'none';
    result.style.display = 'block';
    setTimeout(initialize, 4000);
  }
  else {
    return;
  }
  return;
}
