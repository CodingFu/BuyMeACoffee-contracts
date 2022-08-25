const { ethers, hardhat } = require("hardhat");

async function main() {
  const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
  const contractInstance = await BuyMeACoffee.deploy();
  await contractInstance.deployed();
  console.log("BuyMeACoffee deployed at ", contractInstance.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
