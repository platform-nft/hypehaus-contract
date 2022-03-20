import { task, types } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { HypeHaus } from '../typechain-types/HypeHaus';

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

const { CONTRACT_ADDRESS = '', LOCAL_CONTRACT_ADDRESS = '' } = process.env;

const connectToContract = async (
  hre: HardhatRuntimeEnvironment,
  contract: string | undefined,
) => {
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
};

const logTotalMinted = async (contract: HypeHaus) => {
  const totalMinted = await contract.totalSupply();
  console.log('Total minted so far:', totalMinted.toString());
};

const HH_TOTAL_MINTED = 'hypehaus:total-minted';
task(HH_TOTAL_MINTED, 'Reports the total amount of HYPEhaus tokens minted')
  .addOptionalParam(
    'contract',
    'The address of the contract to connect to',
    undefined,
    types.string,
  )
  .setAction(async ({ contract }: { contract?: string }, hre) => {
    const hypeHaus = await connectToContract(hre, contract);
    await logTotalMinted(hypeHaus);
  });

const HH_MINT = 'hypehaus:mint';
task(HH_MINT, 'Mints a HYPEhaus token on behalf of the contract owner')
  .addOptionalParam(
    'contract',
    'The address of the contract to connect to',
    undefined,
    types.string,
  )
  .setAction(async (params: { contract?: string }, hre) => {
    const hypeHaus = await connectToContract(hre, params.contract);
    await logTotalMinted(hypeHaus);
    await hypeHaus.mintPublicSale({
      value: hre.ethers.utils.parseEther('0.05'),
    });
    await logTotalMinted(hypeHaus);
  });

/*
const HH_MINT_TO_ADDRESS = 'hypehaus:mint-to';
task(HH_MINT_TO_ADDRESS, 'Mints a HYPEhaus token to the given address')
  .addPositionalParam(
    'receiver',
    'The address of the receiver who will get the token',
    undefined,
    types.string,
  )
  .addOptionalParam(
    'contract',
    'The address of the contract to connect to',
    undefined,
    types.string,
  )
  .setAction(async (params: { receiver: string; contract?: string }, hre) => {
    const hypeHaus = await connectToContract(hre, params.contract);
    // First log the current minted amount
    await logTotalMinted(hypeHaus);
    // Next, mint the next available token to the receiver
    await hypeHaus.mintHypeHausToAddress(params.receiver);
    // Finally, log the total minted (note: this may report the previous total
    // minted value if the contract was not updated in time)
    await logTotalMinted(hypeHaus);
  });
*/
