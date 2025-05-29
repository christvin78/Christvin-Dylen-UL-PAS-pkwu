import React, { useRef, useEffect } from "react";

export default function BasketballGame() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth < 768 ? 300 : 600;
    canvas.height = window.innerWidth < 768 ? 400 : 500;

    let ball = {
      x: canvas.width / 2,
      y: canvas.height - 30,
      radius: 10,
      dy: 0,
      isMoving: false
    };

    let hoop = {
      x: canvas.width / 2 - 25,
      y: 80,
      width: 50,
      height: 10
    };

    let score = 0;

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

        if (ball.y <= hoop.y + hoop.height &&
            ball.y >= hoop.y &&
            ball.x >= hoop.x &&
            ball.x <= hoop.x + hoop.width) {
          score++;
          resetBall();
        }

        if (ball.y < 0 || ball.y > canvas.height) {
          resetBall();
        }
      }

      // Score
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText("Score: " + score, 10, 20);

      requestAnimationFrame(draw);
    }

    function shootBall() {
      if (!ball.isMoving) {
        ball.dy = -8;
        ball.isMoving = true;
      }
    }

    function resetBall() {
      ball.y = canvas.height - 30;
      ball.dy = 0;
      ball.isMoving = false;
    }

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") shootBall();
    });

    draw();

    return () => {
      window.removeEventListener("keydown", shootBall);
    };
  }, []);

  return (
    <div>
      <h2>Basketball Toss</h2>
      <p>Tekan <strong>Spasi</strong> untuk menembak bola ke ring!</p>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
