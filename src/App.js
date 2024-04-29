import { useEffect, useState } from 'react';
import './App.css';
import './components/board'


const CODE_LENGTH = 5;
function App() {
  const [solution,setSolution] = useState('')
  const [guesses, setGuesses] = useState(Array(5).fill(null))
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const code = '75434'
  useEffect(() => {
    setSolution(code);
    }, [code]
  );

  useEffect(() => {
    const handleType = (event) => {

      if(isGameOver){
        return;
      }

      if (event.key === 'Enter'){
        //validate if it's in guess array (duplicate guess) and if it's a valid size (5 characters)
        if(currentGuess.length !== 5){
          return;
        }
        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex(val => val == null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess('');

        
        const isCorrect = solution === currentGuess;
        if (isCorrect){
          setIsGameOver(true);
        }
      }

      if (event.key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0,-1));
        return;
      }

      if (currentGuess.length >= 5) {
        return;
      }
      const isNumber = event.key.match(/^[0-9]{1}$/)
      if(isNumber) {
        setCurrentGuess(currentGuess + event.key);
      }
     
    };
    window.addEventListener('keydown', handleType);

    return () => window.removeEventListener('keydown', handleType);
  }, [currentGuess, isGameOver, solution, guesses]);


  return (
    <div className="board">
      <p>{solution}</p>
      {
      guesses.map((guess, i) => {
        const isCurrentGuess = i === guesses.findIndex(val => val == null);
        return (
          <Line 
            guess={isCurrentGuess ? currentGuess : guess ?? ''}
            isFinal={!isCurrentGuess && guess != null}
            solution={solution}/>
        )
      })
      }
      {currentGuess}
    </div>
  );
}

// building the board
function Line({guess, isFinal, solution}) {
  const tiles = [];
  
  for (let i = 0; i < CODE_LENGTH; i++) {
      const digit = guess[i];
      let className = 'tile';

      if (isFinal) {
        if (digit === solution[i]){
          className += ' correct';
        } else if (solution.includes(digit)){
          className += ' partial'
        } else {
          className += ' incorrect'
        }
      }
      tiles.push(<div key={i} className={className}>{digit}</div>)
  }

  return (
      <div className="line">{tiles}</div>
  )
}

export default App;
