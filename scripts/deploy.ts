import { ethers } from 'hardhat';

async function main() {
  const HypeHausContract = await ethers.getContractFactory('HypeHausContract');
  const hypeHausContract = await HypeHausContract.deploy();
  await hypeHausContract.deployed();
  console.log('HyperHausContract deployed to:', hypeHausContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
