"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { BlockData } from "@/components/block-feed"

interface NetworkStats {
  networkIQ: number
  agentsOnline: number
  asyncPower: "offline" | "charging" | "ready" | "overload"
  totalBlocks: number
  totalTransactions: number
  avgBlockTime: number
  activeValidators: number
  pendingTransactions: number
  gasPrice: string
  networkUtilization: number
}

interface UseRitualDataReturn {
  blocks: BlockData[]
  stats: NetworkStats
  isConnected: boolean
  latestBlock: BlockData | null
  newBlockArrived: boolean
  hasAgentTx: boolean
  clearNewBlockFlag: () => void
}

const DEFAULT_STATS: NetworkStats = {
  networkIQ: 100,
  agentsOnline: 0,
  asyncPower: "charging",
  totalBlocks: 0,
  totalTransactions: 0,
  avgBlockTime: 207,
  activeValidators: 0,
  pendingTransactions: 0,
  gasPrice: "0",
  networkUtilization: 0,
}

export function useRitualData(pollInterval = 5000): UseRitualDataReturn {
  const [blocks, setBlocks] = useState<BlockData[]>([])
  const [stats, setStats] = useState<NetworkStats>(DEFAULT_STATS)
  const [isConnected, setIsConnected] = useState(false)
  const [newBlockArrived, setNewBlockArrived] = useState(false)
  const [hasAgentTx, setHasAgentTx] = useState(false)
  
  const lastBlockRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/ritual")
      if (!response.ok) throw new Error("Failed to fetch")
      
      const data = await response.json()
      
      setBlocks(data.blocks)
      setStats(data.stats)
      setIsConnected(true)

      // Check for new block
      const latestBlockNum = data.blocks[0]?.number
      if (latestBlockNum && lastBlockRef.current !== null && latestBlockNum > lastBlockRef.current) {
        setNewBlockArrived(true)
        setHasAgentTx(data.blocks[0]?.agentTxCount > 0)
        
        // Auto-clear the flag after animation
        setTimeout(() => {
          setNewBlockArrived(false)
          setHasAgentTx(false)
        }, 2500)
      }
      
      lastBlockRef.current = latestBlockNum
    } catch (error) {
      console.error("Failed to fetch ritual data:", error)
      setIsConnected(false)
    }
  }, [])

  const clearNewBlockFlag = useCallback(() => {
    setNewBlockArrived(false)
    setHasAgentTx(false)
  }, [])

  useEffect(() => {
    // Initial fetch
    fetchData()

    // Set up polling
    intervalRef.current = setInterval(fetchData, pollInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchData, pollInterval])

  return {
    blocks,
    stats,
    isConnected,
    latestBlock: blocks[0] || null,
    newBlockArrived,
    hasAgentTx,
    clearNewBlockFlag,
  }
}
