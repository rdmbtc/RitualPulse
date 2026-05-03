"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { BlockData } from "./block-feed"

interface BlockAlertProps {
  block: BlockData | null
  hasAgentTx: boolean
}

export function BlockAlert({ block, hasAgentTx }: BlockAlertProps) {
  if (!block) return null

  return (
    <AnimatePresence>
      <motion.div
        key={block.number}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none text-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.5 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Block arrived text */}
        <motion.div
          className="font-mono mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="text-muted-foreground text-sm mb-2">Block arrived</div>
          <div className={`text-4xl md:text-6xl font-bold ${hasAgentTx ? "text-accent" : "text-primary"}`}>
            #{block.number.toLocaleString()}
          </div>
        </motion.div>

        {/* Agent TX burst effect */}
        {hasAgentTx && (
          <motion.div
            className="text-accent text-lg font-bold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.1, 1] }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            Agent activity detected
          </motion.div>
        )}

        {/* Expanding rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border ${
              hasAgentTx ? "border-accent/50" : "border-primary/50"
            }`}
            initial={{ width: 100, height: 100, opacity: 0.8 }}
            animate={{ width: 400 + i * 100, height: 400 + i * 100, opacity: 0 }}
            transition={{ duration: 1.5, delay: i * 0.15, ease: "easeOut" }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
