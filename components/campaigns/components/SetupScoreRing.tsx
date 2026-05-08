interface RingProps {
  score: number
  size?: number
  stroke?: number
}

export function SetupScoreRing({ score, size = 36, stroke = 4 }: RingProps): React.JSX.Element {
  const safe = Number.isFinite(score) ? score : 0
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, safe))
  const offset = circumference - (clamped / 100) * circumference
  const color = clamped >= 80 ? "#15803D" : clamped >= 50 ? "#37322F" : "#A16207"

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(55,50,47,0.1)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span
        className="absolute text-[9px] font-semibold tabular-nums"
        style={{ color }}
      >
        {clamped}%
      </span>
    </div>
  )
}
