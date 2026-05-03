"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"

interface RitualLogo3DProps {
  isPulsing: boolean
  intensity: number
}

export function RitualLogo3D({ isPulsing, intensity }: RitualLogo3DProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const glowIntensity = 15 + (intensity * 0.5)
  const scale = 1 + (intensity / 200)

  if (!mounted) {
    return (
      <div className="relative w-[300px] h-[300px] flex items-center justify-center">
        <div className="relative w-[200px] h-[200px]">
          <Image
            src="/x.png"
            alt="Ritual"
            width={200}
            height={200}
            className="w-full h-full object-contain"
            priority
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-[300px] h-[300px] flex items-center justify-center">
      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1"
            opacity="0.3"
            strokeDasharray="10 5"
          />
        </svg>
      </motion.div>

      {/* Middle rotating ring */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <circle
            cx="150"
            cy="150"
            r="110"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
            opacity="0.2"
            strokeDasharray="8 4"
          />
        </svg>
      </motion.div>

      {/* Pulsing glow rings */}
      {isPulsing && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-primary/40"
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 2, delay: i * 0.3, ease: "easeOut" }}
              style={{
                boxShadow: `0 0 ${glowIntensity}px var(--glow-primary)`,
              }}
            />
          ))}
        </>
      )}

      {/* 3D Logo Container */}
      <motion.div
        className="relative z-10"
        animate={{
          scale: isPulsing ? [scale, scale * 1.1, scale] : scale,
          rotateY: [0, 5, 0, -5, 0],
        }}
        transition={{
          scale: { duration: 0.4 },
          rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        {/* Shadow layers for 3D depth */}
        <motion.div
          className="absolute inset-0 blur-xl"
          style={{
            background: `radial-gradient(circle, var(--primary) 0%, transparent 70%)`,
            opacity: 0.4,
            transform: "translateZ(-20px)",
          }}
          animate={{
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Main logo with 3D effect */}
        <motion.div
          className="relative w-[200px] h-[200px]"
          style={{
            filter: `drop-shadow(0 0 ${glowIntensity}px var(--glow-primary)) drop-shadow(0 0 ${glowIntensity * 2}px var(--glow-secondary))`,
          }}
          animate={{
            filter: [
              `drop-shadow(0 0 ${glowIntensity}px var(--glow-primary)) drop-shadow(0 0 ${glowIntensity * 2}px var(--glow-secondary))`,
              `drop-shadow(0 0 ${glowIntensity * 1.5}px var(--glow-primary)) drop-shadow(0 0 ${glowIntensity * 2.5}px var(--glow-secondary))`,
              `drop-shadow(0 0 ${glowIntensity}px var(--glow-primary)) drop-shadow(0 0 ${glowIntensity * 2}px var(--glow-secondary))`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/x.png"
            alt="Ritual"
            width={200}
            height={200}
            className="w-full h-full object-contain"
            priority
          />
        </motion.div>

        {/* Accent glow overlay */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, var(--accent) 0%, transparent 60%)`,
            mixBlendMode: "screen",
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Orbiting particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? "var(--primary)" : "var(--accent)",
            boxShadow: `0 0 8px ${i % 2 === 0 ? "var(--glow-primary)" : "var(--glow-secondary)"}`,
            transformOrigin: `${100 + i * 10}px center`,
          }}
          animate={{
            rotate: 360,
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            rotate: {
              duration: 8 + i,
              repeat: Infinity,
              ease: "linear",
            },
            opacity: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            },
          }}
        />
      ))}

      {/* Energy waves */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <circle
            cx="150"
            cy="150"
            r="80"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
            opacity="0.3"
          />
        </svg>
      </motion.div>
    </div>
  )
}
