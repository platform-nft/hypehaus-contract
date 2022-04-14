import { ethers, network } from 'hardhat';

const { MASKED_BASE_TOKEN_URI, REVEALED_BASE_TOKEN_URI, TEAM_WALLET_ADDRESS } =
  process.env;

async function main() {
  console.log('Masked base token URI:', MASKED_BASE_TOKEN_URI);
  console.log('Revealed base token URI:', REVEALED_BASE_TOKEN_URI);

  if (!MASKED_BASE_TOKEN_URI || !REVEALED_BASE_TOKEN_URI) {
    throw new Error(
      'MASKED_BASE_TOKEN_URI or REVEALED_BASE_TOKEN_URI has not been set in ' +
        'an .env file. Please set them both before deploying the contract.',
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
  const hypeHaus = await HypeHaus.deploy(
    555,
    MASKED_BASE_TOKEN_URI,
    teamWalletAddress,
  );
  await hypeHaus.deployed();

  console.log('HyperHaus contract deployed to:', hypeHaus.address);
  console.log('Resulting balance:', (await deployer.getBalance()).toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
