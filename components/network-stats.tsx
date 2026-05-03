"use client"

import { motion } from "framer-motion"

interface NetworkStatsProps {
  avgBlockTime: number
  activeValidators: number
  pendingTransactions: number
  totalBlocks: number
  totalTransactions: number
  networkUtilization: number
}

export function NetworkStats({
  avgBlockTime,
  activeValidators,
  pendingTransactions,
  totalBlocks,
  totalTransactions,
  networkUtilization,
}: NetworkStatsProps) {
  return (
    <motion.div 
      className="fixed bottom-6 left-6 z-50 font-mono text-sm max-w-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9 }}
    >
      <div className="bg-card border border-border rounded overflow-hidden">
        {/* Header */}
        <div className="px-4 py-2 border-b border-border">
          <span className="text-foreground text-sm font-medium">Network stats</span>
        </div>

        {/* Stats grid */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-muted-foreground text-xs mb-1">Avg block time</div>
              <div className="text-foreground font-semibold">{avgBlockTime}ms</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs mb-1">Validators</div>
              <div className="text-foreground font-semibold">{activeValidators}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs mb-1">Pending txs</div>
              <div className="text-foreground font-semibold">{pendingTransactions}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs mb-1">Utilization</div>
              <div className="text-foreground font-semibold">{networkUtilization}%</div>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div>
            <div className="text-muted-foreground text-xs mb-1">Total blocks</div>
            <div className="text-foreground font-semibold">{totalBlocks.toLocaleString()}</div>
          </div>

          <div>
            <div className="text-muted-foreground text-xs mb-1">Total transactions</div>
            <div className="text-foreground font-semibold">{totalTransactions.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
