import { hexStripZeros } from "ethers/lib/utils";
import { ethers, waffle } from "hardhat";

async function getBalance(address: string): Promise<string> {
  const balanceBigInt = await waffle.provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses: string[]) {
  for (let i = 0; i < addresses.length; ++i) {
    console.log(`Address ${i + 1} balance: `, await getBalance(addresses[i]));
  }
}

async function printMemos(memos: any[]) {
  for (const memo of memos) {
    const { timestamp, name, from, amount, message } = memo;
    console.log(
      `At ${timestamp}, tipper ${name}(${from}) tipped ${ethers.utils.formatEther(
        amount
      )} and left message: ${message}`
    );
  }
}

async function main() {
  const [owner, tipper, tipper2, tipper3] = await ethers.getSigners();

  const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
  const contractInstance = await BuyMeACoffee.deploy();
  await contractInstance.deployed();
  console.log("BuyMeACoffee deployed at ", contractInstance.address);

  const addresses = [
    owner.address,
    tipper.address,
    tipper2.address,
    tipper3.address,
    contractInstance.address,
  ];
  console.log("============= start =============");
  await printBalances(addresses);

  const tip = { value: ethers.utils.parseEther("1") };
  await contractInstance
    .connect(tipper)
    .buyCoffee("Subzero", "Ice Ice Baby!", tip);
  await contractInstance
    .connect(tipper2)
    .buyCoffee("Scorpion", "Get over here", tip);
  await contractInstance
    .connect(tipper3)
    .buyCoffee("Raiden", "Lightning!", tip);

  console.log("============= tipped =============");
  await printBalances(addresses);

  await contractInstance.connect(owner).withdrawTips();
  console.log("============= withdrawTips =============");
  await printBalances(addresses);

  console.log("============= memos =============");
  const memos = await contractInstance.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
