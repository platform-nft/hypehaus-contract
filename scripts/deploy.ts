import { ethers } from 'hardhat';

const { METADATA_CID } = process.env;

async function main() {
  if (!METADATA_CID) {
    throw new Error(
      'Metadata CID is not set. Please set one in an .env file before ' +
        'deploying the contract.',
    );
  }

  const [deployer] = await ethers.getSigners();
  console.log('Deploying contract with account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  const HypeHaus = await ethers.getContractFactory('HypeHaus');
  const hypeHaus = await HypeHaus.deploy(555, `ipfs://${METADATA_CID}/`);
  await hypeHaus.deployed();

  console.log('HyperHaus deployed to:', hypeHaus.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
