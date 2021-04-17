// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract UnidirectionPaymentChannelHub {
    
    struct PaymentChannel {
        address payable sender;
        address payable recipient;
        uint256 expiration;
        uint256 amount;
        bool open;
    }
    
    PaymentChannel[] channels;
    
    function open(address payable recipient, uint256 duration) payable external returns(uint256 id){
        require(msg.value > 0);
        require(msg.sender != recipient);
        PaymentChannel memory newChannel = PaymentChannel(payable(msg.sender), recipient, block.timestamp+duration, msg.value, true);
        channels.push(newChannel);
        return channels.length-1;
    }

    /// the recipient can close the channel at any time by presenting a
    /// signed amount from the sender. the recipient will be sent that amount,
    /// and the remainder will go back to the sender
    function close(uint256 channelIndex, uint256 amount, bytes memory signature) public {
        PaymentChannel storage channel = channels[channelIndex];
        require(channel.open = true);
        require(msg.sender == channel.recipient);
        require(isValidSignature(channelIndex, amount, signature));
        
        channel.open = false;
        channel.recipient.transfer(amount);
    }

    /// the sender can extend the expiration at any time
    function extend(uint256 channelIndex, uint256 newExpiration) public {
        PaymentChannel storage channel = channels[channelIndex];
        require(msg.sender == channel.sender);
        require(newExpiration > channel.expiration);

        channel.expiration = newExpiration;
    }

    /// if the timeout is reached without the recipient closing the channel,
    /// then the Ether is released back to the sender.
    function claimTimeout(uint256 channelIndex) public {
        PaymentChannel storage channel = channels[channelIndex];
        require(block.timestamp >= channel.expiration);
        require(channel.open == true);
        uint256 amount = channel.amount;
        channel.open = false;
        channel.sender.transfer(amount);
    }

    function isValidSignature(uint256 channelIndex, uint256 amount, bytes memory signature)
        public
        view
        returns (bool)
    {
        PaymentChannel memory channel = channels[channelIndex];
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