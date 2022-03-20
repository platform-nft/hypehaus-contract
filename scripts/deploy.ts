import { ethers, network } from 'hardhat';

const { METADATA_CID, TEAM_WALLET_ADDRESS } = process.env;

async function main() {
  if (!METADATA_CID) {
    throw new Error(
      'METADATA_CID has not been set in an .env file. Please set it before ' +
        'deploying the contract.',
    );
  }

  const networkName = network.name;
  console.log('On network:', networkName);

  const [deployer, teamAlternative] = await ethers.getSigners();
  const teamWalletAddress = TEAM_WALLET_ADDRESS || teamAlternative.address;
  console.log('Team wallet address:', teamWalletAddress);

  console.log('Deploying contract with account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  const HypeHaus = await ethers.getContractFactory('HypeHaus');
  const baseURI = `ipfs://${METADATA_CID}/`;
  const hypeHaus = await HypeHaus.deploy(555, baseURI, teamWalletAddress);
  await hypeHaus.deployed();

  console.log('HyperHaus contract deployed to:', hypeHaus.address);
  console.log('Resulting balance:', (await deployer.getBalance()).toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
