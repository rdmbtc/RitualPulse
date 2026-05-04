"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Wallet, LogOut } from "lucide-react"
import { createPublicClient, createWalletClient, custom, http, type Address } from "viem"
import { defineChain } from "viem"

const ritual = defineChain({
  id: 1979,
  name: 'Ritual',
  nativeCurrency: {
    decimals: 18,
    name: 'Ritual',
    symbol: 'RITUAL',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ritualfoundation.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.ritualfoundation.org' },
  },
})

interface WalletConnectProps {
  onConnect: (address: string) => void
  onDisconnect: () => void
}

// Get the Web3 provider from various wallet extensions
const getProvider = () => {
  if (typeof window === 'undefined') return null
  
  // Check for EIP-6963 providers (modern standard)
  if (window.ethereum?.providers?.length) {
    return window.ethereum.providers[0]
  }
  
  // Check for standard ethereum provider
  if (window.ethereum) {
    return window.ethereum
  }
  
  // Check for specific wallet providers
  if (window.coinbaseWalletExtension) {
    return window.coinbaseWalletExtension
  }
  
  if (window.trustWallet) {
    return window.trustWallet
  }
  
  if (window.phantom?.ethereum) {
    return window.phantom.ethereum
  }
  
  return null
}

export function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    checkConnection()
  }, [])

  const checkConnection = async () => {
    const provider = getProvider()
    if (provider) {
      try {
        const accounts = await provider.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAddress(accounts[0])
          onConnect(accounts[0])
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }
  }

  const connectWallet = async () => {
    const provider = getProvider()
    
    if (!provider) {
      alert('Please install a Web3 wallet (MetaMask, Coinbase Wallet, Trust Wallet, Rainbow, etc.)')
      return
    }

    setIsConnecting(true)

    try {
      // Request account access
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      })

      // Switch to Ritual network
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x7BB' }], // 1979 in hex
        })
      } catch (switchError: any) {
        // Chain not added, add it
        if (switchError.code === 4902) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x7BB',
                chainName: 'Ritual',
                nativeCurrency: {
                  name: 'Ritual',
                  symbol: 'RITUAL',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.ritualfoundation.org'],
                blockExplorerUrls: ['https://explorer.ritualfoundation.org'],
              },
            ],
          })
        } else {
          throw switchError
        }
      }

      setAddress(accounts[0])
      onConnect(accounts[0])
    } catch (error) {
      console.error('Error connecting wallet:', error)
      alert('Failed to connect wallet. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    onDisconnect()
  }

  if (!mounted) return null

  if (address) {
    return (
      <motion.button
        onClick={disconnectWallet}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded hover:bg-muted transition-colors font-mono text-sm"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Wallet className="w-4 h-4" />
        <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
        <LogOut className="w-4 h-4 ml-2" />
      </motion.button>
    )
  }

  return (
    <motion.button
      onClick={connectWallet}
      disabled={isConnecting}
      className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors font-mono text-sm disabled:opacity-50"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Wallet className="w-4 h-4" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </motion.button>
  )
}
