import React, { useEffect, useRef, useState } from "react";

export default function TargetClicker() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState({ x: 100, y: 100, radius: 20 });
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth < 768 ? 320 : 600;
      canvas.height = window.innerWidth < 768 ? 400 : 500;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw target
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();

      // Draw score & time
      ctx.fillStyle = "white";
      ctx.font = "18px Arial";
      ctx.fillText(`Score: ${score}`, 10, 20);
      ctx.fillText(`Time: ${timeLeft}s`, 10, 40);
    };

    draw();

    const interval = setInterval(draw, 1000 / 60);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, [target, score, timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const dx = clickX - target.x;
    const dy = clickY - target.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < target.radius && timeLeft > 0) {
      setScore(score + 1);
      const newX = Math.random() * (canvas.width - 40) + 20;
      const newY = Math.random() * (canvas.height - 60) + 40;
      setTarget({ x: newX, y: newY, radius: 20 });
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>🎯 Target Clicker</h2>
      {timeLeft > 0 ? (
        <p>Click target merah secepat mungkin!</p>
      ) : (
        <h3>Waktu Habis! Skor Akhir: {score}</h3>
      )}
      <canvas ref={canvasRef} onClick={handleClick} style={{ border: "2px solid white", borderRadius: "8px" }} />
    </div>
  );
}
