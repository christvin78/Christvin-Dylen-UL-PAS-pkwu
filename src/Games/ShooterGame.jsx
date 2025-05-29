import React, { useState, useEffect, useRef } from "react";

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 30;
const ENEMY_SIZE = 40;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 10;
const ENEMY_SPEED = 2;
const BULLET_SPEED = 7;

export default function ShooterGame() {
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const keys = useRef({});

  // Spawn musuh acak setiap 1.5 detik
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const x = Math.random() * (GAME_WIDTH - ENEMY_SIZE);
      setEnemies((enemies) => [...enemies, { x, y: 0 }]);
    }, 1500);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Handle keyboard events
  useEffect(() => {
    const downHandler = ({ key }) => {
      keys.current[key] = true;
    };
    const upHandler = ({ key }) => {
      keys.current[key] = false;
    };
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  // Game loop update setiap 30ms
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setPlayerX((x) => {
        if (keys.current["ArrowLeft"]) {
          return Math.max(0, x - 10);
        } else if (keys.current["ArrowRight"]) {
          return Math.min(GAME_WIDTH - PLAYER_WIDTH, x + 10);
        }
        return x;
      });

      if (keys.current[" "]) {
        setBullets((bullets) => {
          if (bullets.length < 5) {
            return [
              ...bullets,
              {
                x: playerX + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
                y: GAME_HEIGHT - PLAYER_HEIGHT - BULLET_HEIGHT,
              },
            ];
          }
          return bullets;
        });
        keys.current[" "] = false;
      }

      setBullets((bullets) =>
        bullets
          .map((b) => ({ ...b, y: b.y - BULLET_SPEED }))
          .filter((b) => b.y + BULLET_HEIGHT > 0)
      );

      setEnemies((enemies) =>
        enemies
          .map((e) => ({ ...e, y: e.y + ENEMY_SPEED }))
          .filter((e) => {
            if (e.y + ENEMY_SIZE > GAME_HEIGHT) {
              setGameOver(true);
              return false;
            }
            return true;
          })
      );

      setEnemies((enemies) => {
        const newEnemies = [];
        enemies.forEach((enemy) => {
          let hit = false;
          bullets.forEach((bullet) => {
            if (
              bullet.x < enemy.x + ENEMY_SIZE &&
              bullet.x + BULLET_WIDTH > enemy.x &&
              bullet.y < enemy.y + ENEMY_SIZE &&
              bullet.y + BULLET_HEIGHT > enemy.y
            ) {
              hit = true;
            }
          });
          if (!hit) {
            newEnemies.push(enemy);
          } else {
            setScore((s) => s + 10);
            setBullets((bullets) =>
              bullets.filter(
                (b) =>
                  !(
                    b.x < enemy.x + ENEMY_SIZE &&
                    b.x + BULLET_WIDTH > enemy.x &&
                    b.y < enemy.y + ENEMY_SIZE &&
                    b.y + BULLET_HEIGHT > enemy.y
                  )
              )
            );
          }
        });
        return newEnemies;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [playerX, bullets, enemies, gameOver]);

  const restart = () => {
    setGameOver(false);
    setScore(0);
    setBullets([]);
    setEnemies([]);
    setPlayerX(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Shooter Game</h2>
      <div
        style={{
          position: "relative",
          margin: "0 auto",
          background: "#222",
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          overflow: "hidden",
          borderRadius: 10,
          border: "3px solid #555",
          userSelect: "none",
        }}
      >
        {/* Player */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: playerX,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            backgroundColor: "#0f0",
            borderRadius: 5,
          }}
        ></div>

        {/* Bullets */}
        {bullets.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: BULLET_WIDTH,
              height: BULLET_HEIGHT,
              backgroundColor: "#ff0",
              left: b.x,
              top: b.y,
              borderRadius: 2,
            }}
          ></div>
        ))}

        {/* Enemies */}
        {enemies.map((e, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: ENEMY_SIZE,
              height: ENEMY_SIZE,
              backgroundColor: "#f00",
              left: e.x,
              top: e.y,
              borderRadius: 8,
            }}
          ></div>
        ))}

        {/* Game Over */}
        {gameOver && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: GAME_WIDTH,
              height: GAME_HEIGHT,
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            <div>Game Over</div>
            <div>Score: {score}</div>
            <button
              onClick={restart}
              style={{
                marginTop: 20,
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
      </div>
      <div style={{ marginTop: 15, color: "#333", fontSize: 18 }}>
        Skor: {score}
      </div>
      <div style={{ marginTop: 10, color: "#555" }}>
        Gunakan tombol ← → untuk bergerak, dan Space untuk menembak.
      </div>
    </div>
  );
}
