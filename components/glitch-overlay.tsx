"use client"

import { motion, AnimatePresence } from "framer-motion"

interface GlitchOverlayProps {
  active: boolean
  intensity?: "low" | "medium" | "high"
}

export function GlitchOverlay({ active, intensity = "medium" }: GlitchOverlayProps) {
  const intensityValues = {
    low: { lines: 3, offset: 2, duration: 0.15 },
    medium: { lines: 6, offset: 4, duration: 0.2 },
    high: { lines: 12, offset: 8, duration: 0.3 },
  }

  const config = intensityValues[intensity]

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {/* RGB split effect */}
          <motion.div
            className="absolute inset-0"
            animate={{
              x: [-config.offset, config.offset, -config.offset / 2, 0],
            }}
            transition={{ duration: config.duration, ease: "easeOut" }}
            style={{
              mixBlendMode: "screen",
              background: "linear-gradient(90deg, rgba(255,0,0,0.1) 0%, transparent 50%)",
            }}
          />
          <motion.div
            className="absolute inset-0"
            animate={{
              x: [config.offset, -config.offset, config.offset / 2, 0],
            }}
            transition={{ duration: config.duration, ease: "easeOut" }}
            style={{
              mixBlendMode: "screen",
              background: "linear-gradient(90deg, transparent 50%, rgba(0,255,255,0.1) 100%)",
            }}
          />

          {/* Horizontal glitch lines */}
          {[...Array(config.lines)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 bg-white/10"
              initial={{
                top: `${Math.random() * 100}%`,
                height: Math.random() * 3 + 1,
                opacity: 0,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                x: [0, Math.random() * 20 - 10, 0],
              }}
              transition={{
                duration: config.duration,
                delay: Math.random() * 0.1,
              }}
            />
          ))}

          {/* Scanline effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
            }}
          />

          {/* Brief white flash */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0.1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
