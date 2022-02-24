import { ethers } from 'hardhat';

async function main() {
  const HypeHaus = await ethers.getContractFactory('HypeHaus');
  const hypeHaus = await HypeHaus.deploy();
  await hypeHaus.deployed();
  console.log('HyperHaus deployed to:', hypeHaus.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
