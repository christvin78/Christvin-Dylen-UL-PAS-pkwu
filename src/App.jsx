import React, { useState } from "react";
import "./app.css";

// Import semua game
import ShooterGame from "./games/ShooterGame";
import SnakeGame from "./games/SnakeGame";
import TicTacToe from "./games/TicTacToe";
import FlappyBird from "./games/FlappyBird";
import MemoryGame from "./games/MemoryGame";
import CatchBall from "./games/CatchBall";
import BasketballGame from "./games/BasketballGame";
import TargetClicker from "./games/TargetClicker"; // ✅ Game ke-7

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
    { id: "clicker", name: "Target Clicker", emoji: "🎯" }, // ✅ Ditambahkan
  ];

  return (
    <div className="app-container">
      <h1>🎮 Koleksi Game Seru</h1>

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
          {game === "clicker" && <TargetClicker />} {/* ✅ Game baru */}
        </>
      )}
    </div>
  );
}
