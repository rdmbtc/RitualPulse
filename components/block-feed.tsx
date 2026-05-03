"use client"

import { motion, AnimatePresence } from "framer-motion"

export interface BlockData {
  number: number
  timestamp: number
  txCount: number
  agentTxCount: number
  asyncTxCount: number
  hash: string
}

interface BlockFeedProps {
  blocks: BlockData[]
  onBlockClick?: (block: BlockData) => void
}

export function BlockFeed({ blocks, onBlockClick }: BlockFeedProps) {
  return (
    <motion.div 
      className="fixed bottom-6 right-6 z-50 font-mono text-sm max-w-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      <div className="bg-card border border-border rounded overflow-hidden">
        {/* Header */}
        <div className="px-4 py-2 border-b border-border flex items-center justify-between">
          <span className="text-foreground text-sm font-medium">Recent blocks</span>
          <motion.span 
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        {/* Blocks list */}
        <div className="max-h-[300px] overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {blocks.slice(0, 8).map((block, index) => (
              <motion.div
                key={block.number}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.2,
                }}
                className={`px-4 py-3 border-b border-border/30 cursor-pointer transition-colors hover:bg-muted/30 ${
                  index === 0 ? "bg-muted/50" : ""
                }`}
                onClick={() => onBlockClick?.(block)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-primary font-bold">
                    #{block.number.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {formatTimeAgo(block.timestamp)}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-foreground">
                    {block.txCount} tx
                  </span>
                  {block.agentTxCount > 0 && (
                    <span className="text-accent flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {block.agentTxCount} agent
                    </span>
                  )}
                  {block.asyncTxCount > 0 && (
                    <span className="text-chart-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-chart-3" />
                      {block.asyncTxCount} async
                    </span>
                  )}
                </div>

                {/* Mini hash preview */}
                <div className="mt-1 text-xs text-muted-foreground/60 font-mono truncate">
                  {block.hash}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {blocks.length === 0 && (
          <div className="px-4 py-8 text-center text-muted-foreground">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Connecting to network...
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() / 1000) - timestamp)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  return `${Math.floor(seconds / 3600)}h ago`
}
