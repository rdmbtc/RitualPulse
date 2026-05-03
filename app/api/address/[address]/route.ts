import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

const RITUAL_API_BASE = "https://explorer.ritualfoundation.org/api/v2"

interface AddressInfo {
  hash: string
  implementations: any[]
  is_contract: boolean
  is_verified: boolean
  name: string | null
  private_tags: any[]
  public_tags: any[]
  watchlist_names: any[]
  creation_tx_hash?: string
  creator_address_hash?: string
}

interface Transaction {
  hash: string
  block_number: number
  timestamp: string
  from: { hash: string }
  to: { hash: string } | null
  value: string
  gas_used: string
  type: number
}

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  const address = params.address

  console.log("[Address API] ========================================")
  console.log("[Address API] Searching for:", address)

  try {
    // Fetch address info
    console.log("[Address API] Fetching address info...")
    const addressInfoResponse = await fetch(`${RITUAL_API_BASE}/addresses/${address}`, {
      headers: { "Accept": "application/json" },
      cache: "no-store",
    })
    
    console.log("[Address API] Address info status:", addressInfoResponse.status)
    const addressInfo = addressInfoResponse.ok ? await addressInfoResponse.json() : null
    console.log("[Address API] Address info data:", JSON.stringify(addressInfo, null, 2))

    // Fetch transactions
    console.log("[Address API] Fetching transactions...")
    const transactionsResponse = await fetch(`${RITUAL_API_BASE}/addresses/${address}/transactions`, {
      headers: { "Accept": "application/json" },
      cache: "no-store",
    })
    
    console.log("[Address API] Transactions status:", transactionsResponse.status)
    const transactionsData = transactionsResponse.ok ? await transactionsResponse.json() : null
    console.log("[Address API] Transactions data:", JSON.stringify(transactionsData, null, 2))

    const txList = transactionsData?.items || []
    
    console.log("[Address API] Transaction count:", txList.length)

    // Analyze transactions
    let agentTxCount = 0
    let asyncTxCount = 0
    let totalGasUsed = BigInt(0)
    let firstSeen = Date.now() / 1000
    let lastSeen = 0

    txList.forEach((tx: any, index: number) => {
      console.log(`[Address API] TX ${index}:`, {
        hash: tx.hash,
        type: tx.type,
        to: tx.to?.hash,
        timestamp: tx.timestamp,
      })

      const timestamp = new Date(tx.timestamp).getTime() / 1000
      if (timestamp < firstSeen) firstSeen = timestamp
      if (timestamp > lastSeen) lastSeen = timestamp

      // Detect async transactions (type 0x11 = 17, 0x12 = 18)
      if (tx.type === 17 || tx.type === 18) {
        asyncTxCount++
        console.log(`[Address API] Found async tx: type ${tx.type}`)
      }

      // Check if interacting with known precompile addresses for agents
      const toAddress = tx.to?.hash?.toLowerCase()
      if (toAddress && toAddress.startsWith("0x00000000000000000000000000000000000008")) {
        agentTxCount++
        console.log(`[Address API] Found agent tx: to ${toAddress}`)
      }

      if (tx.gas_used) {
        try {
          totalGasUsed += BigInt(tx.gas_used)
        } catch (e) {
          console.error("[Address API] Gas parsing error:", e)
        }
      }
    })

    console.log("[Address API] Analysis results:", {
      totalTx: txList.length,
      agentTx: agentTxCount,
      asyncTx: asyncTxCount,
      totalGas: totalGasUsed.toString(),
    })

    // Calculate level (every 100 transactions = 1 level)
    const level = Math.floor(txList.length / 100) + 1

    // Calculate rank based on actual transaction count
    let rank = "Initiate"
    if (txList.length > 1000) rank = "Neural Master"
    else if (txList.length > 500) rank = "Async Architect"
    else if (txList.length > 200) rank = "Agent Operator"
    else if (txList.length > 50) rank = "Network Contributor"

    // Generate achievements based on actual data
    const achievements: string[] = []
    if (txList.length >= 1) achievements.push("🌟 First Transaction")
    if (txList.length >= 10) achievements.push("🎯 First 10 Transactions")
    if (txList.length >= 100) achievements.push("💯 Century Club")
    if (agentTxCount >= 5) achievements.push("🤖 Agent Caller")
    if (asyncTxCount >= 5) achievements.push("⚡ Async Pioneer")
    if (addressInfo?.is_contract) achievements.push("📜 Smart Contract")
    if (txList.length >= 500) achievements.push("🔥 Power User")

    // Calculate gas in a readable format
    let gasDisplay = "0"
    if (totalGasUsed > 0) {
      const gasInGwei = Number(totalGasUsed) / 1e9
      if (gasInGwei > 1000000) {
        gasDisplay = (gasInGwei / 1000000).toFixed(2) + "M"
      } else if (gasInGwei > 1000) {
        gasDisplay = (gasInGwei / 1000).toFixed(2) + "K"
      } else {
        gasDisplay = gasInGwei.toFixed(2)
      }
    }

    const result = {
      address: address,
      totalTransactions: txList.length,
      agentTransactions: agentTxCount,
      asyncTransactions: asyncTxCount,
      firstSeen: Math.floor(firstSeen),
      lastSeen: Math.floor(lastSeen || firstSeen),
      totalGasUsed: gasDisplay,
      rank,
      level,
      achievements,
      isContract: addressInfo?.is_contract || false,
      isVerified: addressInfo?.is_verified || false,
      balance: addressInfo?.coin_balance || "0",
      recentTransactions: txList.slice(0, 10).map((tx: any) => ({
        hash: tx.hash,
        blockNumber: tx.block_number,
        timestamp: tx.timestamp,
        value: tx.value,
        type: tx.type,
      })),
    }

    console.log("[Address API] Returning result:", JSON.stringify(result, null, 2))
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
