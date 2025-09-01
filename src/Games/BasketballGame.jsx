import React, { useRef, useEffect } from "react";

export default function BasketballGame() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let ball = {
      x: 0,
      y: 0,
      radius: 10,
      dy: 0,
      isMoving: false
    };

    let hoop = {
      x: 0,
      y: 0,
      width: 80,
      height: 10
    };

    let score = 0;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Reset hoop position on top-center
      hoop.x = canvas.width / 2 - hoop.width / 2;
      hoop.y = 100;

      // Reset ball position at bottom-center
      if (!ball.isMoving) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 50;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw hoop
      ctx.fillStyle = "red";
      ctx.fillRect(hoop.x, hoop.y, hoop.width, hoop.height);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "orange";
      ctx.fill();
      ctx.closePath();

      // Move ball
      if (ball.isMoving) {
        ball.y += ball.dy;
        ball.dy -= 0.3;

        if (
          ball.y <= hoop.y + hoop.height &&
          ball.y >= hoop.y &&
          ball.x >= hoop.x &&
          ball.x <= hoop.x + hoop.width
        ) {
          score++;
          resetBall();
        }

        if (ball.y < 0 || ball.y > canvas.height) {
          resetBall();
        }
      }

      // Draw score
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText("Score: " + score, 20, 40);

      requestAnimationFrame(draw);
    }

    function shootBall() {
      if (!ball.isMoving) {
        ball.dy = -10;
        ball.isMoving = true;
      }
    }

    function resetBall() {
      ball.x = canvas.width / 2;
      ball.y = canvas.height - 50;
      ball.dy = 0;
      ball.isMoving = false;
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") shootBall();
    });

    resizeCanvas();
    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", shootBall);
    };
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ display: "block" }}></canvas>
    </div>
  );
}
