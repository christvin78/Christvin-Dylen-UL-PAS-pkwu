import React, { useState } from "react";
import "./app.css";
import ShooterGame from "./Games/ShooterGame";
import SnakeGame from "./Games/SnakeGame";
import TicTacToe from "./Games/TicTacToe";
import FlappyBird from "./Games/FlappyBird";
import MemoryGame from "./Games/MemoryGame";
import CatchBall from "./Games/CatchBall";
import BasketballGame from "./Games/BasketballGame";
import TargetClicker from "./Games/TargetClicker";

export default function App() {
  const [game, setGame] = useState(null);

  const games = [
    { id: "shooter", name: "Shooter Game", emoji: "🔫" },
    { id: "snake", name: "Snake Game", emoji: "🐍" },
    { id: "tic", name: "Tic Tac Toe", emoji: "❌⭕" },
    { id: "flappy", name: "Flappy Bird", emoji: "🐦" },
    { id: "memory", name: "Memory Game", emoji: "🧠" },
    { id: "catch", name: "Catch the Ball", emoji: "🏀" },
    { id: "basket", name: "Basketball Toss", emoji: "⛹️‍♂️" },
    { id: "clicker", name: "Target Clicker", emoji: "🎯" },
  ];

  return (
    <div className="app-container">
      <h1>🎮 Game Asik</h1>

      {!game ? (
        <div className="game-grid">
          {games.map(({ id, name, emoji }) => (
            <div key={id} className="game-card" onClick={() => setGame(id)}>
              <div className="game-emoji">{emoji}</div>
              <h3>{name}</h3>
            </div>
          ))}
        </div>
      ) : (
        <>
          <button className="back-button" onClick={() => setGame(null)}>⬅ Kembali</button>

          {game === "shooter" && <ShooterGame />}
          {game === "snake" && <SnakeGame />}
          {game === "tic" && <TicTacToe />}
          {game === "flappy" && <FlappyBird />}
          {game === "memory" && <MemoryGame />}
          {game === "catch" && <CatchBall />}
          {game === "basket" && <BasketballGame />}
          {game === "clicker" && <TargetClicker />} 
        </>
      )}
    </div>
  );
}
