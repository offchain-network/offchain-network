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
    
    // SENDER => RECEIVER => TOKEN_ADDRESS => CHANNEL
    mapping (address => mapping (address => mapping (address => PaymentChannel))) channels;

    constructor() {}

    
    function getPaymentChannel(address sender, address recipient, address tokenAddress) external view returns(PaymentChannel memory) {
        require (_channelExists(sender, recipient, tokenAddress), "Channel does not exist");
        PaymentChannel memory channel = channels[sender][recipient][tokenAddress];

        return channel;
    }
    

    function _channelExists(address sender, address recipient, address tokenAddress) internal view returns(bool exists) {
        // If there is no struct, all values will be 0 including sender
        return channels[sender][recipient][tokenAddress].sender != address(0);
    }
    
    
    
    
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
            require (
                channels[msg.sender][recipient][tokenAddress].open == false, 
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



        

        PaymentChannel memory newChannel = PaymentChannel(
            payable(msg.sender), 
            recipient,
            tokenAddress,
            block.timestamp+duration, 
            amount, 
            true
        );

        channels[msg.sender][recipient][tokenAddress] = newChannel;
    }

    /// the recipient can close the channel at any time by presenting a
    /// signed amount from the sender. the recipient will be sent that amount,
    /// and the remainder will go back to the sender
    function close(address sender, address recipient, address tokenAddress, uint256 amount, bytes memory signature) public {
        require (_channelExists(sender, recipient, tokenAddress), "Channel does not exist");
        PaymentChannel storage channel = channels[sender][recipient][tokenAddress];

        require(channel.open = true);
        require(msg.sender == channel.recipient);
        require(isValidSignature(sender, recipient, tokenAddress, amount, signature));
        
        channel.open = false;


        // ERC20 Token
        if (tokenAddress != address(0)) {
            ERC20 erc20 = ERC20(tokenAddress);
            require(
                erc20.transfer(channel.recipient, amount),
                "Tokens could not be transferred"
            );
        } 
        // Ether
        else {
            channel.recipient.transfer(amount);
        }
    }

    /// the sender can extend the expiration at any time
    function extend(address recipient, address tokenAddress, uint256 newExpiration) public {
        require (_channelExists(msg.sender, recipient, tokenAddress), "Channel does not exist");
        PaymentChannel storage channel = channels[msg.sender][recipient][tokenAddress];

        require(msg.sender == channel.sender);
        require(newExpiration > channel.expiration);

        channel.expiration = newExpiration;
    }

    /// if the timeout is reached without the recipient closing the channel,
    /// then the Ether is released back to the sender.
    function claimTimeout(address sender, address recipient, address tokenAddress) public {
        require (_channelExists(sender, recipient, tokenAddress), "Channel does not exist");
        PaymentChannel storage channel = channels[sender][recipient][tokenAddress];

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
    }

    function isValidSignature(address sender, address recipient, address tokenAddress, uint256 amount, bytes memory signature)
        public
        view
        returns (bool)
    {
        require (_channelExists(sender, recipient, tokenAddress), "Channel does not exist");
        PaymentChannel memory channel = channels[sender][recipient][tokenAddress];

        bytes32 message = prefixed(keccak256(abi.encodePacked(this, amount)));

        // check that the signature is from the payment sender
        return recoverSigner(message, signature) == channel.sender;
    }

    /// All functions below this are just taken from the chapter
    /// 'creating and verifying signatures' chapter.

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