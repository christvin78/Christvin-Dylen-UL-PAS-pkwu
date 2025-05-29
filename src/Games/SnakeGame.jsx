import React, { useState, useEffect, useRef } from "react";

const CANVAS_SIZE = 400;
const SCALE = 20; // ukuran kotak ular dan makanan
const ROWS = CANVAS_SIZE / SCALE;

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    { x: 7, y: 9 },
  ]);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Generate posisi makanan baru acak di grid
  const generateFood = (snakeCells) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * ROWS),
        y: Math.floor(Math.random() * ROWS),
      };
      // Pastikan makanan tidak muncul di ular
      if (!snakeCells.some((cell) => cell.x === newFood.x && cell.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  };

  // Handle key input untuk arah
  useEffect(() => {
    const downHandler = (e) => {
      const { key } = e;
      if (key === "ArrowUp" && direction.y !== 1) setDirection({ x: 0, y: -1 });
      else if (key === "ArrowDown" && direction.y !== -1) setDirection({ x: 0, y: 1 });
      else if (key === "ArrowLeft" && direction.x !== 1) setDirection({ x: -1, y: 0 });
      else if (key === "ArrowRight" && direction.x !== -1) setDirection({ x: 1, y: 0 });
    };
    window.addEventListener("keydown", downHandler);
    return () => window.removeEventListener("keydown", downHandler);
  }, [direction]);

  // Game loop untuk update posisi ular
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake((oldSnake) => {
        const newHead = { x: oldSnake[0].x + direction.x, y: oldSnake[0].y + direction.y };

        // Cek tabrakan dengan dinding
        if (
          newHead.x < 0 ||
          newHead.x >= ROWS ||
          newHead.y < 0 ||
          newHead.y >= ROWS
        ) {
          setGameOver(true);
          return oldSnake;
        }

        // Cek tabrakan dengan tubuh sendiri
        if (oldSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return oldSnake;
        }

        let newSnake = [newHead, ...oldSnake];

        // Cek jika makan makanan
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // hapus ekor
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  // Render canvas
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // background
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // gambar ular
    ctx.fillStyle = "#0f0";
    snake.forEach(({ x, y }) => {
      ctx.fillRect(x * SCALE, y * SCALE, SCALE - 2, SCALE - 2);
    });

    // gambar makanan
    ctx.fillStyle = "#f00";
    ctx.fillRect(food.x * SCALE, food.y * SCALE, SCALE - 2, SCALE - 2);

  }, [snake, food]);

  const restart = () => {
    setSnake([
      { x: 9, y: 9 },
      { x: 8, y: 9 },
      { x: 7, y: 9 },
    ]);
    setDirection({ x: 1, y: 0 });
    setFood({ x: 15, y: 15 });
    setScore(0);
    setGameOver(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Snake Game</h2>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{ border: "3px solid #555", borderRadius: 10, background: "#222" }}
      />
      <div style={{ marginTop: 15, color: "#333", fontSize: 18 }}>Score: {score}</div>
      {gameOver && (
        <div style={{ marginTop: 20, color: "#f00", fontSize: 24 }}>
          Game Over!
          <br />
          <button
            onClick={restart}
            style={{
              marginTop: 15,
              padding: "10px 20px",
              fontSize: 18,
              cursor: "pointer",
              borderRadius: 5,
              border: "none",
              backgroundColor: "#0f0",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            Restart
          </button>
        </div>
      )}
      <div style={{ marginTop: 10, color: "#555" }}>
        Gunakan tombol ← ↑ → ↓ untuk menggerakkan ular.
      </div>
    </div>
  );
}
