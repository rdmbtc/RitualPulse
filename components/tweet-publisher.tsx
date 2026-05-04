"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Loader2 } from "lucide-react"
import { createWalletClient, custom, parseEther } from "viem"
import { defineChain } from "viem"

const ritual = defineChain({
  id: 1979,
  name: 'Ritual',
  nativeCurrency: { decimals: 18, name: 'Ritual', symbol: 'RITUAL' },
  rpcUrls: { default: { http: ['https://rpc.ritualfoundation.org'] } },
  blockExplorers: { default: { name: 'Explorer', url: 'https://explorer.ritualfoundation.org' } },
})

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TWEET_CONTRACT_ADDRESS as `0x${string}`

const TWEET_ABI = [
  {
    inputs: [{ name: '_content', type: 'string' }],
    name: 'publishTweet',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

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

interface TweetPublisherProps {
  address: string
}

export function TweetPublisher({ address }: TweetPublisherProps) {
  const [content, setContent] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const publishTweet = async () => {
    if (!content.trim() || content.length > 280) return
    if (!CONTRACT_ADDRESS) {
      alert('Contract not deployed yet. Please deploy the contract first.')
      return
    }

    const provider = getProvider()
    if (!provider) {
      alert('Please install a Web3 wallet (MetaMask, Coinbase Wallet, Trust Wallet, Rainbow, etc.)')
      return
    }

    setIsPublishing(true)
    setTxHash(null)

    try {
      const client = createWalletClient({
        chain: ritual,
        transport: custom(provider),
      })

      const hash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        abi: TWEET_ABI,
        functionName: 'publishTweet',
        args: [content],
        value: parseEther('0.0001'),
        account: address as `0x${string}`,
      })

      setTxHash(hash)
      setContent("")
      
      alert('Tweet published successfully!')
    } catch (error: any) {
      console.error('Error publishing tweet:', error)
      alert(error.message || 'Failed to publish tweet')
    } finally {
      setIsPublishing(false)
    }
  }

  const charCount = content.length
  const isOverLimit = charCount > 280

  return (
    <div className="bg-card border border-border rounded p-6">
      <h2 className="text-xl font-bold mb-4">Publish to Blockchain</h2>
      
      <div className="space-y-4">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening on Ritual?"
            className="w-full h-32 bg-background border border-border rounded p-3 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isPublishing}
          />
          
          <div className="flex items-center justify-between mt-2">
            <span className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
              {charCount} / 280
            </span>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Cost: 0.0001 RITUAL
              </span>
              
              <motion.button
                onClick={publishTweet}
                disabled={isPublishing || !content.trim() || isOverLimit}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Publish
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {txHash && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/10 border border-primary rounded p-3"
          >
            <p className="text-sm text-primary font-mono">
              Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </p>
            <a
              href={`https://explorer.ritualfoundation.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              View on Explorer →
            </a>
          </motion.div>
        )}
      </div>
    </div>
  )
}
