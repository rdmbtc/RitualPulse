"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { NeuralBrain } from "@/components/neural-brain"
import { RitualLogo3D } from "@/components/ritual-logo-3d"
import { MatrixRain } from "@/components/matrix-rain"
import { NetworkIQ } from "@/components/network-iq"
import { BlockFeed } from "@/components/block-feed"
import { GlitchOverlay } from "@/components/glitch-overlay"
import { BlockAlert } from "@/components/block-alert"
import { NetworkStats } from "@/components/network-stats"
import { AddressSearch } from "@/components/address-search"
import { AddressProfile } from "@/components/address-profile"
import { JarvisInterface } from "@/components/jarvis-interface"
import { useRitualData } from "@/hooks/use-ritual-data"

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

export default function RitualPulsePage() {
  const { 
    blocks, 
    stats, 
    isConnected, 
    latestBlock, 
    newBlockArrived,
    hasAgentTx,
  } = useRitualData(4000)

  const [showBlockAlert, setShowBlockAlert] = useState(false)
  const [screenShake, setScreenShake] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [addressStats, setAddressStats] = useState<AddressStats | null>(null)

  // Trigger effects when new block arrives
  useEffect(() => {
    if (newBlockArrived) {
      setShowBlockAlert(true)
      
      if (stats.networkIQ > 150 || hasAgentTx) {
        setScreenShake(true)
        setTimeout(() => setScreenShake(false), 300)
      }

      setTimeout(() => setShowBlockAlert(false), 2000)
    }
  }, [newBlockArrived, stats.networkIQ, hasAgentTx])

  const handleSearch = async (query: string) => {
    setIsSearching(true)
    
    try {
      // Validate input
      if (!query || query.length < 10) {
        console.error("Invalid query")
        setIsSearching(false)
        return
      }

      console.log("Searching for:", query)
      const response = await fetch(`/api/address/${query}`)
      
      console.log("Response status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log("Address data:", data)
        setAddressStats(data)
      } else {
        const errorText = await response.text()
        console.error("Address not found:", response.status, errorText)
        alert("Address not found or invalid")
      }
    } catch (error) {
      console.error("Search failed:", error)
      alert("Search failed. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const intensity = Math.min(100, stats.networkIQ - 50)

  return (
    <motion.main
      className="relative min-h-screen bg-background overflow-hidden"
      animate={{
        x: screenShake ? [0, -3, 3, -2, 2, 0] : 0,
        y: screenShake ? [0, 2, -2, 1, -1, 0] : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Background grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Matrix rain background */}
      <MatrixRain intensity={intensity} />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Jarvis Interface */}
      <JarvisInterface
        networkIQ={stats.networkIQ}
        agentsOnline={stats.agentsOnline}
        asyncPower={stats.asyncPower}
        newBlockArrived={newBlockArrived}
        hasAgentTx={hasAgentTx}
      />

      {/* Address Search */}
      <AddressSearch onSearch={handleSearch} isSearching={isSearching} />

      {/* Main 3D Ritual Logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <RitualLogo3D 
          isPulsing={newBlockArrived} 
          intensity={intensity}
        />
      </div>

      {/* Neural Brain (smaller, in background) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 scale-75">
        <NeuralBrain 
          isPulsing={newBlockArrived} 
          intensity={intensity}
          agentCount={stats.agentsOnline}
        />
      </div>

      {/* Network IQ display */}
      <NetworkIQ 
        iq={stats.networkIQ}
        agentsOnline={stats.agentsOnline}
        asyncPower={stats.asyncPower}
        latestBlock={latestBlock?.number ?? null}
      />

      {/* Block feed */}
      <BlockFeed blocks={blocks} />

      {/* Network stats */}
      <NetworkStats
        avgBlockTime={stats.avgBlockTime}
        activeValidators={stats.activeValidators}
        pendingTransactions={stats.pendingTransactions}
        totalBlocks={stats.totalBlocks}
        totalTransactions={stats.totalTransactions}
        networkUtilization={stats.networkUtilization}
      />

      {/* Block arrival alert */}
      {showBlockAlert && (
        <BlockAlert block={latestBlock} hasAgentTx={hasAgentTx} />
      )}

      {/* Address Profile Modal */}
      {addressStats && (
        <AddressProfile
          stats={addressStats}
          onClose={() => setAddressStats(null)}
        />
      )}

      {/* Glitch effect on agent transactions */}
      <GlitchOverlay 
        active={hasAgentTx && newBlockArrived} 
        intensity={stats.networkIQ > 170 ? "high" : "medium"}
      />

      {/* Connection status */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 font-mono text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <motion.div 
            className={`w-2 h-2 rounded-full ${isConnected ? "bg-primary" : "bg-destructive"}`}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span>{isConnected ? "Connected" : "Reconnecting..."}</span>
        </div>
      </div>

      {/* Scanline overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />
    </motion.main>
  )
}
