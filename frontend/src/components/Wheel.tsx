tsx
import React, { useRef, useEffect } from 'react';

interface Sector {
  color: string;
  avatar: string;
  nickname: string;
}

interface WheelProps {
  sectors: Sector[];
  currentSpeed: number;
  isSpinning: boolean;
}

const Wheel: React.FC<WheelProps> = ({ sectors, currentSpeed, isSpinning }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Очистка холста
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисование секторов
    const sectorAngle = (2 * Math.PI) / sectors.length;
    sectors.forEach((sector, index) => {
      const startAngle = index * sectorAngle;
      const endAngle = startAngle + sectorAngle;

      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(canvas.width / 2, canvas.height / 2, 150, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = sector.color;
      ctx.fill();
      ctx.stroke();

      // Рисование аватара и ника
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        sector.nickname,
        canvas.width / 2 + 100 * Math.cos(startAngle + sectorAngle / 2),
        canvas.height / 2 + 100 * Math.sin(startAngle + sectorAngle / 2)
      );
    });

    // Выигрышная метка
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 + 160, canvas.height / 2);
    ctx.lineTo(canvas.width / 2 + 180, canvas.height / 2 - 10);
    ctx.lineTo(canvas.width / 2 + 180, canvas.height / 2 + 10);
    ctx.closePath();
    ctx.fill();
  }, [sectors, currentSpeed]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      style={{ border: '1px solid #ccc' }}
    />
  );
}
