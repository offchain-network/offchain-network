import { ethers } from 'ethers';

export async function constructPaymentMessage(contractAddress, channelId, amount) {
    return ethers.utils.solidityKeccak256(
        ["address", "bytes32", "uint256"],
        [contractAddress, channelId, amount]
    );
}

export async function signPayment(signer, contractAddress, channelId, amount) {
    let message = await constructPaymentMessage(contractAddress, channelId, amount);
    let signedMessage = await signer.signMessage(ethers.utils.arrayify(message));
    return signedMessage;
}