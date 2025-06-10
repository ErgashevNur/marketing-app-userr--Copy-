"use client";

import React, { useEffect, useRef, useState } from "react";

type Prize = {
  name: string;
  color: string;
  percent?: number;
};

type Props = {
  prizes: Prize[];
  onFinish: (selected: Prize, index: number) => void;
  targetIndex?: number;
};

const SpinWheel: React.FC<Props> = ({ prizes, onFinish, targetIndex }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [winner, setWinner] = useState<Prize | null>(null);
  const canvasSize = 300;

  const spin = (idx?: number) => {
    if (spinning) return;
    setSpinning(true);

    const winnerIndex =
      typeof idx === "number"
        ? idx
        : typeof targetIndex === "number"
        ? targetIndex
        : getRandomPrizeIndex(prizes); // <-- percent bo‘yicha tanlash

    const totalSectors = prizes.length;
    const sectorAngle = 360 / totalSectors;
    const minSpins = 5;
    const targetAngle =
      360 * minSpins +
      (360 - (winnerIndex * sectorAngle + sectorAngle / 2));

    const duration = 4000;
    const start = performance.now();
    const startAngle = angle;

    const animate = (time: number) => {
      let progress = (time - start) / duration;
      if (progress > 1) progress = 1;

      const eased = 1 - Math.pow(1 - progress, 4);
      const currentAngle =
        startAngle + (targetAngle - startAngle) * eased;

      setAngle(currentAngle % 360);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setWinner(prizes[winnerIndex]);
        onFinish(prizes[winnerIndex], winnerIndex);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvasSize;
    canvas.width = size;
    canvas.height = size;
    const radius = size / 2;
    const cx = size / 2;
    const cy = size / 2;
    ctx.clearRect(0, 0, size, size);

    const total = prizes.length;
    const arc = (2 * Math.PI) / total;

    prizes.forEach((p, i) => {
      const startAngle = arc * i + (angle * Math.PI) / 180;
      const endAngle = startAngle + arc;

      // Gradient ranglarni ajratish va yasash
      let fillStyle: string | CanvasGradient = "#000";
      const gradientMatch = p.color.match(/linear-gradient\([^)]+,([^)]+)\)/);
      if (gradientMatch) {
        const colors = gradientMatch[1]
          .split(",")
          .map((s) => s.trim())
          .filter((s) => /^#|rgb|hsl/.test(s));
        if (colors.length > 1) {
          const grad = ctx.createLinearGradient(
            cx + Math.cos(startAngle) * radius,
            cy + Math.sin(startAngle) * radius,
            cx + Math.cos(endAngle) * radius,
            cy + Math.sin(endAngle) * radius
          );
          colors.forEach((color, idx) => {
            grad.addColorStop(idx / (colors.length - 1), color);
          });
          fillStyle = grad;
        } else {
          fillStyle = colors[0] || "#000";
        }
      } else if (/^#|rgb|hsl/.test(p.color)) {
        fillStyle = p.color;
      }

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.fillStyle = fillStyle;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + arc / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(p.name, radius * 0.75, 0);
      ctx.restore();
    });

    // Pointer (above the wheel)
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius - 10);
    ctx.lineTo(cx - 10, cy - radius - 30);
    ctx.lineTo(cx + 10, cy - radius - 30);
    ctx.closePath();
    ctx.fillStyle = "#000";
    ctx.fill();
  }, [angle, prizes]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-[300px] h-[300px]">
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-full shadow-md"
        />
 <div
  className="absolute right-0 top-[48%] bg-red-600 shadow-lg"
  style={{
    width: "34px",   // узунлиги
    height: "24px",  // баландлиги
    clipPath: "polygon(0% 50%, 100% 0%, 100% 100%)",
  }}
/>

  
      </div>
      {winner && (
        <div className="text-center text-lg font-semibold text-green-700">
          Winner: {winner.name}
        </div>
      )}
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={() => spin()}
        disabled={spinning}
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>
    </div>
  );
};
function getRandomPrizeIndex(prizes: { percent?: number }[]) {
  const filtered = prizes.map(p => p.percent ?? 1);
  const total = filtered.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < prizes.length; i++) {
    if (filtered[i] === 0) continue; // percent 0 bo‘lsa, o‘tkazib yubor
    if (rand < filtered[i]) return i;
    rand -= filtered[i];
  }
  // fallback
  return 0;
}

export default SpinWheel;
