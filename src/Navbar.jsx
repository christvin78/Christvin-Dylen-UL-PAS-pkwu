import React from "react";

const Navbar = ({ currentGame, setCurrentGame }) => {
  const games = [
    { id: "shooter", name: "Shooter" },
    { id: "snake", name: "Snake" },
    { id: "ticTacToe", name: "Tic Tac Toe" },
    { id: "flappyBird", name: "Flappy Bird" },
    { id: "memory", name: "Memory" },
  ];

  return (
    <nav style={{ display: "flex", justifyContent: "center", gap: 20, margin: 20 }}>
      {games.map((game) => (
        <button
          key={game.id}
          onClick={() => setCurrentGame(game.id)}
          style={{
            padding: "10px 15px",
            fontWeight: currentGame === game.id ? "bold" : "normal",
            backgroundColor: currentGame === game.id ? "#4CAF50" : "#ddd",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          {game.name}
        </button>
      ))}
    </nav>
  );
};

export default Navbar;
