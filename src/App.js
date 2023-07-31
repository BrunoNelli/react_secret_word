// CSS
import './App.css';

// React
import { useEffect, useState, useCallback } from 'react';

// Data
import { wordsList } from './data/words';

// Components
import StartScreen from './components/StartScreen';
import GamePlay from './components/GamePlay';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
]

const guessesQty = 3;

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [pickedWordLetters, setPickedWordLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordandCategory = useCallback(() => {
    const categories = Object.keys(words);

    // Pick a random category
    const randomCategory =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // Pick a random word from the category
    const randomWord =
      words[randomCategory][Math.floor(Math.random() * words[randomCategory].length)];

    return {randomWord, randomCategory};
  }, [words]);

  // Starts the secret word game
  const startGame = useCallback(() => {
    // Clear all letters
    clearLetterStates();
  
    // Pick a random category and random word
    const { randomWord, randomCategory } = pickWordandCategory();

    // Create an array of letters from the picked word
    let wordLetters = randomWord.split("");

    wordLetters = wordLetters.map((letter) => letter.toLowerCase());

    // Fill states
    setPickedWord(randomWord);
    console.log(randomWord);
    setPickedCategory(randomCategory);
    setPickedWordLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordandCategory]);
  // Proccess the letter input
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase();

    // Check if the letter has been guessed already
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // Push guessed letter or remove a guess
    if (pickedWordLetters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
        ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
        ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
    setGuesses(3);
  }

  // Check if guesses are over
  useEffect(() => {
    // Check if the user won
    if (guesses <= 0) {
      // Reset the game
      clearLetterStates();

      setGameStage(stages[2].name);
 
    }
  }, [guesses]);

  // Check if the user won
  useEffect(() => {

    const uniqueLetters = [...new Set(pickedWordLetters)];

    // Win condition
    if (guessedLetters.length === uniqueLetters.length) {
      // Add 100 points to the score
      setScore((actualScore) => actualScore + 100);

      startGame();
    }
  }, [guessedLetters, pickedWordLetters, startGame]);

  // Restart the game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      { gameStage === 'start' && <StartScreen startGame = {startGame}/> }
      { gameStage === 'game' && (
        <GamePlay
          verifyLetter = {verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          wordLetters={pickedWordLetters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        /> 
      )}

      { gameStage === 'end' && <GameOver retry={retry} score={score}/> }
    </div>
  );
}

export default App;
