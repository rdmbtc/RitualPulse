"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Zap, Activity, Clock, Award } from "lucide-react"

interface AddressStats {
  address: string
  totalTransactions: number
  agentTransactions: number
  asyncTransactions: number
  firstSeen: number
  lastSeen: number
  totalGasUsed: string
  rank: string
  level: number
  achievements: string[]
}

interface AddressProfileProps {
  stats: AddressStats | null
  onClose: () => void
}

export function AddressProfile({ stats, onClose }: AddressProfileProps) {
  if (!stats) return null

  const agentPercentage = Math.round((stats.agentTransactions / stats.totalTransactions) * 100)
  const asyncPercentage = Math.round((stats.asyncTransactions / stats.totalTransactions) * 100)

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Profile Card */}
        <motion.div
          className="relative bg-card border border-primary/30 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl shadow-primary/20"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Address profile</div>
              <div className="font-mono text-sm text-foreground break-all">{stats.address}</div>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Level & Rank */}
          <div className="px-6 py-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Neural level</div>
                <div className="text-3xl font-bold text-primary">Level {stats.level}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">Network rank</div>
                <div className="text-2xl font-bold text-accent">{stats.rank}</div>
              </div>
            </div>

            {/* XP Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Experience</span>
                <span>{stats.totalTransactions} / {(stats.level + 1) * 100} txs</span>
              </div>
              <div className="h-2 bg-muted rounded overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.totalTransactions % 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="px-6 py-6 border-b border-border">
            <div className="text-sm font-medium text-foreground mb-4">Activity metrics</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Total transactions</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{stats.totalTransactions}</div>
              </div>

              <div className="bg-muted/30 rounded p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground">Agent calls</span>
                </div>
                <div className="text-2xl font-bold text-accent">{stats.agentTransactions}</div>
                <div className="text-xs text-muted-foreground mt-1">{agentPercentage}% of total</div>
              </div>

              <div className="bg-muted/30 rounded p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-chart-3" />
                  <span className="text-xs text-muted-foreground">Async executions</span>
                </div>
                <div className="text-2xl font-bold text-chart-3">{stats.asyncTransactions}</div>
                <div className="text-xs text-muted-foreground mt-1">{asyncPercentage}% of total</div>
              </div>

              <div className="bg-muted/30 rounded p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-foreground" />
                  <span className="text-xs text-muted-foreground">Gas consumed</span>
                </div>
                <div className="text-lg font-bold text-foreground">{stats.totalGasUsed}</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="px-6 py-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Achievements unlocked</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {stats.achievements.map((achievement, i) => (
                <motion.div
                  key={achievement}
                  className="bg-primary/10 border border-primary/30 rounded p-3 text-xs text-foreground"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {achievement}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="px-6 py-6 border-t border-border">
            <div className="text-sm font-medium text-foreground mb-4">Timeline</div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">First seen</span>
                <span className="text-foreground font-mono">{new Date(stats.firstSeen * 1000).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last activity</span>
                <span className="text-foreground font-mono">{new Date(stats.lastSeen * 1000).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Days active</span>
                <span className="text-foreground font-mono">
                  {Math.floor((stats.lastSeen - stats.firstSeen) / 86400)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
