import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface RitualBlock {
  height: number
  timestamp: string
  tx_count: number
  hash: string
}

interface RitualStats {
  total_blocks: number
  total_transactions: number
  total_addresses: number
  average_block_time: number
}

// Fetch blocks from Ritual explorer API
async function fetchBlocks(): Promise<RitualBlock[]> {
  try {
    // Try the Ritual explorer API
    const response = await fetch(
      "https://explorer.ritualfoundation.org/api/v2/blocks?type=block",
      {
        headers: {
          "Accept": "application/json",
        },
        next: { revalidate: 0 },
      }
    )

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }

    const data = await response.json()
    
    // Handle different API response formats
    if (data.items && Array.isArray(data.items)) {
      return data.items.map((block: Record<string, unknown>) => ({
        height: block.height as number,
        timestamp: block.timestamp as string,
        tx_count: block.tx_count as number || 0,
        hash: block.hash as string || "",
      }))
    }
    
    if (Array.isArray(data)) {
      return data.map((block: Record<string, unknown>) => ({
        height: block.height as number || block.number as number,
        timestamp: block.timestamp as string,
        tx_count: block.tx_count as number || block.txCount as number || 0,
        hash: block.hash as string || "",
      }))
    }

    return []
  } catch (error) {
    console.error("[v0] Failed to fetch blocks:", error)
    return []
  }
}

// Fetch network stats
async function fetchStats(): Promise<RitualStats | null> {
  try {
    const response = await fetch(
      "https://explorer.ritualfoundation.org/api/v2/stats",
      {
        headers: {
          "Accept": "application/json",
        },
        next: { revalidate: 0 },
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return {
      total_blocks: data.total_blocks || 0,
      total_transactions: data.total_transactions || 0,
      total_addresses: data.total_addresses || 0,
      average_block_time: data.average_block_time || 12,
    }
  } catch (error) {
    console.error("[v0] Failed to fetch stats:", error)
    return null
  }
}

// Simulate agent and async tx detection (since exact endpoint unknown)
// In production, you'd query specific contract addresses or tx types
function analyzeTransactions(txCount: number) {
  // Simulate realistic distribution based on tx count
  const agentTxCount = Math.floor(Math.random() * Math.min(txCount, 5))
  const asyncTxCount = Math.floor(Math.random() * Math.min(txCount - agentTxCount, 3))
  
  return { agentTxCount, asyncTxCount }
}

export async function GET() {
  try {
    const [blocks, stats] = await Promise.all([
      fetchBlocks(),
      fetchStats(),
    ])

    // Transform blocks with agent/async analysis
    const transformedBlocks = blocks.slice(0, 20).map((block) => {
      const { agentTxCount, asyncTxCount } = analyzeTransactions(block.tx_count)
      
      return {
        number: block.height,
        timestamp: Math.floor(new Date(block.timestamp).getTime() / 1000),
        txCount: block.tx_count,
        agentTxCount,
        asyncTxCount,
        hash: block.hash,
      }
    })

    // Calculate network IQ based on activity
    const recentBlocks = transformedBlocks.slice(0, 10)
    const totalAgentTx = recentBlocks.reduce((sum, b) => sum + b.agentTxCount, 0)
    const totalTx = recentBlocks.reduce((sum, b) => sum + b.txCount, 0)
    
    // IQ formula: base 80 + agent activity bonus + tx volume bonus
    const agentBonus = Math.min(totalAgentTx * 10, 60)
    const txBonus = Math.min(totalTx * 0.5, 40)
    const networkIQ = Math.floor(80 + agentBonus + txBonus)

    // Determine async power level
    let asyncPower: "offline" | "charging" | "ready" | "overload" = "charging"
    const totalAsyncTx = recentBlocks.reduce((sum, b) => sum + b.asyncTxCount, 0)
    if (totalAsyncTx === 0) asyncPower = "offline"
    else if (totalAsyncTx < 5) asyncPower = "charging"
    else if (totalAsyncTx < 15) asyncPower = "ready"
    else asyncPower = "overload"

    return NextResponse.json({
      blocks: transformedBlocks,
      stats: {
        networkIQ: Math.min(networkIQ, 200),
        agentsOnline: totalAgentTx,
        asyncPower,
        totalBlocks: stats?.total_blocks || transformedBlocks[0]?.number || 0,
        totalTransactions: stats?.total_transactions || 0,
        avgBlockTime: stats?.average_block_time || 12,
      },
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    
    // Return fallback data for demo purposes
    const now = Math.floor(Date.now() / 1000)
    const fallbackBlocks = Array.from({ length: 10 }, (_, i) => ({
      number: 18291 - i,
      timestamp: now - i * 12,
      txCount: Math.floor(Math.random() * 20) + 5,
      agentTxCount: Math.floor(Math.random() * 3),
      asyncTxCount: Math.floor(Math.random() * 2),
      hash: `0x${Math.random().toString(16).slice(2, 18)}...${Math.random().toString(16).slice(2, 10)}`,
    }))

    return NextResponse.json({
      blocks: fallbackBlocks,
      stats: {
        networkIQ: 142,
        agentsOnline: 7,
        asyncPower: "charging" as const,
        totalBlocks: 18291,
        totalTransactions: 1500000,
        avgBlockTime: 12,
      },
      timestamp: Date.now(),
      fallback: true,
    })
  }
}
