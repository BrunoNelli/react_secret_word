import './GamePlay.css'
import { useState, useRef } from 'react';

const GamePlay = ({
  verifyLetter,
  pickedCategory,
  wordLetters,
  guessedLetters,
  wrongLetters,
  guesses,
  score
}) => {
  const [letter, setLetter] = useState('');
  const letterInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    verifyLetter(letter);
    setLetter('');

    // Focus on the input to type the next letter
    letterInputRef.current.focus();
  }

  return (
    <div className='game'>
      <p className='points'>
        <span>Pontuação: {score}</span>
      </p>
      <h1>Adivinhe a palavra</h1>
      <h3 className='tip'>
        Dica sobre a palavra: <span>{pickedCategory}</span>
      </h3>
      <p>Você ainda tem {guesses} tentativa(s)</p>
      <div className="wordContainer">
        {wordLetters.map((letter, index) =>
          guessedLetters.includes(letter) ? (
            <span key={index} className='letter'>
              {letter}
            </span>
          ) : (
            <span key={index} className='blankSquare'></span>
          )
          )}
      </div>
      <div className="letterContainer">
        <p>Tente adivinhar uma letra da palavra:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="letter"
            maxLength="1"
            required
            onChange={(e) => setLetter(e.target.value)}
            value={letter}
            ref={letterInputRef}
            pattern="[A-Za-zÀ-ÿ\s]+" // O atributo "pattern" permite apenas letras (maiúsculas e minúsculas)
            title="O nome deve conter apenas letras." // Mensagem que aparece ao passar o mouse sobre o campo em alguns navegadores
          />
          <button>Jogar!</button>
        </form>
      </div>
      <div className="wrongLettersContainer">
        <p>Letras já utilizadas:</p>
        {wrongLetters.map((letter, index) => (
          <span key={index} className='wrongLetter'>
            {letter}, 
          </span>
        ))}
      </div>
    </div>
  )
}

export default GamePlay