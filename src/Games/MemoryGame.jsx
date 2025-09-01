import React, { useState, useEffect } from "react";

const CARD_PAIRS = 8;

function shuffleArray(array) {
  return array
    .map((v) => ({ v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ v }) => v);
}

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disable, setDisable] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    
    const initialCards = [];
    for (let i = 1; i <= CARD_PAIRS; i++) {
      initialCards.push(i);
     
    }
    setCards(shuffleArray(initialCards));
  }, []);

  const handleClick = (index) => {
    if (disable) return; 
    if (flipped.includes(index) || matched.includes(index)) return; 
    if (flipped.length === 0) {
     
      setFlipped([index]);
    } else if (flipped.length === 1) {
      
      setFlipped([flipped[0], index]);
      setDisable(true); 
      setMoves((m) => m + 1);

      if (cards[flipped[0]] === cards[index]) {
       
        setTimeout(() => {
          setMatched((prev) => [...prev, flipped[0], index]);
          setFlipped([]);
          setDisable(false);
        }, 800);
      } else {
       
        setTimeout(() => {
          setFlipped([]);
          setDisable(false);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
  
    const newCards = [];
    for (let i = 1; i <= CARD_PAIRS; i++) {
      newCards.push(i);
      newCards.push(i);
    }
    setCards(shuffleArray(newCards));
    setFlipped([]);
    setMatched([]);
    setDisable(false);
    setMoves(0);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Memory Game (Pasang Kartu)</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 70px)",
          gap: 10,
          justifyContent: "center",
          margin: "0 auto",
          userSelect: "none",
        }}
      >
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          return (
            <div
              key={i}
              onClick={() => handleClick(i)}
              style={{
                width: 70,
                height: 90,
                backgroundColor: isFlipped ? "#f7d794" : "#444",
                color: "#222",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 32,
                fontWeight: "bold",
                borderRadius: 8,
                cursor: disable ? "default" : "pointer",
                boxShadow: isFlipped ? "0 0 10px #f7d794" : "none",
                userSelect: "none",
                transition: "background-color 0.3s",
              }}
            >
              {isFlipped ? card : ""}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 20, fontSize: 18 }}>Moves: {moves}</div>
      <button
        onClick={resetGame}
        style={{
          marginTop: 15,
          padding: "10px 25px",
          fontSize: 18,
          borderRadius: 5,
          border: "none",
          backgroundColor: "#4CAF50",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Mulai Ulang
      </button>
    </div>
  );
}
