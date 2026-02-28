import { motion } from "framer-motion";

interface TimerDisplayProps {
  timeLeft: number;
  progress: number;
  ringColor: string;
  size?: number;
}

export default function TimerDisplay({ timeLeft, progress, ringColor, size = 320 }: TimerDisplayProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;

  const strokeWidth = 8;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div 
      className="relative flex items-center justify-center transition-all duration-700 ease-in-out"
      style={{ width: size, height: size }}
      data-testid="timer-display"
    >
      {/* Background track */}
      <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
        <circle
          className="stroke-muted"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress track */}
        <motion.circle
          className={`${ringColor} transition-colors duration-700`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </svg>
      
      {/* Text display */}
      <div className="flex flex-col items-center justify-center z-10">
        <span className="font-display font-bold tabular-nums tracking-tighter text-foreground" style={{ fontSize: size * 0.25, lineHeight: 1 }}>
          {displayMinutes}:{displaySeconds}
        </span>
      </div>
    </div>
  );
}