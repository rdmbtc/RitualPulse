"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createPublicClient, http } from "viem"
import { defineChain } from "viem"
import { FileText, Coins, Activity } from "lucide-react"

const ritual = defineChain({
  id: 7887,
  name: 'Ritual',
  nativeCurrency: { decimals: 18, name: 'Ritual', symbol: 'RITUAL' },
  rpcUrls: { default: { http: ['https://rpc.ritualfoundation.org'] } },
  blockExplorers: { default: { name: 'Explorer', url: 'https://explorer.ritualfoundation.org' } },
})

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TWEET_CONTRACT_ADDRESS as `0x${string}`

const TWEET_ABI = [
  {
    inputs: [{ name: '_user', type: 'address' }],
    name: 'getUserTweetCount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

interface UserStatsProps {
  address: string
}

export function UserStats({ address }: UserStatsProps) {
  const [tweetCount, setTweetCount] = useState(0)
  const [balance, setBalance] = useState("0")
  const [txCount, setTxCount] = useState(0)

  useEffect(() => {
    fetchStats()
  }, [address])

  const fetchStats = async () => {
    try {
      const client = createPublicClient({
        chain: ritual,
        transport: http(),
      })

      // Get balance
      const bal = await client.getBalance({
        address: address as `0x${string}`,
      })
      setBalance((Number(bal) / 1e18).toFixed(4))

      // Get transaction count
      const txCnt = await client.getTransactionCount({
        address: address as `0x${string}`,
      })
      setTxCount(Number(txCnt))

      // Get tweet count if contract is deployed
      if (CONTRACT_ADDRESS) {
        const tweetCnt = await client.readContract({
          address: CONTRACT_ADDRESS,
          abi: TWEET_ABI,
          functionName: 'getUserTweetCount',
          args: [address as `0x${string}`],
        })
        setTweetCount(Number(tweetCnt))
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <div className="bg-card border border-border rounded p-6">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">Tweets Published</span>
        </div>
        <p className="text-3xl font-bold">{tweetCount}</p>
      </div>

      <div className="bg-card border border-border rounded p-6">
        <div className="flex items-center gap-3 mb-2">
          <Coins className="w-5 h-5 text-accent" />
          <span className="text-sm text-muted-foreground">Balance</span>
        </div>
        <p className="text-3xl font-bold">{balance} RITUAL</p>
      </div>

      <div className="bg-card border border-border rounded p-6">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-5 h-5 text-chart-3" />
          <span className="text-sm text-muted-foreground">Total Transactions</span>
        </div>
        <p className="text-3xl font-bold">{txCount}</p>
      </div>
    </motion.div>
  )
}
