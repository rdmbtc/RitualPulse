"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { WalletConnect } from "@/components/wallet-connect"
import { TweetPublisher } from "@/components/tweet-publisher"
import { UserContributions } from "@/components/user-contributions"
import { UserStats } from "@/components/user-stats"

export default function ProfilePage() {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-primary font-mono">
            RITUAL_PULSE
          </a>
          
          <WalletConnect
            onConnect={(addr) => {
              setAddress(addr)
              setIsConnected(true)
            }}
            onDisconnect={() => {
              setAddress(null)
              setIsConnected(false)
            }}
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-24 pb-12">
        {!isConnected ? (
          <motion.div
            className="max-w-2xl mx-auto text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-4">Your Profile</h1>
            <p className="text-muted-foreground mb-8">
              Connect your wallet to view your contributions and publish tweets to the Ritual blockchain
            </p>
            <div className="flex justify-center">
              <WalletConnect
                onConnect={(addr) => {
                  setAddress(addr)
                  setIsConnected(true)
                }}
                onDisconnect={() => {
                  setAddress(null)
                  setIsConnected(false)
                }}
              />
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* User Stats */}
            <UserStats address={address!} />

            {/* Tweet Publisher */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TweetPublisher address={address!} />
            </motion.div>

            {/* User Contributions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <UserContributions address={address!} />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
