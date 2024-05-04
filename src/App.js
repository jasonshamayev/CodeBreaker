import { useEffect, useState } from 'react';
import './App.css';
import './components/board'
import './images/help.png'
import settings from './settings.png'

const CODE_LENGTH = 5;
function App() {
  const [solution,setSolution] = useState('')
  const [guesses, setGuesses] = useState(Array(5).fill(null))
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  //const code = '75434'

  function getRandomSolution(CODE_LENGTH) {
    let solution = '';
    for(let i = 0; i <= CODE_LENGTH - 1; i++) {
      solution += Math.floor(Math.random() * 10).toString();
    }
    return solution;
  }
  useEffect(() => {
    let answer = getRandomSolution(CODE_LENGTH);
    setSolution(answer);
    }, []
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
    <div className='App-header'>
      <statusbar>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <button className='btn'><image class={settings}></image></button>
        <button>LeaderBoard</button>
        <button>Help</button>
      </statusbar>
      <div className='title'>Code Breakers</div>
      <div className="board">
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
        <div>
          {
            <NumPad>
              
            </NumPad>
          }
        </div>
      </div>
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

function NumPad() {
  // will need guess and isFinal eventually
  // 0 1 2 3 4 5 
  // e 6 7 8 9 b 
  
  const top = ['0','1','2','3','4', '5'];
  const bottom = ['\u23CE', '6', '7', '8', '9', '\u232B'];
  const topTiles = [];
  const botTiles = [];
  for(let i = 0; i <= top.length - 1; i++){
    topTiles.push(<button key ={i} className="tile">{top[i]}</button>)
    if(i === 0 || i === 5){
      botTiles.push(<button key={i} className="bigTile" onClick={bottom[i]}>{bottom[i]}</button>)
    }
    else{
      
    botTiles.push(<button key ={i} className="tile">{bottom[i]}</button>)
    }
  }
  return(
    
    <div className="numPad">
      <div className="line">{topTiles}</div>
      <div className="line">{botTiles}</div>
    </div>
  )
  

}

export default App;
