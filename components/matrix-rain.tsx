"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

interface MatrixRainProps {
  intensity: number // 0-100, affects speed and density
}

const characters = "RITUAL01AGENT$ASYNC#BLOCK@TX&NEURAL*SYNC%"

function MatrixColumn({ index, intensity }: { index: number; intensity: number }) {
  const columnChars = useMemo(() => {
    const length = 15 + Math.floor(Math.random() * 15)
    return Array.from({ length }, () => 
      characters[Math.floor(Math.random() * characters.length)]
    )
  }, [])

  const duration = 6 + Math.random() * 8 - (intensity * 0.04)
  const delay = Math.random() * 10

  return (
    <motion.div
      className="absolute top-0 flex flex-col text-xs font-mono"
      style={{
        left: `${index * 2.5}%`,
        writingMode: "vertical-rl",
        textOrientation: "upright",
      }}
      initial={{ y: "-100%" }}
      animate={{ y: "100vh" }}
      transition={{
        duration: Math.max(3, duration),
        repeat: Infinity,
        delay,
        ease: "linear",
      }}
    >
      {columnChars.map((char, i) => (
        <span
          key={i}
          className="leading-tight"
          style={{
            color: i === 0 
              ? "oklch(0.9 0.2 145)" 
              : i < 3 
                ? "oklch(0.7 0.18 145)" 
                : "oklch(0.4 0.1 145)",
            textShadow: i === 0 ? "0 0 10px oklch(0.8 0.2 145)" : "none",
            opacity: 1 - (i * 0.05),
          }}
        >
          {char}
        </span>
      ))}
    </motion.div>
  )
}

export function MatrixRain({ intensity }: MatrixRainProps) {
  const columnCount = 40 + Math.floor(intensity * 0.3)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {[...Array(columnCount)].map((_, i) => (
        <MatrixColumn key={i} index={i} intensity={intensity} />
      ))}
    </div>
  )
}
