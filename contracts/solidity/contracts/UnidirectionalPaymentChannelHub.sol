// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract UnidirectionalPaymentChannelHub {
    
    struct PaymentChannel {
        address payable sender;
        address payable recipient;
        address tokenAddress;
        uint256 expiration;
        uint256 amount;
        bool open;
    }
    
    // SENDER => RECEIVER => TOKEN_ADDRESS => CHANNELID
    mapping (address => mapping (address => mapping (address => bytes32))) public usersToId;
    mapping (bytes32 => PaymentChannel) public idToChannel;


    event ChannelOpened(
        address sender,
        address recipient, 
        uint256 expiration, 
        address tokenAddress, 
        uint256 tokenAmount,
        bytes32 channelId
    );

    event ChannelClosed(
        address sender,
        address recipient, 
        address tokenAddress, 
        uint256 amountToSender,
        uint256 amountToRecipient,
        bytes32 channelId
    );

    event ChannelExtended(
        address sender,
        address recipient, 
        address tokenAddress, 
        uint256 newExpiration,
        bytes32 channelId
    );
    
    event TimeoutClaimed(
        address sender,
        address recipient, 
        address tokenAddress, 
        uint256 tokenAmount,
        bytes32 channelId
    );

    // proxy, add ownership?
    constructor() {}
    
    function open(
        address payable recipient, 
        uint256 duration, 
        address tokenAddress, 
        uint256 tokenAmount
    ) 
        payable 
        public 
    {
        require(msg.sender != recipient, "Sender and recipient cannot be the same address");
        require(recipient != address(0), "Recipient can't be zero");

        // If channel already exists, it has to be closed for you to create a new one
        // TODO Make it possible to open multiple channels???
        if (_channelExists(msg.sender, recipient, tokenAddress)) {
            bytes32 id = usersToId[msg.sender][recipient][tokenAddress];
            require (
                idToChannel[id].open == false, 
                "Contract between these addresses using this token is already open"
            );
        }

        uint256 amount;

        // If ERC20 is being sent
        if (tokenAddress != address(0)) {
            require(msg.value == 0, "Ether and ERC20 tokens cannot be used together");
            amount = tokenAmount;
            ERC20 erc20 = ERC20(tokenAddress);
            require(
                erc20.transferFrom(msg.sender, address(this), tokenAmount),
                "Tokens could not be transferred"
            );
        } 
        // If ether is being sent
        else {
            require(msg.value > 0, "Ether must be supplied");
            require (tokenAmount == 0, "Ether and ERC20 tokens cannot be used together");
            amount = msg.value;
        }


        bytes32 id = keccak256(abi.encodePacked(msg.sender, recipient, block.timestamp));
        

        PaymentChannel memory newChannel = PaymentChannel(
            payable(msg.sender), 
            recipient,
            tokenAddress,
            block.timestamp + duration, 
            amount, 
            true
        );

        usersToId[msg.sender][recipient][tokenAddress] = id;
        idToChannel[id] = newChannel;
        emit ChannelOpened(
            msg.sender,
            recipient, 
            block.timestamp + duration, 
            tokenAddress, 
            amount,
            id
        );
    }

    /// the recipient can close the channel at any time by presenting a
    /// signed amount from the sender. the recipient will be sent that amount,
    /// and the remainder will go back to the sender
    function close(address sender, address recipient, address tokenAddress, uint256 amount, bytes memory signature) public {
        require(_channelExists(sender, recipient, tokenAddress), "Channel does not exist");
        bytes32 id = usersToId[sender][recipient][tokenAddress];
        PaymentChannel storage channel = idToChannel[id];

        require(channel.open = true, "Channel not open");
        require(msg.sender == channel.recipient, "Only recipient can close the channel");
        require(amount <= channel.amount, "Signed amount is higher than payment channel balance");
        require(isValidSignature(sender, recipient, tokenAddress, amount, signature), "Not a valid signature");
        
        channel.open = false;

        // ERC20 Token
        if (tokenAddress != address(0)) {
            ERC20 erc20 = ERC20(tokenAddress);
            require(
                erc20.transfer(channel.recipient, amount),
                "Tokens could not be transferred to recipient"
            );
            require(
                erc20.transfer(channel.sender, channel.amount - amount),
                "Tokens could not be transferred to recipient"
            );
        } 
        // Ether
        else {
            channel.recipient.transfer(amount);
            channel.sender.transfer(channel.amount - amount);
        }

        emit ChannelClosed(
            channel.sender,
            channel.recipient, 
            channel.tokenAddress, 
            channel.amount - amount,
            amount,
            id
        );
    }

    /// the sender can extend the expiration at any time
    function extend(address recipient, address tokenAddress, uint256 newExpiration) public {
        require(_channelExists(msg.sender, recipient, tokenAddress), "Channel does not exist");
        bytes32 id = usersToId[msg.sender][recipient][tokenAddress];
        PaymentChannel storage channel = idToChannel[id];

        require(msg.sender == channel.sender);
        require(newExpiration > channel.expiration);

        channel.expiration = newExpiration;

        emit ChannelExtended(
            channel.sender,
            channel.recipient, 
            channel.tokenAddress, 
            newExpiration,
            id
        );
    }

    /// if the timeout is reached without the recipient closing the channel,
    /// then the Ether is released back to the sender.
    function claimTimeout(address recipient, address tokenAddress) public {
        require(_channelExists(msg.sender, recipient, tokenAddress), "Channel does not exist");
        bytes32 id = usersToId[msg.sender][recipient][tokenAddress];
        PaymentChannel storage channel = idToChannel[id];

        require(block.timestamp >= channel.expiration);
        require (msg.sender == channel.sender);
        require(channel.open == true);

        channel.open = false;

        // ERC20 Token
        if (tokenAddress != address(0)) {
            ERC20 erc20 = ERC20(tokenAddress);
            require(
                erc20.transfer(channel.sender, channel.amount),
                "Tokens could not be transferred"
            );
        } 
        // Ether
        else {
            channel.sender.transfer(channel.amount);
        }

        emit TimeoutClaimed(
            channel.sender,
            channel.recipient, 
            channel.tokenAddress, 
            channel.amount,
            id
        );
    }

    function isValidSignature(address sender, address recipient, address tokenAddress, uint256 amount, bytes memory signature)
        public
        view
        returns (bool)
    {
        require(_channelExists(sender, recipient, tokenAddress), "Channel does not exist");
        bytes32 id = usersToId[sender][recipient][tokenAddress];
        PaymentChannel memory channel = idToChannel[id];

        bytes32 message = prefixed(keccak256(abi.encodePacked(this, id, amount)));

        // check that the signature is from the payment sender
        return recoverSigner(message, signature) == channel.sender;
    }

    function getUsersToId(address sender, address recipient, address tokenAddress) external view returns(bytes32) {
        return usersToId[sender][recipient][tokenAddress];
    }

    function getIdToChannel(bytes32 id) external view returns(PaymentChannel memory) {
        return idToChannel[id];
    }

    function getPaymentChannel(address sender, address recipient, address tokenAddress) external view returns(PaymentChannel memory) {
        require(_channelExists(sender, recipient, tokenAddress), "Channel does not exist");
        bytes32 id = usersToId[sender][recipient][tokenAddress];
        PaymentChannel memory channel = idToChannel[id];

        return channel;
    }

    function _channelExists(address sender, address recipient, address tokenAddress) internal view returns(bool exists) {
        // If there is no struct, all values will be 0 including sender
        return usersToId[sender][recipient][tokenAddress] != bytes32(0);
    }

    function splitSignature(bytes memory sig)
        internal
        pure
        returns (uint8 v, bytes32 r, bytes32 s)
    {
        require(sig.length == 65);

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }

    function recoverSigner(bytes32 message, bytes memory sig)
        internal
        pure
        returns (address)
    {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(sig);

        return ecrecover(message, v, r, s);
    }

    /// builds a prefixed hash to mimic the behavior of eth_sign.
    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }
}