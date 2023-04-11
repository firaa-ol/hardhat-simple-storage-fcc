const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("SimpleStorage", () => {
    let simpleStorageFactory, simpleStorage;

    beforeEach(async () => {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        simpleStorage = await simpleStorageFactory.deploy();
    });

    it("Should start with a favority number of 0", async () => {
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = "0";

        assert.equal(currentValue.toString(), expectedValue);
    });

    it("Should update when we call store", async () => {
        const expectedValue = "9";
        const transactionResponse = await simpleStorage.store(expectedValue);
        await transactionResponse.wait(1);

        const currentValue = await simpleStorage.retrieve();
        assert.equal(currentValue.toString(), expectedValue);
    });

    it("Should add a person name and favorite number when we call addPerson", async () => {
        const name = "John";
        const expectedValue = "111";
        const transactionResponse = await simpleStorage.addPerson(
            name,
            expectedValue
        );
        await transactionResponse.wait(1);

        const mappedValue = await simpleStorage.nameToFavoriteNumber(name);
        assert.equal(mappedValue, expectedValue);
    });
});
