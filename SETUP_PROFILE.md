# Profile & Tweet Publishing Setup Guide

This guide will help you set up the profile page with wallet login and tweet publishing to the Ritual blockchain.

## 🎯 Features

- **Wallet Connection**: Connect MetaMask or any Web3 wallet
- **Tweet Publishing**: Publish tweets to Ritual blockchain for 0.0001 RITUAL
- **User Stats**: View balance, transaction count, and published tweets
- **Contributions**: See all your published tweets stored on-chain forever

## 📋 Prerequisites

1. **MetaMask** or another Web3 wallet installed
2. **Ritual testnet tokens** in your wallet
3. **Node.js** and npm installed

## 🚀 Setup Steps

### Step 1: Create Environment File

Create a `.env` file in the project root:

```bash
# Your wallet private key (for deploying the contract)
DEPLOYER_PRIVATE_KEY=0xyour_private_key_here

# Contract address (will be filled after deployment)
NEXT_PUBLIC_TWEET_CONTRACT_ADDRESS=
```

**⚠️ IMPORTANT:** 
- Never commit your `.env` file to git
- Keep your private key secure
- Only use a testnet wallet with small amounts

### Step 2: Get Ritual Testnet Tokens

1. Visit the Ritual faucet (if available) or bridge tokens
2. Ensure you have at least 0.1 RITUAL for deployment and testing

### Step 3: Compile the Smart Contract

```bash
npm run compile-contract
```

This will create `contracts/build/TweetStorage.bin` and `TweetStorage.abi`

### Step 4: Deploy the Contract

```bash
npm run deploy-contract
```

You should see output like:

```
🚀 Deploying TweetStorage Contract
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Deployer: 0x...
💰 Balance: 1.5 RITUAL

📝 Deploying contract...
📤 Transaction hash: 0x...
⏳ Waiting for confirmation...

✅ Contract deployed successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Contract Address: 0x...
🔗 Explorer: https://explorer.ritualfoundation.org/address/0x...
```

### Step 5: Update Environment

Copy the contract address and add it to your `.env` file:

```
NEXT_PUBLIC_TWEET_CONTRACT_ADDRESS=0xYourContractAddressHere
```

### Step 6: Restart Dev Server

```bash
npm run dev
```

### Step 7: Configure MetaMask

Add Ritual network to MetaMask:

- **Network Name**: Ritual
- **RPC URL**: https://rpc.ritualfoundation.org
- **Chain ID**: 7887
- **Currency Symbol**: RITUAL
- **Block Explorer**: https://explorer.ritualfoundation.org

## 🎮 Using the Profile Page

### 1. Connect Wallet

1. Navigate to `/profile` or click "Profile" in the top right
2. Click "Connect Wallet"
3. Approve the connection in MetaMask
4. Switch to Ritual network if prompted

### 2. View Your Stats

Once connected, you'll see:
- **Tweets Published**: Total tweets you've published
- **Balance**: Your RITUAL token balance
- **Total Transactions**: All transactions from your address

### 3. Publish a Tweet

1. Type your message (max 280 characters)
2. Click "Publish" button
3. Confirm the transaction in MetaMask (0.0001 RITUAL + gas)
4. Wait for confirmation
5. Your tweet is now stored on-chain forever!

### 4. View Your Contributions

Scroll down to see all your published tweets with:
- Tweet content
- Timestamp
- Tweet ID on blockchain

## 💰 Costs

- **Tweet Publishing**: 0.0001 RITUAL per tweet
- **Gas Fees**: ~0.0001 RITUAL (varies)
- **Total per tweet**: ~0.0002 RITUAL

## 🔧 Troubleshooting

### "Contract not deployed yet"

- Make sure you ran `npm run deploy-contract`
- Check that `NEXT_PUBLIC_TWEET_CONTRACT_ADDRESS` is set in `.env`
- Restart your dev server after updating `.env`

### "Insufficient payment"

- Ensure you have at least 0.0001 RITUAL + gas fees
- Check your wallet balance on the profile page

### "Failed to connect wallet"

- Install MetaMask or another Web3 wallet
- Make sure you're on the Ritual network
- Try refreshing the page

### "Transaction failed"

- Check you have enough RITUAL for gas fees
- Ensure tweet is between 1-280 characters
- Try increasing gas limit in MetaMask

## 📁 Project Structure

```
app/
  profile/
    page.tsx              # Profile page
components/
  wallet-connect.tsx      # Wallet connection component
  tweet-publisher.tsx     # Tweet publishing interface
  user-stats.tsx          # User statistics display
  user-contributions.tsx  # Published tweets list
contracts/
  TweetStorage.sol        # Smart contract
  deploy-script.ts        # Deployment script
  build/                  # Compiled contract (gitignored)
```

## 🔐 Security Notes

1. **Never share your private key**
2. **Use a separate wallet for testing**
3. **Keep small amounts in testnet wallets**
4. **The `.env` file is gitignored** - don't commit it
5. **Tweets are permanent** - cannot be deleted once published

## 📚 Smart Contract Details

### Functions

- `publishTweet(string)` - Publish a tweet (payable: 0.0001 RITUAL)
- `getTweet(uint256)` - Get tweet by ID
- `getUserTweets(address)` - Get all tweet IDs for a user
- `getUserTweetCount(address)` - Get user's tweet count
- `getLatestTweets(uint256)` - Get latest N tweets

### Events

- `TweetPublished(id, author, content, timestamp)` - Emitted when tweet is published

## 🌐 Resources

- **Ritual Docs**: https://docs.ritualfoundation.org
- **Ritual RPC**: https://rpc.ritualfoundation.org
- **Ritual Explorer**: https://explorer.ritualfoundation.org
- **Chain ID**: 7887

## 🎉 Next Steps

After setup, you can:
1. Publish your first tweet to the blockchain
2. Share your profile with others
3. View all tweets on the explorer
4. Build additional features (likes, replies, etc.)

## 💡 Tips

- Keep tweets under 280 characters
- Each tweet costs 0.0001 RITUAL
- Tweets are stored forever on-chain
- You can view all tweets on the Ritual explorer
- Consider the cost before publishing many tweets

---

Need help? Check the contract README at `contracts/README.md`
