import { task } from 'hardhat/config';
import * as utils from './utils';

const HH_TRANSFER = 'hypehaus:transfer';
const DEPLOYER = '0xBb868Cd266CC19FF65307E6B2ccE961230E165a3';

const RESERVED_TOKENS: number[] = [
  74, 77, 78, 261, 262, 275, 276, 277, 284, 287, 289, 295, 300, 303, 309, 318,
  319, 323, 324, 348, 470, 472, 475, 476, 480, 483, 484, 486, 488, 493, 500,
  503, 506, 511, 513, 514, 516, 528, 530, 538, 548, 550,
];

const addresses: string[] = [
  // Empty...
];

type TransferActionType = utils.OptionalContractActionType & {};

const CURR_TOKEN = 286;
const CURR_NONCE = 250;

task(HH_TRANSFER).setAction(async ({ contract }: TransferActionType, hre) => {
  let token = CURR_TOKEN;
  const H = await utils.connectToContract(hre, contract);

  for (const [i, address] of addresses.entries()) {
    const nonce = CURR_NONCE + i;
    console.log(address, '=>', `#${token}`, `(${nonce})`);

    while (RESERVED_TOKENS.includes(token)) {
      console.warn(`  🚧 Reserved token #${token} found. Skipping...`);
      token++;
    }

    await H.transferFrom(DEPLOYER, address, token, { nonce });
    console.log('  ✅ Transferred', `#${token}`, `(${nonce})`);
    token++;
  }
});
