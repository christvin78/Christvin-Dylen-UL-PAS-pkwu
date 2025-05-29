import React, { useState } from "react";

const WIN_CONDITIONS = [
  [0,1,2], [3,4,5], [6,7,8],  // rows
  [0,3,6], [1,4,7], [2,5,8],  // columns
  [0,4,8], [2,4,6]            // diagonals
];

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const calculateWinner = (b) => {
    for (let [a,b,c] of WIN_CONDITIONS) {
      if (b[a] && b[a] === b[b] && b[a] === b[c]) {
        return b[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (winner || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    const win = checkWinner(newBoard);
    if (win) setWinner(win);
    setXIsNext(!xIsNext);
  };

  const checkWinner = (board) => {
    for (const [a,b,c] of WIN_CONDITIONS) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setXIsNext(true);
  };

  const renderSquare = (i) => (
    <button 
      onClick={() => handleClick(i)} 
      style={{
        width: 60, height: 60, fontSize: 32, fontWeight: "bold",
        border: "1px solid #333",
        backgroundColor: board[i] ? (board[i] === "X" ? "#e8f0fe" : "#fde8e8") : "#fff",
        cursor: winner || board[i] ? "default" : "pointer",
      }}
    >
      {board[i]}
    </button>
  );

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Tic Tac Toe</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 60px)",
        gridGap: 5,
        justifyContent: "center",
        margin: "0 auto",
      }}>
        {board.map((_, i) => renderSquare(i))}
      </div>
      <div style={{ marginTop: 15, fontSize: 20 }}>
        {winner 
          ? `Pemenang: ${winner}` 
          : board.every(cell => cell !== null) 
            ? "Seri!" 
            : `Giliran: ${xIsNext ? "X" : "O"}`}
      </div>
      <button 
        onClick={resetGame} 
        style={{
          marginTop: 20, padding: "10px 20px", fontSize: 18,
          borderRadius: 5, cursor: "pointer", border: "none",
          backgroundColor: "#4CAF50", color: "#fff", fontWeight: "bold"
        }}
      >
        Mulai Ulang
      </button>
    </div>
  );
}
