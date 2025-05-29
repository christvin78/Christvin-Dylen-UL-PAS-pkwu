import React, { useState, useEffect, useRef } from "react";

const WIDTH = 400;
const HEIGHT = 500;
const BIRD_SIZE = 20;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const GRAVITY = 0.6;
const JUMP = -10;
const PIPE_SPEED = 3;

export default function FlappyBird() {
  const [birdY, setBirdY] = useState(HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([
    { x: WIDTH, top: 120, bottom: HEIGHT - 120 - PIPE_GAP }
  ]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setVelocity((v) => v + GRAVITY);
      setBirdY((y) => y + velocity);

      setPipes((oldPipes) => {
        let newPipes = oldPipes.map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }));

        // Tambah pipa baru jika pipa pertama sudah melewati tengah
        if (newPipes[0].x < WIDTH / 2 && newPipes.length === 1) {
          const topHeight = 80 + Math.random() * (HEIGHT - PIPE_GAP - 160);
          newPipes = [
            ...newPipes,
            { x: WIDTH, top: topHeight, bottom: HEIGHT - topHeight - PIPE_GAP }
          ];
        }

        // Hapus pipa yang sudah lewat
        if (newPipes[0].x + PIPE_WIDTH < 0) {
          newPipes.shift();
          setScore((s) => s + 1);
        }

        return newPipes;
      });

      // Cek tabrakan dengan tanah/langit
      if (birdY > HEIGHT - BIRD_SIZE || birdY < 0) {
        setGameOver(true);
      }

      // Cek tabrakan dengan pipa
      pipes.forEach((pipe) => {
        if (
          pipe.x < 80 + BIRD_SIZE && 
          pipe.x + PIPE_WIDTH > 80 &&
          (birdY < pipe.top || birdY + BIRD_SIZE > HEIGHT - pipe.bottom)
        ) {
          setGameOver(true);
        }
      });
    }, 30);

    return () => clearInterval(interval);
  }, [birdY, velocity, pipes, gameOver]);

  const jump = () => {
    if (gameOver) return;
    setVelocity(JUMP);
  };

  const restart = () => {
    setBirdY(HEIGHT / 2);
    setVelocity(0);
    setPipes([{ x: WIDTH, top: 120, bottom: HEIGHT - 120 - PIPE_GAP }]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Flappy Bird Clone</h2>
      <div 
        onClick={jump}
        style={{
          position: "relative",
          width: WIDTH,
          height: HEIGHT,
          margin: "0 auto",
          backgroundColor: "#70c5ce",
          overflow: "hidden",
          borderRadius: 10,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {/* Bird */}
        <div style={{
          position: "absolute",
          left: 80,
          top: birdY,
          width: BIRD_SIZE,
          height: BIRD_SIZE,
          backgroundColor: "yellow",
          borderRadius: "50%",
          border: "2px solid orange",
          transition: "top 0.03s linear",
        }}></div>

        {/* Pipes */}
        {pipes.map((pipe, i) => (
          <React.Fragment key={i}>
            {/* Top pipe */}
            <div style={{
              position: "absolute",
              left: pipe.x,
              top: 0,
              width: PIPE_WIDTH,
              height: pipe.top,
              backgroundColor: "green",
              borderRadius: "0 0 20px 20px",
            }}></div>
            {/* Bottom pipe */}
            <div style={{
              position: "absolute",
              left: pipe.x,
              bottom: 0,
              width: PIPE_WIDTH,
              height: pipe.bottom,
              backgroundColor: "green",
              borderRadius: "20px 20px 0 0",
            }}></div>
          </React.Fragment>
        ))}

        {/* Ground */}
        <div style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: 20,
          backgroundColor: "#ded895",
        }}></div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div style={{
            position: "absolute",
            top: 0, left: 0,
            width: WIDTH,
            height: HEIGHT,
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "#fff",
            fontSize: 30,
            fontWeight: "bold",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            userSelect: "none",
          }}>
            <div>Game Over</div>
            <div style={{ marginTop: 10, fontSize: 24 }}>Score: {score}</div>
            <button
              onClick={restart}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                fontSize: 18,
                cursor: "pointer",
                borderRadius: 5,
                border: "none",
                backgroundColor: "#4CAF50",
                color: "#fff",
                fontWeight: "bold"
              }}
            >
              Restart
            </button>
          </div>
        )}
      </div>
      <p style={{ marginTop: 10, color: "#555" }}>
        Klik area game untuk melompat.
      </p>
      <p style={{ color: "#555" }}>
        Skor: {score}
      </p>
    </div>
  );
}
