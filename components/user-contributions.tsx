"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createPublicClient, http } from "viem"
import { defineChain } from "viem"
import { Loader2 } from "lucide-react"

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
    inputs: [{ name: '_user', type: 'address' }],
    name: 'getUserTweets',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_id', type: 'uint256' }],
    name: 'getTweet',
    outputs: [
      {
        components: [
          { name: 'author', type: 'address' },
          { name: 'content', type: 'string' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'id', type: 'uint256' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

interface Tweet {
  id: bigint
  author: string
  content: string
  timestamp: bigint
}

interface UserContributionsProps {
  address: string
}

export function UserContributions({ address }: UserContributionsProps) {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUserTweets()
  }, [address])

  const fetchUserTweets = async () => {
    if (!CONTRACT_ADDRESS) {
      setIsLoading(false)
      return
    }

    try {
      const client = createPublicClient({
        chain: ritual,
        transport: http(),
      })

      const tweetIds = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: TWEET_ABI,
        functionName: 'getUserTweets',
        args: [address as `0x${string}`],
      })

      const tweetPromises = tweetIds.map((id) =>
        client.readContract({
          address: CONTRACT_ADDRESS,
          abi: TWEET_ABI,
          functionName: 'getTweet',
          args: [id],
        })
      )

      const tweetData = await Promise.all(tweetPromises)
      
      const formattedTweets = tweetData
        .filter((tweet) => tweet && tweet[0] && tweet[1] && tweet[2] && tweet[3]) // Filter out invalid tweets
        .map((tweet) => ({
          id: tweet[3],
          author: tweet[0],
          content: tweet[1],
          timestamp: tweet[2],
        }))

      setTweets(formattedTweets.reverse())
    } catch (error) {
      console.error('Error fetching tweets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded p-6">
        <h2 className="text-xl font-bold mb-4">Your Contributions</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded p-6">
      <h2 className="text-xl font-bold mb-4">Your Contributions</h2>
      
      {!CONTRACT_ADDRESS ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Contract not deployed yet.</p>
          <p className="text-sm mt-2">Deploy the TweetStorage contract to start publishing.</p>
        </div>
      ) : tweets.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No tweets published yet.</p>
          <p className="text-sm mt-2">Publish your first tweet to the blockchain!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tweets.map((tweet, index) => (
            <motion.div
              key={tweet.id?.toString() || `tweet-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-background border border-border rounded p-4"
            >
              <p className="text-foreground mb-2">{tweet.content}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatDate(tweet.timestamp)}</span>
                <span className="font-mono">ID: {tweet.id?.toString() || 'N/A'}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
