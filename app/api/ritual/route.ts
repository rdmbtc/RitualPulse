import { NextResponse } from "next/server"
import { createPublicClient, http } from 'viem'
import { defineChain } from 'viem'

export const dynamic = "force-dynamic"
export const revalidate = 0

// Define Ritual chain
const ritual = defineChain({
  id: 7887,
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

// Create viem client
const client = createPublicClient({
  chain: ritual,
  transport: http(),
})

export async function GET() {
  console.log("[Ritual API] Starting request with RPC...")
  
  try {
    // Get current block
    const currentBlockNumber = await client.getBlockNumber()
    console.log("[Ritual API] Current block:", currentBlockNumber)

    // Get last 20 blocks
    const blocks = []
    
    for (let i = 0n; i < 20n; i++) {
      const blockNumber = currentBlockNumber - i
      if (blockNumber < 0n) break
      
      const block = await client.getBlock({ blockNumber })
      
      blocks.push({
        number: Number(block.number),
        timestamp: Number(block.timestamp),
        txCount: block.transactions.length,
        agentTxCount: 0, // Would need to analyze transactions
        asyncTxCount: 0, // Would need to analyze transactions
        hash: block.hash || "",
      })
    }

    console.log("[Ritual API] Fetched", blocks.length, "blocks")
    console.log("[Ritual API] Sample block timestamp:", blocks[0]?.timestamp)

    // Calculate total transactions from fetched blocks
    const totalTxInBlocks = blocks.reduce((sum, b) => sum + b.txCount, 0)
    
    // Calculate network IQ based on recent activity
    const recentBlocks = blocks.slice(0, 10)
    const recentTx = recentBlocks.reduce((sum, b) => sum + b.txCount, 0)
    const networkIQ = Math.min(80 + recentTx * 2, 200)

    // Estimate total transactions (approximate based on average)
    const avgTxPerBlock = totalTxInBlocks / blocks.length
    const estimatedTotalTx = Math.floor(Number(currentBlockNumber) * avgTxPerBlock)

    // Calculate average block time from recent blocks
    let avgBlockTime = 207 // default
    if (blocks.length >= 2) {
      const timeDiff = blocks[0].timestamp - blocks[blocks.length - 1].timestamp
      avgBlockTime = Math.floor((timeDiff / (blocks.length - 1)) * 1000) // convert to ms
    }

    // Try to fetch agent count from a contract or use estimation
    // For now, we'll use a more realistic estimation based on transaction patterns
    // The explorer shows ~50 agents, so we estimate based on unique transaction patterns
    let agentsOnline = 50 // Default from explorer
    
    // If we have transaction data, we can estimate active agents
    if (recentTx > 0) {
      // Rough estimate: assume each agent makes 1-3 transactions per 10 blocks
      const estimatedActiveAgents = Math.min(Math.floor(recentTx / 2), 50)
      agentsOnline = Math.max(estimatedActiveAgents, 4) // At least 4 if there's activity
    }

    // Calculate network utilization
    const maxTxPerBlock = 100 // assumed max
    const utilization = Math.min(Math.floor((avgTxPerBlock / maxTxPerBlock) * 100), 100)

    return NextResponse.json({
      blocks,
      stats: {
        networkIQ,
        agentsOnline,
        asyncPower: recentTx > 50 ? "overload" : recentTx > 20 ? "ready" : "charging",
        totalBlocks: Number(currentBlockNumber),
        totalTransactions: estimatedTotalTx,
        avgBlockTime,
        activeValidators: 40, // Would need validator endpoint
        pendingTransactions: 0, // Would need mempool access
        gasPrice: "0",
        networkUtilization: utilization,
      },
      raw: {
        agentTransactions: 0,
        asyncTransactions: 0,
        validators: 0,
        mempoolSize: 0,
      },
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("[Ritual API] RPC error:", error)
    
    // Return fallback data
    const now = Math.floor(Date.now() / 1000)
    const fallbackBlocks = Array.from({ length: 10 }, (_, i) => ({
      number: 14367000 - i,
      timestamp: now - Math.floor(i * 0.2),
      txCount: Math.floor(Math.random() * 10) + 2,
      agentTxCount: Math.floor(Math.random() * 3),
      asyncTxCount: Math.floor(Math.random() * 2),
      hash: `0x${Math.random().toString(16).slice(2, 18)}...`,
    }))

    return NextResponse.json({
      blocks: fallbackBlocks,
      stats: {
        networkIQ: 142,
        agentsOnline: 7,
        asyncPower: "ready" as const,
        totalBlocks: 14367000,
        totalTransactions: 28500000,
        avgBlockTime: 207,
        activeValidators: 40,
        pendingTransactions: 4,
        gasPrice: "0",
        networkUtilization: 45,
      },
      raw: {
        agentTransactions: 0,
        asyncTransactions: 0,
        validators: 0,
        mempoolSize: 0,
      },
      timestamp: Date.now(),
      fallback: true,
    })
  }
}
