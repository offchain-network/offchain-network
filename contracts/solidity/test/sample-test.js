const { expect } = require("chai");
const { waffle } = require("hardhat");
const { deployContract } = waffle;
const provider = waffle.provider;



describe("UnidirectionalPaymentChannelHub", function() {

	  let SimpleToken;
	  let testToken;
	  let owner;
	  let sender;
	  let recipient;
	  let stranger;

	// `beforeEach` will run before each test, re-deploying the contract every
	// time. It receives a callback, which can be async.
	beforeEach(async function () {
	    SimpleToken = await ethers.getContractFactory("SimpleToken");
	    testToken = await SimpleToken.deploy("TestToken", "TEST", 1000000);
	    await testToken.deployed();

	    [owner, sender, recipient, stranger] = await ethers.getSigners();

	});

	describe("Payment Channel Opening", function () {

		let hub;

		before(async function() {
			const Hub = await ethers.getContractFactory("UnidirectionalPaymentChannelHub");
		    hub = await Hub.deploy();
		    await hub.deployed();
		});

		it("Should open an ETH payment channel correctly", async function() {

			let overrides = {
			    // To convert Ether to Wei:
			    value: ethers.utils.parseEther("1.0")     // ether in this case MUST be a string

			    // Or you can use Wei directly if you have that:
			    // value: someBigNumber
			    // value: 1234   // Note that using JavaScript numbers requires they are less than Number.MAX_SAFE_INTEGER
			    // value: "1234567890"
			    // value: "0x1234"

			    // Or, promises are also supported:
			    // value: provider.getBalance(addr)
			};

			const hubFromSender = hub.connect(sender.address);
			await hubFromSender.open(recipient.address, 10000, ethers.constants.AddressZero, 0, overrides);
			//expect(await hub.getPaymentChannel(senderAddr, recipientAddr, 0x0)).to.equal()

		    //expect(await greeter.greet()).to.equal("Hola, mundo!");
		});

	})



});

