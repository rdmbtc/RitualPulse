"use client"

import { motion, AnimatePresence } from "framer-motion"

interface NetworkIQProps {
  iq: number
  agentsOnline: number
  asyncPower: "offline" | "charging" | "ready" | "overload"
  latestBlock: number | null
}

function getIQStatus(iq: number): { label: string; color: string } {
  if (iq >= 180) return { label: "GENIUS", color: "text-accent" }
  if (iq >= 150) return { label: "BRILLIANT", color: "text-primary" }
  if (iq >= 120) return { label: "INTELLIGENT", color: "text-chart-3" }
  if (iq >= 90) return { label: "ACTIVE", color: "text-foreground" }
  if (iq >= 50) return { label: "DORMANT", color: "text-muted-foreground" }
  return { label: "OFFLINE", color: "text-destructive" }
}

function getAsyncColor(power: string): string {
  switch (power) {
    case "overload": return "text-accent"
    case "ready": return "text-primary"
    case "charging": return "text-chart-3"
    default: return "text-muted-foreground"
  }
}

export function NetworkIQ({ iq, agentsOnline, asyncPower, latestBlock }: NetworkIQProps) {
  const status = getIQStatus(iq)

  return (
    <motion.div 
      className="fixed top-32 left-6 z-50 font-mono text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {/* Main stats container */}
      <div className="bg-card border border-border rounded p-4 space-y-3 min-w-[240px]">
        {/* Network IQ */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-foreground text-sm font-medium">Network IQ</span>
            <span className={`text-xs ${status.color}`}>{status.label}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={iq}
                className={`text-3xl font-bold ${status.color}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {iq}
              </motion.span>
            </AnimatePresence>
          </div>
          {/* IQ bar */}
          <div className="h-1 bg-muted rounded overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(iq / 2, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-muted-foreground text-xs mb-1">Agents</div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={agentsOnline}
                  className="text-lg font-semibold text-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {agentsOnline}
                </motion.span>
              </AnimatePresence>
              <span className="text-muted-foreground text-xs">online</span>
            </div>
          </div>

          <div>
            <div className="text-muted-foreground text-xs mb-1">Async power</div>
            <div className={`text-lg font-semibold ${getAsyncColor(asyncPower)}`}>
              {asyncPower}
            </div>
          </div>
        </div>

        {/* Latest block */}
        {latestBlock && (
          <>
            <div className="h-px bg-border" />
            <div>
              <div className="text-muted-foreground text-xs mb-1">Latest block</div>
              <div className="flex items-center gap-2">
                <span className="text-primary text-lg font-bold">#{latestBlock.toLocaleString()}</span>
                <motion.span 
                  className="text-xs text-muted-foreground"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  synced
                </motion.span>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
