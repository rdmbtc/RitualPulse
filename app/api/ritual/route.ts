import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

// Use Ritual's own Blockscout instance
const RITUAL_BLOCKSCOUT_BASE = "https://explorer.ritualfoundation.org/api/v2"

interface RitualBlock {
  height: number
  timestamp: string
  tx_count: number
  hash: string
}

interface RitualStats {
  total_blocks: string
  total_transactions: string
  total_addresses: string
  average_block_time: string
  coin_price?: string
  coin_price_change_percentage?: number
  gas_prices?: {
    average: number
    fast: number
    slow: number
  }
  gas_used_today?: string
  market_cap?: string
  network_utilization_percentage?: number
  static_gas_price?: string
  transactions_today?: string
  tvl?: string
}

// Fetch blocks from Ritual Blockscout
async function fetchBlocks(): Promise<RitualBlock[]> {
  try {
    const response = await fetch(
      `${RITUAL_BLOCKSCOUT_BASE}/blocks`,
      {
        headers: {
          "Accept": "application/json",
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      throw new Error(`Blocks API returned ${response.status}`)
    }

    const data = await response.json()
    
    if (data.items && Array.isArray(data.items)) {
      return data.items.map((block: any) => ({
        height: block.height,
        timestamp: block.timestamp,
        tx_count: block.tx_count || 0,
        hash: block.hash || "",
      }))
    }

    return []
  } catch (error) {
    console.error("Failed to fetch blocks:", error)
    return []
  }
}

// Fetch network stats
async function fetchStats(): Promise<RitualStats | null> {
  try {
    const response = await fetch(
      `${RITUAL_BLOCKSCOUT_BASE}/stats`,
      {
        headers: {
          "Accept": "application/json",
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data as RitualStats
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return null
  }
}

// Fetch agent transactions
async function fetchAgentTransactions() {
  try {
    const response = await fetch(
      `${RITUAL_BLOCKSCOUT_BASE}/transactions?filter=agent`,
      {
        headers: {
          "Accept": "application/json",
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error("Failed to fetch agent transactions:", error)
    return []
  }
}

// Fetch async transactions
async function fetchAsyncTransactions() {
  try {
    const response = await fetch(
      `${RITUAL_BLOCKSCOUT_BASE}/transactions?filter=async`,
      {
        headers: {
          "Accept": "application/json",
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error("Failed to fetch async transactions:", error)
    return []
  }
}

// Fetch validators
async function fetchValidators() {
  try {
    const response = await fetch(
      `${RITUAL_BLOCKSCOUT_BASE}/validators`,
      {
        headers: {
          "Accept": "application/json",
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error("Failed to fetch validators:", error)
    return []
  }
}

// Fetch mempool
async function fetchMempool() {
  try {
    const response = await fetch(
      `${RITUAL_BLOCKSCOUT_BASE}/transactions?filter=pending`,
      {
        headers: {
          "Accept": "application/json",
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error("Failed to fetch mempool:", error)
    return []
  }
}

// Analyze transaction types from block data
function analyzeTransactions(block: any, agentTxs: any[], asyncTxs: any[]) {
  const blockHash = block.hash
  const blockHeight = block.height
  
  // Count agent and async transactions in this block
  const agentTxCount = agentTxs.filter((tx: any) => 
    tx.block_number === blockHeight || tx.block_hash === blockHash
  ).length
  
  const asyncTxCount = asyncTxs.filter((tx: any) => 
    tx.block_number === blockHeight || tx.block_hash === blockHash
  ).length
  
  return { agentTxCount, asyncTxCount }
}

export async function GET() {
  console.log("[Ritual API] Starting request...")
  
  try {
    console.log("[Ritual API] Fetching data from Ritual explorer...")
    
    const [blocks, stats, agentTxs, asyncTxs, validators, mempool] = await Promise.all([
      fetchBlocks().catch(e => { console.error("[Ritual API] Blocks error:", e); return [] }),
      fetchStats().catch(e => { console.error("[Ritual API] Stats error:", e); return null }),
      fetchAgentTransactions().catch(e => { console.error("[Ritual API] Agent txs error:", e); return [] }),
      fetchAsyncTransactions().catch(e => { console.error("[Ritual API] Async txs error:", e); return [] }),
      fetchValidators().catch(e => { console.error("[Ritual API] Validators error:", e); return [] }),
      fetchMempool().catch(e => { console.error("[Ritual API] Mempool error:", e); return [] }),
    ])

    console.log("[Ritual API] Fetched:", {
      blocks: blocks.length,
      agentTxs: agentTxs.length,
      asyncTxs: asyncTxs.length,
      validators: validators.length,
      mempool: mempool.length,
    })

    // If no blocks, use fallback
    if (blocks.length === 0) {
      console.log("[Ritual API] No blocks fetched, using fallback data")
      return getFallbackResponse()
    }

    // Transform blocks with real agent/async analysis
    const transformedBlocks = blocks.slice(0, 20).map((block) => {
      const { agentTxCount, asyncTxCount } = analyzeTransactions(block, agentTxs, asyncTxs)
      
      return {
        number: block.height,
        timestamp: Math.floor(new Date(block.timestamp).getTime() / 1000),
        txCount: block.tx_count,
        agentTxCount,
        asyncTxCount,
        hash: block.hash,
      }
    })

    // Calculate network IQ based on real activity
    const recentBlocks = transformedBlocks.slice(0, 10)
    const totalAgentTx = recentBlocks.reduce((sum, b) => sum + b.agentTxCount, 0)
    const totalTx = recentBlocks.reduce((sum, b) => sum + b.txCount, 0)
    const totalAsyncTx = recentBlocks.reduce((sum, b) => sum + b.asyncTxCount, 0)
    
    // IQ formula: base 80 + agent activity bonus + tx volume bonus
    const agentBonus = Math.min(totalAgentTx * 10, 60)
    const txBonus = Math.min(totalTx * 0.5, 40)
    const networkIQ = Math.floor(80 + agentBonus + txBonus)

    // Determine async power level
    let asyncPower: "offline" | "charging" | "ready" | "overload" = "charging"
    if (totalAsyncTx === 0) asyncPower = "offline"
    else if (totalAsyncTx < 5) asyncPower = "charging"
    else if (totalAsyncTx < 15) asyncPower = "ready"
    else asyncPower = "overload"

    // Parse stats
    const totalBlocks = parseInt(stats?.total_blocks || "0")
    const totalTransactions = parseInt(stats?.total_transactions || "0")
    const avgBlockTime = parseFloat(stats?.average_block_time || "0.2")

    console.log("[Ritual API] Success! Returning data")

    return NextResponse.json({
      blocks: transformedBlocks,
      stats: {
        networkIQ: Math.min(networkIQ, 200),
        agentsOnline: totalAgentTx,
        asyncPower,
        totalBlocks,
        totalTransactions,
        avgBlockTime: Math.round(avgBlockTime * 1000), // Convert to ms
        activeValidators: validators.length,
        pendingTransactions: mempool.length,
        gasPrice: stats?.static_gas_price || "0",
        networkUtilization: stats?.network_utilization_percentage || 0,
      },
      raw: {
        agentTransactions: agentTxs.length,
        asyncTransactions: asyncTxs.length,
        validators: validators.length,
        mempoolSize: mempool.length,
      },
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("[Ritual API] Fatal error:", error)
    return getFallbackResponse()
  }
}

function getFallbackResponse() {
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
