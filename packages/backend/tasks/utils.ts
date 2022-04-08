import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { HypeHaus } from '../typechain-types/HypeHaus';

const { CONTRACT_ADDRESS = '', LOCAL_CONTRACT_ADDRESS = '' } = process.env;

export interface OptionalContractActionType {
  contract?: string;
}

export async function connectToContract(
  hre: HardhatRuntimeEnvironment,
  contract: string | undefined,
) {
  const networkName = hre.network.name;
  console.log('On network:', networkName);

  if (networkName === 'hardhat') {
    console.warn(
      `WARNING: You are currently running this task on the Hardhat network,`,
      `which won't be able to connect to a local instance of Hardhat (if any`,
      `is running). If this was not intended, re-run this task again with`,
      `"--network localhost".`,
    );
  }

  const contractAddress =
    contract ||
    (networkName === 'localhost' ? LOCAL_CONTRACT_ADDRESS : CONTRACT_ADDRESS);
  console.log('Contract address:', contractAddress);

  const HypeHaus = await hre.ethers.getContractFactory('HypeHaus');
  const hypeHaus = HypeHaus.attach(contractAddress) as HypeHaus;

  return hypeHaus;
}

export async function logTotalMinted(contract: HypeHaus) {
  const totalMinted = await contract.totalSupply();
  console.log('Total minted so far:', totalMinted.toString());
}
