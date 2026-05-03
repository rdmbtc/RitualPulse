import { NextResponse } from "next/server"
import { createPublicClient, http, type Address } from 'viem'
import { defineChain } from 'viem'

export const dynamic = "force-dynamic"
export const revalidate = 0

// Define Ritual chain
const ritual = defineChain({
  id: 7887, // Ritual chain ID
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

export async function GET(
  request: Request,
  context: { params: Promise<{ address: string }> }
) {
  const { address } = await context.params

  console.log("[Address API] ========================================")
  console.log("[Address API] Searching for:", address)

  try {
    // Validate address format
    if (!address || !address.startsWith('0x') || address.length !== 42) {
      return NextResponse.json(
        { error: "Invalid address format" },
        { status: 400 }
      )
    }

    // Get current block number
    const currentBlock = await client.getBlockNumber()
    console.log("[Address API] Current block:", currentBlock)

    // Get address balance
    const balance = await client.getBalance({ 
      address: address as Address 
    })
    console.log("[Address API] Balance:", balance)

    // Get transaction count (nonce)
    const txCount = await client.getTransactionCount({ 
      address: address as Address 
    })
    console.log("[Address API] Transaction count:", txCount)

    // Get code to check if it's a contract
    const code = await client.getBytecode({ 
      address: address as Address 
    })
    const isContract = code !== undefined && code !== '0x'
    console.log("[Address API] Is contract:", isContract)

    // Calculate level and rank
    const level = Math.floor(Number(txCount) / 100) + 1
    let rank = "Initiate"
    if (txCount > 1000n) rank = "Neural Master"
    else if (txCount > 500n) rank = "Async Architect"
    else if (txCount > 200n) rank = "Agent Operator"
    else if (txCount > 50n) rank = "Network Contributor"

    // Generate achievements
    const achievements: string[] = []
    if (txCount >= 1n) achievements.push("🌟 First Transaction")
    if (txCount >= 10n) achievements.push("🎯 First 10 Transactions")
    if (txCount >= 100n) achievements.push("💯 Century Club")
    if (isContract) achievements.push("📜 Smart Contract")
    if (txCount >= 500n) achievements.push("🔥 Power User")

    // Format balance
    const balanceInRitual = Number(balance) / 1e18
    const balanceFormatted = balanceInRitual.toFixed(4)

    const result = {
      address: address,
      totalTransactions: Number(txCount),
      agentTransactions: 0, // Would need to parse transaction logs
      asyncTransactions: 0, // Would need to parse transaction logs
      firstSeen: Math.floor(Date.now() / 1000) - (Number(txCount) * 12), // Estimate
      lastSeen: Math.floor(Date.now() / 1000),
      totalGasUsed: "0", // Would need to fetch all transactions
      rank,
      level,
      achievements,
      isContract,
      isVerified: false,
      balance: balanceFormatted + " RITUAL",
      recentTransactions: [],
    }

    console.log("[Address API] Success! Returning:", result)
    console.log("[Address API] ========================================")

    return NextResponse.json(result)
  } catch (error) {
    console.error("[Address API] Fatal error:", error)
    console.log("[Address API] ========================================")
    
    return NextResponse.json(
      { error: "Failed to fetch address data", message: String(error) },
      { status: 500 }
    )
  }
}

function getDemoAddressData(address: string) {
  return {
    address: address,
    totalTransactions: 247,
    agentTransactions: 42,
    asyncTransactions: 18,
    firstSeen: Math.floor(Date.now() / 1000) - 86400 * 30,
    lastSeen: Math.floor(Date.now() / 1000),
    totalGasUsed: "1.2M",
    rank: "Agent Operator",
    level: 3,
    achievements: [
      "🎯 First 10 Transactions",
      "💯 Century Club",
      "🤖 Agent Caller",
      "⚡ Async Pioneer",
    ],
    isContract: false,
    isVerified: false,
    recentTransactions: [],
    demo: true,
  }
}
