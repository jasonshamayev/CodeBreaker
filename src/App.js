import { useEffect, useState } from "react";
import "./App.css";
import "./components/board";
import "./images/help.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faRankingStar,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

//const element = <FontAwesomeIcon icon={'fa-regular fa-circle-question'} />

const CODE_LENGTH = 5;
function App() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(5).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  //const code = '75434'

  function getRandomSolution(CODE_LENGTH) {
    let solution = "";
    for (let i = 0; i <= CODE_LENGTH - 1; i++) {
      solution += Math.floor(Math.random() * 10).toString();
    }
    return solution;
  }
  useEffect(() => {
    let answer = getRandomSolution(CODE_LENGTH);
    setSolution(answer);
  }, []);

  function NumPad() {
    // will need guess and isFinal eventually
    // 0 1 2 3 4 5
    // e 6 7 8 9 b

    const top = ["0", "1", "2", "3", "4", "5"];
    const bottom = ["\u23CE", "6", "7", "8", "9", "\u232B"];
    const topTiles = [];
    const botTiles = [];
    for (let i = 0; i <= top.length - 1; i++) {
      topTiles.push(
        <button
          key={i}
          className="tile"
          onClick={() => {
            if (currentGuess.length < 5) {
              setCurrentGuess(currentGuess + top[i]);
            }
          }}
        >
          {top[i]}
        </button>
      );
      if (i === 0 || i === 5) {
        botTiles.push(
          <button
            key={i}
            className="bigTile"
            onClick={() => {
              if (bottom[i] == "\u232B") {
                console.log("back");
                setCurrentGuess(currentGuess.slice(0, -1));
              } else {
                if (currentGuess.length !== 5) {
                  return;
                }
                const newGuesses = [...guesses];
                newGuesses[guesses.findIndex((val) => val == null)] =
                  currentGuess;
                setGuesses(newGuesses);
                setCurrentGuess("");

                const isCorrect = solution === currentGuess;
                if (isCorrect) {
                  setIsGameOver(true);
                }
              }
            }}
          >
            {bottom[i]}
          </button>
        );
      } else {
        botTiles.push(
          <button
            key={i}
            className="tile"
            onClick={() => {
              if (currentGuess.length < 5) {
                setCurrentGuess(currentGuess + bottom[i]);
              }
            }}
          >
            {bottom[i]}
          </button>
        );
      }
    }
    return (
      <div className="numPad">
        <div className="line">{topTiles}</div>
        <div className="line">{botTiles}</div>
      </div>
    );
  }

  useEffect(() => {
    const handleType = (event) => {
      if (isGameOver) {
        return;
      }

      if (event.key === "Enter") {
        //validate if it's in guess array (duplicate guess) and if it's a valid size (5 characters)
        if (currentGuess.length !== 5) {
          return;
        }
        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess("");

        const isCorrect = solution === currentGuess;
        if (isCorrect) {
          setIsGameOver(true);
        }
      }

      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      if (currentGuess.length >= 5) {
        return;
      }
      const isNumber = event.key.match(/^[0-9]{1}$/);
      if (isNumber) {
        setCurrentGuess(currentGuess + event.key);
      }
    };
    window.addEventListener("keydown", handleType);

    return () => window.removeEventListener("keydown", handleType);
  }, [currentGuess, isGameOver, solution, guesses]);

  return (
    <div>
      <statusbar className="bar">
        <div className="title">Code Breakers</div>
        <div className="icons">
          <FontAwesomeIcon
            className="btn"
            icon={faGear}
            onClick={() => console.log("help")}
          ></FontAwesomeIcon>

          <FontAwesomeIcon
            className="btn"
            icon={faQuestionCircle}
            onClick={() => console.log("settings")}
          ></FontAwesomeIcon>
          <FontAwesomeIcon
            className="btn"
            icon={faRankingStar}
            onClick={() => console.log("leaderboard")}
          ></FontAwesomeIcon>
        </div>
      </statusbar>

      <div className="board">
        {guesses.map((guess, i) => {
          const isCurrentGuess = i === guesses.findIndex((val) => val == null);
          return (
            <Line
              guess={isCurrentGuess ? currentGuess : guess ?? ""}
              isFinalGuess={!isCurrentGuess && guess != null}
              // [curr, , , , null] last guess
              solution={solution}
            />
          );
        })}
        <div>{<NumPad></NumPad>}</div>
      </div>
    </div>
  );
}

// building the board
function Line({ guess, isFinalGuess, solution }) {
  const tiles = [];

  for (let i = 0; i < CODE_LENGTH; i++) {
    const digit = guess[i];
    let className = "tile";

    if (isFinalGuess) {
      if (digit === solution[i]) {
        className += " correct";
      } else if (solution.includes(digit)) {
        className += " partial";
      } else {
        className += " incorrect";
      }
    }
    tiles.push(
      <div key={i} className={className}>
        {digit}
      </div>
    );
  }

  return <div className="line">{tiles}</div>;
}

function handleClick(input) {
  console.log(input);
}

export default App;
