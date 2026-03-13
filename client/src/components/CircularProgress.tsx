import React from "react";

type Props = {
  progress: number; // 0 - 100
};

const CircularProgress: React.FC<Props> = ({ progress }) => {
  const radius = 200;
  const stroke = 20;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <svg
      height={radius * 2}
      width={radius * 2}
      className="transform -rotate-360"
    >
      {/* background circle */}
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />

      {/* progress */}
      <circle
        stroke="#2563eb"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset }}
        className="transition-all duration-500"
      />

      {/* text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="fill-slate-700 text-5xl font-bold"
      >
        {progress}%

      </text>
      <text x="38%"
        y="65%"
        className="text-xl font-bold fill-slate-700 animate-pulse"
      >
        Uploading . . .
      </text>
    </svg>
  );
};

export default CircularProgress;