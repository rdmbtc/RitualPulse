# TweetStorage Smart Contract

This contract allows users to publish tweets to the Ritual blockchain for 0.0001 RITUAL per tweet.

## Features

- Publish tweets (max 280 characters) for 0.0001 RITUAL
- Store tweets permanently on-chain
- Query user's tweets
- Get latest tweets
- Automatic refund of excess payment

## Deployment Steps

### 1. Install Dependencies

```bash
npm install --save-dev solc
```

### 2. Compile the Contract

```bash
npx solc --bin --abi contracts/TweetStorage.sol -o contracts/build
```

### 3. Set Up Environment

Create a `.env` file:

```
DEPLOYER_PRIVATE_KEY=0xyour_private_key_here
```

**Important:** Never commit your `.env` file! It's already in `.gitignore`.

### 4. Deploy the Contract

```bash
npx ts-node contracts/deploy-script.ts
```

### 5. Update Environment

After deployment, add the contract address to `.env`:

```
NEXT_PUBLIC_TWEET_CONTRACT_ADDRESS=0xYourContractAddress
```

### 6. Restart Dev Server

```bash
npm run dev
```

## Contract Functions

### `publishTweet(string memory _content)`
- **Cost:** 0.0001 RITUAL
- **Description:** Publish a tweet to the blockchain
- **Requirements:** 
  - Payment >= 0.0001 RITUAL
  - Content length: 1-280 characters

### `getTweet(uint256 _id)`
- **Returns:** Tweet struct (author, content, timestamp, id)
- **Description:** Get a specific tweet by ID

### `getUserTweets(address _user)`
- **Returns:** Array of tweet IDs
- **Description:** Get all tweet IDs for a user

### `getUserTweetCount(address _user)`
- **Returns:** uint256
- **Description:** Get total number of tweets by a user

### `getLatestTweets(uint256 _count)`
- **Returns:** Array of Tweet structs
- **Description:** Get the latest N tweets

## Testing

You can test the contract on Ritual testnet:
- RPC: https://rpc.ritualfoundation.org
- Chain ID: 1979
- Explorer: https://explorer.ritualfoundation.org
- Faucet: https://faucet.ritualfoundation.org

## Security Notes

- Contract uses `require` statements for validation
- Automatic refund of excess payment
- No reentrancy vulnerabilities (simple state changes)
- Immutable tweet storage (cannot be deleted or modified)
