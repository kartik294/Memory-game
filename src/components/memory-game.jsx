import { useEffect, useState } from "react";

const MemoryGame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [moves, setMoves] = useState(0);
  const [highScore, setHighScore] = useState(null);
  const [theme, setTheme] = useState("light");
  const [isPaused, setIsPaused] = useState(false);

  const handleGridSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size);
  };

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));

    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
    setMoves(0);
    setTimer(0);
    setDisabled(false);
    setIsPaused(false);
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  useEffect(() => {
    let interval = null;
    if (won) {
      clearInterval(interval);
    } else if (!isPaused) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [won, isPaused]);

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved((prev) => [...prev, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
      setMoves((prev) => prev + 1);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
      setMoves((prev) => prev + 1);
    }
  };

  const handleClick = (id) => {
    if (disabled || won || flipped.includes(id)) return;

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
      if (!highScore || timer < highScore) {
        setHighScore(timer);
      }
    }
  }, [solved, cards, timer, highScore]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const resetHighScore = () => {
    setHighScore(null);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-${
        theme === "light" ? "gray-100" : "gray-900"
      } p-4 text-${theme === "light" ? "black" : "white"}`}
    >
      <h1 className="text-4xl font-bold mb-6">Memory Game</h1>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
      >
        Toggle Theme
      </button>

      {/* Grid Size Input */}
      <div className="mb-4 flex flex-col items-center">
        <label htmlFor="gridSize" className="mb-2 text-lg">
          Grid Size: (max 10)
        </label>
        <input
          type="number"
          id="gridSize"
          min="2"
          max="10"
          value={gridSize}
          onChange={handleGridSizeChange}
          className="border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400 transition"
        />
      </div>

      {/* Timer and Move Counter */}
      <div className="mb-4 text-lg">
        <span className="mr-4">Time: {timer} s</span>
        <span>Moves: {moves}</span>
      </div>

      {/* Pause/Resume Button */}
      <button
        onClick={togglePause}
        className={`mb-4 px-4 py-2 ${
          isPaused ? "bg-green-500" : "bg-yellow-500"
        } text-white rounded-lg shadow hover:bg-opacity-80 transition`}
      >
        {isPaused ? "Resume" : "Pause"}
      </button>

      {/* Game Board */}
      <div
        className="grid gap-4 mb-4"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}
      >
        {cards.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => handleClick(card.id)}
              className={`aspect-square flex items-center justify-center text-2xl font-bold rounded-lg cursor-pointer transition-all duration-300 ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-400"
              } shadow-md hover:shadow-lg`}
            >
              {isFlipped(card.id) ? card.number : "?"}
            </div>
          );
        })}
      </div>

      {/* Result */}
      {won && (
        <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">
          You Won!
        </div>
      )}

      {/* High Score Display */}
      {highScore !== null && (
        <div className="mt-2 text-xl font-semibold">
          High Score: {highScore} s
          <button
            onClick={resetHighScore}
            className="ml-4 text-red-500 hover:text-red-700 transition"
          >
            Reset High Score
          </button>
        </div>
      )}

      {/* Reset / Play Again Btn */}
      <button
        onClick={initializeGame}
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors"
      >
        {won ? "Play Again" : "Reset"}
      </button>
    </div>
  );
};

export default MemoryGame;
