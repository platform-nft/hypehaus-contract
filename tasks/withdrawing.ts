import { task, types } from 'hardhat/config';

import * as utils from './utils';

const { TEAM_WALLET_ADDRESS } = process.env;

const HH_WITHDRAW = 'hypehaus:withdraw';

task(HH_WITHDRAW, 'Withdraws pending balance into team wallet')
  .addOptionalParam(
    'contract',
    'The address of the contract to connect to',
    undefined,
    types.string,
  )
  .setAction(async ({ contract }: utils.OptionalContractActionType, hre) => {
    const [_, teamAlternative] = await hre.ethers.getSigners();
    const teamWalletAddress = TEAM_WALLET_ADDRESS || teamAlternative.address;
    console.log('Team wallet address:', teamWalletAddress);

    const hypeHaus = await utils.connectToContract(hre, contract);

    console.log('Withdrawing pending amount...');
    await hypeHaus.withdraw();

    const newBalance = (await teamAlternative.getBalance()).toString();
    console.log('Successfully withdrew amount. New balance:', newBalance);
  });
