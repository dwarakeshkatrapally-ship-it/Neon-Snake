import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;

const randomCoord = () => Math.floor(Math.random() * GRID_SIZE);

export default function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const directionRef = useRef(direction);
  // Ensure direction updates are synced to ref
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake((prev) => {
      const head = prev[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        setIsPlaying(false);
        return prev;
      }

      // Check self collision
      if (prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return prev;
      }

      const newSnake = [newHead, ...prev];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood({ x: randomCoord(), y: randomCoord() });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameOver, isPlaying, food, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // Prevent scrolling
      }
      
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (directionRef.current.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (directionRef.current.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (directionRef.current.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ': // Spacebar to play/pause or start
          e.preventDefault();
          if (gameOver) startGame();
          else setIsPlaying((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 120);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    directionRef.current = { x: 0, y: -1 };
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setFood({ x: randomCoord(), y: randomCoord() });
  };

  return (
    <div className="flex flex-col items-center bg-gray-950 p-6 rounded-2xl border-2 border-fuchsia-500/30 shadow-[0_0_30px_theme('colors.fuchsia.500/20')] w-full max-w-md mx-auto">
      {/* Score Header */}
      <div className="flex justify-between w-full mb-4 px-2 text-cyan-400 font-mono items-center">
        <div className="flex flex-col">
          <span className="text-xs text-fuchsia-500 uppercase tracking-widest">Score</span>
          <span className="text-2xl font-bold">{score.toString().padStart(4, '0')}</span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-xs text-fuchsia-500 uppercase tracking-widest flex items-center gap-1">
            <Trophy className="w-3 h-3" /> High
          </span>
          <span className="text-xl font-bold">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative bg-black/80 rounded-lg border-2 border-cyan-500/50 shadow-[0_0_15px_theme('colors.cyan.500/30')] overflow-hidden"
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
        }}
      >
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(theme('colors.cyan.500') 1px, transparent 1px), linear-gradient(90deg, theme('colors.cyan.500') 1px, transparent 1px)`,
            backgroundSize: `calc(100% / ${GRID_SIZE}) calc(100% / ${GRID_SIZE})`,
          }}
        />

        {snake.map((segment, idx) => (
          <div
            key={idx}
            className={`absolute rounded-sm ${idx === 0 ? 'bg-cyan-300 shadow-[0_0_10px_theme("colors.cyan.400")] z-10' : 'bg-cyan-500/80 shadow-[0_0_5px_theme("colors.cyan.500")]'}`}
            style={{
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
            }}
          />
        ))}

        <div
          className="absolute rounded-full bg-fuchsia-500 shadow-[0_0_15px_theme('colors.fuchsia.500')]"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            transform: 'scale(0.8)',
          }}
        />

        {/* Overlay for Game Over / Pause */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            {gameOver ? (
              <div className="text-center">
                <h3 className="text-3xl font-bold text-fuchsia-500 mb-2 uppercase tracking-wider drop-shadow-[0_0_10px_theme('colors.fuchsia.500')]">Game Over</h3>
                <p className="font-mono text-cyan-300 mb-6">Final Score: {score}</p>
                <button 
                  onClick={startGame}
                  className="flex items-center gap-2 px-6 py-3 bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500 rounded hover:bg-fuchsia-500 hover:text-black transition-all shadow-[0_0_15px_theme('colors.fuchsia.500/30')] uppercase tracking-wider text-sm font-bold"
                >
                  <RotateCcw className="w-5 h-5" /> Retry
                </button>
              </div>
            ) : (
              <button 
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500 rounded hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_15px_theme('colors.cyan.500/30')] uppercase tracking-wider text-sm font-bold"
              >
                <Play className="w-5 h-5" /> Start Game
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 text-gray-500 text-xs font-mono w-full text-center">
        Use Arrow Keys to move. Space to pause.
      </div>
    </div>
  );
}
