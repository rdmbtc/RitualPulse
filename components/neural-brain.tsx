"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useMemo } from "react"

interface NeuralBrainProps {
  isPulsing: boolean
  intensity: number
  agentCount: number
}

interface Neuron {
  id: number
  x: number
  y: number
  size: number
  connections: number[]
  layer: "core" | "mid" | "outer"
}

interface Synapse {
  id: number
  from: number
  to: number
  active: boolean
  delay: number
}

interface Signal {
  id: number
  fromX: number
  fromY: number
  toX: number
  toY: number
}

export function NeuralBrain({ isPulsing, intensity, agentCount }: NeuralBrainProps) {
  const [pulseRings, setPulseRings] = useState<number[]>([])
  const [activeSignals, setActiveSignals] = useState<Signal[]>([])
  const [brainRotation, setBrainRotation] = useState(0)

  // Generate neuron positions in brain-like structure with IQ-based density
  const neurons = useMemo<Neuron[]>(() => {
    const result: Neuron[] = []
    const densityMultiplier = 1 + (intensity / 100) // More neurons when IQ is high
    
    // Core neurons (brain stem) - intelligence core
    const coreCount = Math.floor(8 * densityMultiplier)
    for (let i = 0; i < coreCount; i++) {
      const angle = (i / coreCount) * Math.PI * 2
      result.push({
        id: i,
        x: Math.cos(angle) * 30,
        y: Math.sin(angle) * 25,
        size: 6 + Math.random() * 4,
        connections: [],
        layer: "core"
      })
    }
    
    // Mid layer neurons (limbic system) - processing layer
    const midCount = Math.floor(16 * densityMultiplier)
    for (let i = 0; i < midCount; i++) {
      const angle = (i / midCount) * Math.PI * 2 + 0.1
      const radius = 70 + Math.sin(angle * 3) * 15
      result.push({
        id: coreCount + i,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * (radius * 0.75),
        size: 4 + Math.random() * 3,
        connections: [],
        layer: "mid"
      })
    }
    
    // Outer cortex neurons (cerebral cortex) - higher intelligence
    const outerCount = Math.floor(32 * densityMultiplier)
    for (let i = 0; i < outerCount; i++) {
      const angle = (i / outerCount) * Math.PI * 2
      const baseRadius = 130
      const variation = Math.sin(angle * 2.5) * 20 + Math.cos(angle * 4) * 10
      const radius = baseRadius + variation
      result.push({
        id: coreCount + midCount + i,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * (radius * 0.7) + Math.sin(angle * 2) * 15,
        size: 3 + Math.random() * 2,
        connections: [],
        layer: "outer"
      })
    }

    // Create connections - more connections = higher IQ
    result.forEach((neuron, idx) => {
      const connections: number[] = []
      const maxConnections = Math.floor(4 * densityMultiplier)
      result.forEach((other, otherIdx) => {
        if (idx !== otherIdx) {
          const dist = Math.sqrt(
            Math.pow(neuron.x - other.x, 2) + 
            Math.pow(neuron.y - other.y, 2)
          )
          if (dist < 80 && Math.random() > 0.6) {
            connections.push(otherIdx)
          }
        }
      })
      neuron.connections = connections.slice(0, maxConnections)
    })

    return result
  }, [intensity])

  // Generate synapses from neuron connections
  const synapses = useMemo<Synapse[]>(() => {
    const result: Synapse[] = []
    let id = 0
    neurons.forEach((neuron, idx) => {
      neuron.connections.forEach(connIdx => {
        if (connIdx > idx) { // Avoid duplicates
          result.push({
            id: id++,
            from: idx,
            to: connIdx,
            active: false,
            delay: Math.random() * 2
          })
        }
      })
    })
    return result
  }, [neurons])

  // Continuous brain rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setBrainRotation(prev => prev + 0.3)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Fire signals on pulse
  useEffect(() => {
    if (isPulsing) {
      setPulseRings(prev => [...prev, Date.now()])
      setTimeout(() => setPulseRings(prev => prev.slice(1)), 2500)

      // Fire random neural signals
      const signalCount = 5 + Math.floor(intensity / 20)
      const newSignals: Signal[] = []
      
      for (let i = 0; i < signalCount; i++) {
        const fromNeuron = neurons[Math.floor(Math.random() * neurons.length)]
        const toIdx = fromNeuron.connections[Math.floor(Math.random() * fromNeuron.connections.length)]
        if (toIdx !== undefined) {
          const toNeuron = neurons[toIdx]
          newSignals.push({
            id: Date.now() + i,
            fromX: fromNeuron.x,
            fromY: fromNeuron.y,
            toX: toNeuron.x,
            toY: toNeuron.y
          })
        }
      }
      
      setActiveSignals(prev => [...prev, ...newSignals])
      setTimeout(() => {
        setActiveSignals(prev => prev.filter(s => !newSignals.includes(s)))
      }, 1000)
    }
  }, [isPulsing, intensity, neurons])

  // Continuous ambient signals (brainrot effect)
  useEffect(() => {
    const interval = setInterval(() => {
      const fromNeuron = neurons[Math.floor(Math.random() * neurons.length)]
      const toIdx = fromNeuron.connections[Math.floor(Math.random() * fromNeuron.connections.length)]
      if (toIdx !== undefined) {
        const toNeuron = neurons[toIdx]
        const signal: Signal = {
          id: Date.now() + Math.random(),
          fromX: fromNeuron.x,
          fromY: fromNeuron.y,
          toX: toNeuron.x,
          toY: toNeuron.y
        }
        setActiveSignals(prev => [...prev.slice(-20), signal])
        setTimeout(() => {
          setActiveSignals(prev => prev.filter(s => s.id !== signal.id))
        }, 800)
      }
    }, 150 - intensity) // Faster with higher intensity
    return () => clearInterval(interval)
  }, [intensity, neurons])

  const glowIntensity = 15 + (intensity * 0.5)
  
  // IQ level indicators
  const iqLevel = Math.floor(50 + intensity * 1.5)
  const iqStatus = 
    iqLevel >= 180 ? "GENIUS" :
    iqLevel >= 150 ? "BRILLIANT" :
    iqLevel >= 120 ? "INTELLIGENT" :
    iqLevel >= 90 ? "ACTIVE" : "DORMANT"

  return (
    <div className="relative flex items-center justify-center w-[400px] h-[400px]">
      {/* IQ Level Display */}
      <motion.div
        className="absolute -top-16 left-1/2 -translate-x-1/2 text-center font-mono"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-xs text-muted-foreground mb-1">Neural IQ</div>
        <motion.div
          className="text-4xl font-bold text-primary"
          animate={{ scale: isPulsing ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {iqLevel}
        </motion.div>
        <div className="text-xs text-accent mt-1">{iqStatus}</div>
      </motion.div>
      {/* Expanding pulse rings */}
      <AnimatePresence>
        {pulseRings.map((id) => (
          <motion.div
            key={id}
            className="absolute rounded-full border border-primary/40"
            initial={{ width: 60, height: 50, opacity: 0.9 }}
            animate={{ 
              width: 450, 
              height: 380, 
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            style={{
              boxShadow: `0 0 ${glowIntensity}px var(--glow-primary)`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main brain container with subtle rotation */}
      <motion.div
        className="relative w-full h-full"
        animate={{ rotate: brainRotation }}
        transition={{ duration: 0 }}
        style={{ transformOrigin: "center center" }}
      >
        {/* SVG for neural network */}
        <svg 
          viewBox="-200 -180 400 360" 
          className="absolute inset-0 w-full h-full"
          style={{ filter: `drop-shadow(0 0 ${glowIntensity * 0.5}px var(--glow-primary))` }}
        >
          {/* Brain outline glow */}
          <ellipse
            cx="0"
            cy="0"
            rx="150"
            ry="110"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1"
            opacity="0.15"
            className="animate-pulse"
          />

          {/* Synaptic connections */}
          {synapses.map((synapse) => {
            const from = neurons[synapse.from]
            const to = neurons[synapse.to]
            return (
              <motion.line
                key={synapse.id}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="var(--primary)"
                strokeWidth="0.5"
                initial={{ opacity: 0.1 }}
                animate={{ 
                  opacity: [0.1, 0.3, 0.1],
                  strokeWidth: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3 + synapse.delay,
                  repeat: Infinity,
                  delay: synapse.delay
                }}
              />
            )
          })}

          {/* Active signal paths */}
          <AnimatePresence>
            {activeSignals.map((signal) => (
              <motion.g key={signal.id}>
                <motion.line
                  x1={signal.fromX}
                  y1={signal.fromY}
                  x2={signal.toX}
                  y2={signal.toY}
                  stroke="var(--accent)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 1 }}
                  animate={{ pathLength: 1, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    filter: "drop-shadow(0 0 4px var(--glow-secondary))"
                  }}
                />
                <motion.circle
                  r="3"
                  fill="var(--accent)"
                  initial={{ cx: signal.fromX, cy: signal.fromY, opacity: 1 }}
                  animate={{ cx: signal.toX, cy: signal.toY, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    filter: "drop-shadow(0 0 6px var(--glow-secondary))"
                  }}
                />
              </motion.g>
            ))}
          </AnimatePresence>

          {/* Neurons */}
          {neurons.map((neuron, idx) => (
            <motion.g key={neuron.id}>
              {/* Neuron body */}
              <motion.circle
                cx={neuron.x}
                cy={neuron.y}
                r={neuron.size}
                fill={neuron.layer === "core" ? "var(--accent)" : "var(--primary)"}
                initial={{ opacity: 0.6 }}
                animate={{ 
                  opacity: [0.6, 0.9, 0.6],
                  r: [neuron.size, neuron.size * 1.2, neuron.size]
                }}
                transition={{
                  duration: 2 + (idx % 3),
                  repeat: Infinity,
                  delay: idx * 0.1
                }}
                style={{
                  filter: neuron.layer === "core" 
                    ? `drop-shadow(0 0 8px var(--glow-secondary))`
                    : `drop-shadow(0 0 4px var(--glow-primary))`
                }}
              />
              {/* Dendrite extensions for core neurons */}
              {neuron.layer === "core" && (
                <>
                  {[0, 1, 2, 3].map((d) => (
                    <motion.line
                      key={d}
                      x1={neuron.x}
                      y1={neuron.y}
                      x2={neuron.x + Math.cos((d / 4) * Math.PI * 2 + idx) * 15}
                      y2={neuron.y + Math.sin((d / 4) * Math.PI * 2 + idx) * 15}
                      stroke="var(--accent)"
                      strokeWidth="1"
                      opacity="0.4"
                      animate={{
                        opacity: [0.4, 0.8, 0.4],
                        x2: [
                          neuron.x + Math.cos((d / 4) * Math.PI * 2 + idx) * 15,
                          neuron.x + Math.cos((d / 4) * Math.PI * 2 + idx) * 20,
                          neuron.x + Math.cos((d / 4) * Math.PI * 2 + idx) * 15
                        ]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: d * 0.2
                      }}
                    />
                  ))}
                </>
              )}
            </motion.g>
          ))}

          {/* Central brain stem glow */}
          <motion.ellipse
            cx="0"
            cy="0"
            rx="35"
            ry="30"
            fill="url(#brainGlow)"
            animate={{
              rx: isPulsing ? [35, 45, 35] : [35, 38, 35],
              ry: isPulsing ? [30, 38, 30] : [30, 33, 30],
              opacity: isPulsing ? [0.6, 1, 0.6] : [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: isPulsing ? 0.4 : 2,
              repeat: isPulsing ? 0 : Infinity,
            }}
          />

          {/* Gradient definitions */}
          <defs>
            <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
              <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Floating neural particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: 2 + Math.random() * 3,
            height: 2 + Math.random() * 3,
            background: i % 3 === 0 ? "var(--accent)" : "var(--primary)",
            boxShadow: `0 0 ${4 + Math.random() * 4}px ${i % 3 === 0 ? "var(--glow-secondary)" : "var(--glow-primary)"}`
          }}
          initial={{
            x: Math.random() * 350 - 175,
            y: Math.random() * 350 - 175,
            opacity: 0,
          }}
          animate={{
            x: [
              Math.random() * 350 - 175,
              Math.random() * 350 - 175,
              Math.random() * 350 - 175
            ],
            y: [
              Math.random() * 350 - 175,
              Math.random() * 350 - 175,
              Math.random() * 350 - 175
            ],
            opacity: [0, 0.7, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Agent orbiters */}
      {[...Array(Math.min(agentCount, 8))].map((_, i) => (
        <motion.div
          key={`agent-${i}`}
          className="absolute w-3 h-3 rounded-full bg-accent"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            transformOrigin: `${160 + i * 12}px center`,
            boxShadow: "0 0 12px var(--glow-secondary), 0 0 24px var(--glow-secondary)",
          }}
        />
      ))}

      {/* Brainrot glitch layers */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          opacity: [0, 0.03, 0, 0.05, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 2 + Math.random() * 3
        }}
        style={{
          background: "linear-gradient(45deg, var(--accent) 0%, transparent 50%, var(--primary) 100%)",
          mixBlendMode: "overlay"
        }}
      />
    </div>
  )
}
