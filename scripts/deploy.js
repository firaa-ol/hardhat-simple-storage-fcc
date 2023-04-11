const { ethers, run, network } = require("hardhat");

async function main() {
    const simpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    );
    console.log("Deploying contract...");
    const simpleStorage = await simpleStorageFactory.deploy();
    await simpleStorage.deployed();
    console.log(`Deployed contract to: ${simpleStorage.address}`);

    //console.log(network.config);
    if (
        (network.config.chainId === 5 || network.config.chainId === 11155111) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log("Waiting for Transactions..");
        // wait for few blocks to be mined until etherscan indexes the new data
        await simpleStorage.deployTransaction.wait(6);
        await verify(simpleStorage.address, []);
    }

    const currentValue = await simpleStorage.retrieve();
    console.log(`Current value is : ${currentValue}`);

    const transactionResponse = await simpleStorage.store(13);
    await transactionResponse.wait(1);
    const updatedValue = await simpleStorage.retrieve();
    console.log(`Updated value is : ${updatedValue}`);
}

async function verify(contractAddress, args) {
    console.log("Verifiying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified");
        } else {
            console.log(e);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
