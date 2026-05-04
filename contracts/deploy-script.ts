import { createWalletClient, http, parseEther, createPublicClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { defineChain } from 'viem'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

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

async function deployContract() {
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`
  
  if (!privateKey) {
    console.error('❌ DEPLOYER_PRIVATE_KEY not found in .env')
    console.log('\nPlease create a .env file with:')
    console.log('DEPLOYER_PRIVATE_KEY=0xyour_private_key_here')
    process.exit(1)
  }

  const account = privateKeyToAccount(privateKey)
  
  const walletClient = createWalletClient({
    account,
    chain: ritual,
    transport: http(),
  })

  const publicClient = createPublicClient({
    chain: ritual,
    transport: http(),
  })

  console.log('🚀 Deploying TweetStorage Contract')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📍 Deployer:', account.address)
  
  // Check balance
  const balance = await publicClient.getBalance({ address: account.address })
  console.log('💰 Balance:', Number(balance) / 1e18, 'RITUAL')
  
  if (balance < parseEther('0.01')) {
    console.error('❌ Insufficient balance. Need at least 0.01 RITUAL for deployment.')
    process.exit(1)
  }

  // Read compiled bytecode
  const buildPath = path.join(__dirname, 'build', 'contracts_TweetStorage_sol_TweetStorage.bin')
  
  if (!fs.existsSync(buildPath)) {
    console.error('❌ Compiled contract not found!')
    console.log('\nPlease compile the contract first:')
    console.log('npm run compile-contract')
    process.exit(1)
  }

  const bytecode = '0x' + fs.readFileSync(buildPath, 'utf8').trim()
  
  console.log('\n📝 Deploying contract...')
  
  try {
    // Get gas price and nonce
    const nonce = await publicClient.getTransactionCount({ address: account.address })
    
    console.log('Nonce:', nonce)
    
    // Use EIP-1559 transaction format
    const hash = await walletClient.sendTransaction({
      account,
      to: null,
      data: bytecode as `0x${string}`,
      nonce,
      type: 'eip1559',
    })
    
    console.log('📤 Transaction hash:', hash)
    console.log('⏳ Waiting for confirmation...')
    
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    
    console.log('\n✅ Contract deployed successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📍 Contract Address:', receipt.contractAddress)
    console.log('🔗 Explorer:', `https://explorer.ritualfoundation.org/address/${receipt.contractAddress}`)
    console.log('\n📝 Next steps:')
    console.log('1. Add to .env file:')
    console.log(`   NEXT_PUBLIC_TWEET_CONTRACT_ADDRESS=${receipt.contractAddress}`)
    console.log('2. Restart your dev server: npm run dev')
    
  } catch (error: any) {
    console.error('\n❌ Deployment failed:', error.message)
    if (error.details) {
      console.error('Details:', error.details)
    }
    if (error.cause) {
      console.error('Cause:', error.cause)
    }
    process.exit(1)
  }
}

deployContract().catch(console.error)
