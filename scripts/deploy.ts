import { ethers, network } from 'hardhat';

const { METADATA_CID } = process.env;

async function main() {
  if (!METADATA_CID) {
    throw new Error(
      'METADATA_CID has not been set. Please set it in an .env file before ' +
        'deploying the contract.',
    );
  }

  const networkName = network.name;
  console.log('On network:', networkName);

  const [deployer] = await ethers.getSigners();
  console.log('Deploying contract with account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  const HypeHaus = await ethers.getContractFactory('HypeHaus');
  const hypeHaus = await HypeHaus.deploy(555, `ipfs://${METADATA_CID}/`);
  await hypeHaus.deployed();

  console.log('HyperHaus contract deployed to:', hypeHaus.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
