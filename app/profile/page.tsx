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
          <div className="flex items-center gap-4">
            <a 
              href="/" 
              className="text-muted-foreground hover:text-primary transition-colors"
              title="Back to home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </a>
            <a href="/" className="text-xl font-bold text-primary font-mono">
              RITUAL_PULSE
            </a>
          </div>
          
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
