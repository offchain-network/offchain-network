import { expect } from "chai";
import { waffle, ethers } from "hardhat";
import { Signer } from "ethers";

async function constructPaymentMessage(contractAddress, channelId, amount) {
    return ethers.utils.solidityKeccak256(
        ["address", "bytes32", "uint256"],
        [contractAddress, channelId, amount]
    );
}

/*
async function signMessage(signer, message) {
    await signer.signMessage(
        ethers.utils.arrayify(message)
    );
}
*/

// contractAddress is used to prevent cross-contract replay attacks.
// amount, in wei, specifies how much Ether should be sent.

async function signPayment(signer, contractAddress, channelId, amount) {
    var message = await constructPaymentMessage(contractAddress, channelId, amount);
    let signedMessage = await signer.signMessage(ethers.utils.arrayify(message));
    return signedMessage;
}

describe("UnidirectionalPaymentChannelHub", function() {

	  let SimpleToken;
	  let testToken;
	  let sender;
	  let recipient;
	  let stranger;

	beforeEach(async function () {
	    SimpleToken = await ethers.getContractFactory("SimpleToken");
	    testToken = await SimpleToken.deploy("TestToken", "TEST", 1000000);
	    await testToken.deployed();

	    [sender, recipient, stranger] = await ethers.getSigners();

	});

	describe("open", function () {

		let hub;

		beforeEach(async function() {
			const Hub = await ethers.getContractFactory("UnidirectionalPaymentChannelHub");
		    hub = await Hub.deploy();
		    await hub.deployed();
		});

		it("Should open an ETH payment channel correctly", async function() {

			let overrides = { value: ethers.utils.parseEther("1.0") };
			await hub.open(recipient.address, 10000, ethers.constants.AddressZero, 0, overrides);

			let channel = await hub.getPaymentChannel(sender.address, recipient.address, ethers.constants.AddressZero);
			expect(channel.sender).to.equal(sender.address);
			expect(channel.recipient).to.equal(recipient.address);
			expect(channel.tokenAddress).to.equal(ethers.constants.AddressZero);
			expect(channel.amount).to.equal(ethers.utils.parseEther("1.0"));
			expect(channel.open).to.equal(true);
		});


		it("Should open an ERC20 payment channel correctly", async function() {
			await testToken.approve(hub.address, 10000);
			await hub.open(recipient.address, 10000, testToken.address, 10000);

			let channel = await hub.getPaymentChannel(sender.address, recipient.address, testToken.address);
			expect(channel.sender).to.equal(sender.address);
			expect(channel.recipient).to.equal(recipient.address);
			expect(channel.tokenAddress).to.equal(testToken.address);
			expect(channel.amount).to.equal(10000);
			expect(channel.open).to.equal(true);
		});


		it("Should fail when no ether is supplied to an ETH payment channel", async function() {

			let overrides = { value: ethers.utils.parseEther("0.0") };

			await expect(hub.open(recipient.address, 10000, ethers.constants.AddressZero, 0, overrides)).to.be.reverted;
		});

		it("Should fail when Ether is supplied to an ERC20 payment channel", async function() {

			let overrides = { value: ethers.utils.parseEther("1.0") };

			await testToken.approve(hub.address, 10000);
			await expect(hub.open(recipient.address, 10000, testToken.address, 10000, overrides)).to.be.reverted;
		});

		it("Should fail when not enough allowed tokens are is supplied to an ERC20 payment channel", async function() {
			await expect(hub.open(recipient.address, 10000, testToken.address, 10000)).to.be.reverted;
		});

		it("Should fail when recipient address is zero", async function() {

			let overrides = { value: ethers.utils.parseEther("1.0") };
			await expect(hub.open(ethers.constants.AddressZero, 10000, ethers.constants.AddressZero, 0, overrides)).to.be.reverted;
		});

		it("Should fail when two identical channels are opened", async function() {

			let overrides = { value: ethers.utils.parseEther("1.0") };
			await hub.open(recipient.address, 10000, ethers.constants.AddressZero, 0, overrides);
			await expect(hub.open(recipient.address, 10000, ethers.constants.AddressZero, 0, overrides)).to.be.reverted;
		});
	});

	describe("extend", function () {

		let hub;

		beforeEach(async function() {
			const Hub = await ethers.getContractFactory("UnidirectionalPaymentChannelHub");
		    hub = await Hub.deploy();
		    await hub.deployed();

		    await testToken.approve(hub.address, 100000);

			let overrides = { value: ethers.utils.parseEther("1.0") };
			await hub.open(recipient.address, 10000, ethers.constants.AddressZero, 0, overrides);
			await hub.open(recipient.address, 10000, testToken.address, 100000);
		});

		it("Should extend if newExpiration is after expiration", async function() {
			await hub.extend(recipient.address, ethers.constants.AddressZero, Math.round(Date.now()/1000)+100000);
			await hub.extend(recipient.address, testToken.address, Math.round(Date.now()/1000)+100000);

			let channel = await hub.getPaymentChannel(sender.address, recipient.address, ethers.constants.AddressZero);
			let tokenChannel = await hub.getPaymentChannel(sender.address, recipient.address, testToken.address);
			expect(channel.expiration).to.be.gt(Math.round(Date.now()/1000)+90000);
			expect(tokenChannel.expiration).to.be.gt(Math.round(Date.now()/1000)+90000);
		});

		it("Should fail if newExpiration is before expiration", async function() {
			await expect(hub.extend(recipient.address, ethers.constants.AddressZero, Math.round(Date.now()/1000)+1000)).to.be.reverted;
			await expect(hub.extend(recipient.address, testToken.address, Math.round(Date.now()/1000)+1000)).to.be.reverted;
		});

		it("Should fail if recipient tries to extend it", async function() {
			await expect(hub.connect(recipient).extend(recipient.address, ethers.constants.AddressZero, Math.round(Date.now()/1000)+100000)).to.be.reverted;
			await expect(hub.connect(recipient).extend(recipient.address, testToken.address, Math.round(Date.now()/1000)+100000)).to.be.reverted;
		});

	});


	describe("claimTimeout", function () {

		let hub;

		beforeEach(async function() {
			const Hub = await ethers.getContractFactory("UnidirectionalPaymentChannelHub");
		    hub = await Hub.deploy();
		    await hub.deployed();

		    await testToken.approve(hub.address, 100000);

			let overrides = { value: ethers.utils.parseEther("1.0") };
			await hub.open(recipient.address, 1000, ethers.constants.AddressZero, 0, overrides);
			await hub.open(recipient.address, 1000, testToken.address, 100000);
		});

		// TODO Check if claim timeout transfers funds back
		it("Should allow sender to claim timeout if channel expired", async function() {
			ethers.provider.send("evm_increaseTime", [5000])   // add 5000 seconds
			await expect(await hub.claimTimeout(recipient.address, ethers.constants.AddressZero));
//				.to.changeEtherBalance(sender, ethers.utils.parseEther("1.0"));
//			ethers.provider.send("evm_mine", []);
			await expect(await hub.claimTimeout(recipient.address, testToken.address));
//				.to.changeTokenBalance(testToken, sender, 100000);

			let channel = await hub.getPaymentChannel(sender.address, recipient.address, ethers.constants.AddressZero);
			let tokenChannel = await hub.getPaymentChannel(sender.address, recipient.address, testToken.address);
			expect(channel.open).to.be.equal(false);
			expect(tokenChannel.open).to.be.equal(false);
		});

		it("Should fail if sender claims timeout before expiration", async function() {
			await expect(hub.claimTimeout(recipient.address, ethers.constants.AddressZero)).to.be.reverted;
			await expect(hub.claimTimeout(recipient.address, testToken.address)).to.be.reverted;
		});

		it("Should fail if recipient tries to claim timeout", async function() {
			await expect(hub.connect(recipient).claimTimeout(recipient.address, ethers.constants.AddressZero)).to.be.reverted;
			await expect(hub.connect(recipient).claimTimeout(recipient.address, testToken.address)).to.be.reverted;
		});

	});


	describe("close", function () {

		let hub;

		beforeEach(async function() {
			const Hub = await ethers.getContractFactory("UnidirectionalPaymentChannelHub");
		    hub = await Hub.deploy();
		    await hub.deployed();

		    await testToken.approve(hub.address, 10000000);

			let overrides = { value: ethers.utils.parseEther("1.0") };
			await hub.open(recipient.address, 1000, ethers.constants.AddressZero, 0, overrides);
			await hub.open(recipient.address, 1000, testToken.address, 100000);
		});

		// TODO Check if close transfers funds back
		it("Should allow recipient to close with amount less than or equal to amount", async function() {

			let etherChannelId = await hub.getUsersToId(sender.address, recipient.address, ethers.constants.AddressZero);
			let etherSignature = await signPayment(sender, hub.address, etherChannelId, 100000);

			let tokenChannelId = await hub.getUsersToId(sender.address, recipient.address, testToken.address);
			let tokenSignature = await signPayment(sender, hub.address, tokenChannelId, 100000);

			await expect(await hub.connect(recipient).close(sender.address, recipient.address, ethers.constants.AddressZero, 100000, etherSignature));
//				.to.changeEtherBalance(sender, ethers.utils.parseEther("1.0"));
//			ethers.provider.send("evm_mine", []);
			await expect(await hub.connect(recipient).close(sender.address, recipient.address, testToken.address, 100000, tokenSignature));
//				.to.changeTokenBalance(testToken, sender, 100000);

			let channel = await hub.getPaymentChannel(sender.address, recipient.address, ethers.constants.AddressZero);
			let tokenChannel = await hub.getPaymentChannel(sender.address, recipient.address, testToken.address);
			expect(channel.open).to.be.equal(false);
			expect(tokenChannel.open).to.be.equal(false);
		});

		it("Should fail if recipient tries to close with amount that is higher than allowed", async function() {

			let etherChannelId = await hub.getUsersToId(sender.address, recipient.address, ethers.constants.AddressZero);
			let etherSignature = await signPayment(sender, hub.address, etherChannelId, ethers.utils.parseEther("10.0"));

			let tokenChannelId = await hub.getUsersToId(sender.address, recipient.address, testToken.address);
			let tokenSignature = await signPayment(sender, hub.address, tokenChannelId, 10000000);

			await expect(hub.connect(recipient).close(sender.address, recipient.address, ethers.constants.AddressZero, ethers.utils.parseEther("10.0"), etherSignature)).to.be.reverted;
			await expect(hub.connect(recipient).close(sender.address, recipient.address, testToken.address, 10000000, tokenSignature)).to.be.reverted;

		});

		it("Should fail if sender tries to close", async function() {

			let etherChannelId = await hub.getUsersToId(sender.address, recipient.address, ethers.constants.AddressZero);
			let etherSignature = await signPayment(sender, hub.address, etherChannelId, 100000);

			let tokenChannelId = await hub.getUsersToId(sender.address, recipient.address, testToken.address);
			let tokenSignature = await signPayment(sender, hub.address, tokenChannelId, 100000);

			await expect(hub.close(sender.address, recipient.address, ethers.constants.AddressZero, 100000, etherSignature)).to.be.reverted;
			await expect(hub.close(sender.address, recipient.address, testToken.address, 100000, tokenSignature)).to.be.reverted;
		});

	});

});

