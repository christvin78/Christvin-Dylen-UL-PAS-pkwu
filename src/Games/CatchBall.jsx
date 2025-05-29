import React, { useRef, useEffect } from "react";

export default function CatchBall() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth < 768 ? 300 : 600;
    canvas.height = window.innerWidth < 768 ? 400 : 500;

    let basketX = canvas.width / 2 - 30;
    let ballY = 0;
    let ballX = Math.random() * (canvas.width - 20);
    let score = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
      ctx.fillStyle = "orange";
      ctx.fill();
      ctx.closePath();

      // Draw basket
      ctx.fillStyle = "blue";
      ctx.fillRect(basketX, canvas.height - 20, 60, 10);

      // Update ball
      ballY += 4;
      if (ballY > canvas.height - 20 && ballX > basketX && ballX < basketX + 60) {
        score++;
        ballY = 0;
        ballX = Math.random() * (canvas.width - 20);
      } else if (ballY > canvas.height) {
        score = 0;
        ballY = 0;
        ballX = Math.random() * (canvas.width - 20);
      }

      // Draw score
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText("Score: " + score, 10, 20);

      requestAnimationFrame(draw);
    }

    function handleMove(e) {
      if (e.key === "ArrowLeft" && basketX > 0) basketX -= 20;
      if (e.key === "ArrowRight" && basketX < canvas.width - 60) basketX += 20;
    }

    window.addEventListener("keydown", handleMove);
    draw();

    return () => {
      window.removeEventListener("keydown", handleMove);
    };
  }, []);

  return (
    <div>
      <h2>Catch The Ball</h2>
      <canvas ref={canvasRef} />
    </div>
  );
}
