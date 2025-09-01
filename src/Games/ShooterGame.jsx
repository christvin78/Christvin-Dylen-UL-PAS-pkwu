import React, { useState, useEffect, useRef } from "react";

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 30;
const ENEMY_SIZE = 40;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 10;
const ENEMY_SPEED = 3;
const BULLET_SPEED = 10;

export default function ShooterGame() {
  const [gameSize, setGameSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [playerX, setPlayerX] = useState(window.innerWidth / 2 - PLAYER_WIDTH / 2);
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const keys = useRef({});

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      setGameSize({ width: window.innerWidth, height: window.innerHeight });
      setPlayerX((x) =>
        Math.min(window.innerWidth - PLAYER_WIDTH, Math.max(0, x))
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Spawn enemies
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const x = Math.random() * (gameSize.width - ENEMY_SIZE);
      setEnemies((enemies) => [...enemies, { x, y: 0 }]);
    }, 1200);
    return () => clearInterval(interval);
  }, [gameOver, gameSize.width]);

  // Keyboard controls
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

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setPlayerX((x) => {
        if (keys.current["ArrowLeft"]) {
          return Math.max(0, x - 10);
        } else if (keys.current["ArrowRight"]) {
          return Math.min(gameSize.width - PLAYER_WIDTH, x + 10);
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
                y: gameSize.height - PLAYER_HEIGHT - BULLET_HEIGHT - 10,
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
            if (e.y + ENEMY_SIZE > gameSize.height) {
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
  }, [playerX, bullets, enemies, gameOver, gameSize]);

  const restart = () => {
    setGameOver(false);
    setScore(0);
    setBullets([]);
    setEnemies([]);
    setPlayerX(gameSize.width / 2 - PLAYER_WIDTH / 2);
  };

  return (
    <div style={{ margin: 0, padding: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "relative",
          width: gameSize.width,
          height: gameSize.height,
          background: "#111",
          overflow: "hidden",
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

        {/* Game Over Overlay */}
        {gameOver && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            <div>Game Over</div>
            <div style={{ marginTop: 10 }}>Score: {score}</div>
            <button
              onClick={restart}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                fontSize: 20,
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

        {/* Score */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            color: "#fff",
            fontSize: 20,
          }}
        >
          Score: {score}
        </div>
      </div>
    </div>
  );
}
