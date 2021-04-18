import { expect } from "chai";
import { waffle, ethers } from "hardhat";
import { Signer } from "ethers";


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

	describe("opening", function () {

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

	describe("extending", function () {

		let hub;

		beforeEach(async function() {
			const Hub = await ethers.getContractFactory("UnidirectionalPaymentChannelHub");
		    hub = await Hub.deploy();
		    await hub.deployed();

			let overrides = { value: ethers.utils.parseEther("1.0") };
			await hub.open(recipient.address, 10000, ethers.constants.AddressZero, 0, overrides);
		});

		it("Should extend if newExpiration is after expiration", async function() {
			await hub.extend(recipient.address, ethers.constants.AddressZero, Math.round(Date.now()/1000)+100000);

			let channel = await hub.getPaymentChannel(sender.address, recipient.address, ethers.constants.AddressZero);
			expect(channel.expiration).to.be.gt(Math.round(Date.now()/1000)+90000);
		});

		it("Should fail if newExpiration is before expiration", async function() {
			await expect(hub.extend(recipient.address, ethers.constants.AddressZero, Math.round(Date.now()/1000)+1000)).to.be.reverted;
		});


	});

});

