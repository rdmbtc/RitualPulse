// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TweetStorage {
    uint256 public constant TWEET_COST = 0.0001 ether; // 0.0001 RITUAL
    
    struct Tweet {
        address author;
        string content;
        uint256 timestamp;
        uint256 id;
    }
    
    mapping(uint256 => Tweet) public tweets;
    mapping(address => uint256[]) public userTweets;
    uint256 public tweetCount;
    
    event TweetPublished(
        uint256 indexed id,
        address indexed author,
        string content,
        uint256 timestamp
    );
    
    function publishTweet(string memory _content) external payable {
        require(msg.value >= TWEET_COST, "Insufficient payment");
        require(bytes(_content).length > 0, "Tweet cannot be empty");
        require(bytes(_content).length <= 280, "Tweet too long");
        
        tweetCount++;
        
        tweets[tweetCount] = Tweet({
            author: msg.sender,
            content: _content,
            timestamp: block.timestamp,
            id: tweetCount
        });
        
        userTweets[msg.sender].push(tweetCount);
        
        emit TweetPublished(tweetCount, msg.sender, _content, block.timestamp);
        
        // Refund excess payment
        if (msg.value > TWEET_COST) {
            (bool success, ) = payable(msg.sender).call{value: msg.value - TWEET_COST}("");
            require(success, "Refund failed");
        }
    }
    
    function getTweet(uint256 _id) external view returns (Tweet memory) {
        require(_id > 0 && _id <= tweetCount, "Invalid tweet ID");
        return tweets[_id];
    }
    
    function getUserTweets(address _user) external view returns (uint256[] memory) {
        return userTweets[_user];
    }
    
    function getUserTweetCount(address _user) external view returns (uint256) {
        return userTweets[_user].length;
    }
    
    function getLatestTweets(uint256 _count) external view returns (Tweet[] memory) {
        uint256 count = _count > tweetCount ? tweetCount : _count;
        Tweet[] memory latestTweets = new Tweet[](count);
        
        for (uint256 i = 0; i < count; i++) {
            latestTweets[i] = tweets[tweetCount - i];
        }
        
        return latestTweets;
    }
    
    // Allow contract owner to withdraw accumulated fees
    function withdraw() external {
        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}
