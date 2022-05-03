import { task } from 'hardhat/config';
import * as utils from './utils';

const HH_TRANSFER = 'hypehaus:transfer';
const DEPLOYER = '0xBb868Cd266CC19FF65307E6B2ccE961230E165a3';

const addresses: string[] = [
  // '0x7F41275857C248CA013E44e628b67011F99c4213',
  // '0x7ea7293cE8e14b92a6f89cdD0b531d249520bB87',
  // '0xF8afDd33762263aB41f37d805C1479F4F7d78622',
  // '0xe6fa90026f53250Ea73dB1c5E38C0b6C468B49B8',
  // '0x2E0d1bCC76474fa83F18df0c437e6E4b52538141',
  // '0xFfeC174D6Eadf95635D235B76CBc2b229076F681',
  // '0x3521D755e937c1c54f4F914d83dbFB978018d15D',
  // '0x15Ee5896bae09192BF188B6D3Fa0d62ddB94B3fE',
  // -- ETH.APPLE --
  // '0x93A3869aE9Abf012A3301EDF8ADd89c4c6cc6285',
  // '0xc62eAFF9C1556bd77A108268aAe021b56f93DD10',
  // '0x3375030878a2BC7c6d649e601c3545578D7cFAA2',
  // '0x35c2a7324742042DFFd4E2078Cd1E19456126397',
  // '0x9d5910d042BEEb096127CFaaa938F0744659E50F',
];

type TransferActionType = utils.OptionalContractActionType & {};

task(HH_TRANSFER).setAction(async ({ contract }: TransferActionType, hre) => {
  const H = await utils.connectToContract(hre, contract);
  for (const [i, address] of addresses.entries()) {
    const token = 263 + i;
    const nonce = 229 + i;
    console.log(address, '=>', `#${token}`, `(${nonce})`);
    if (token === 284) throw new Error('Ultra-rare entity #284 found!');
    await H.transferFrom(DEPLOYER, address, token, { nonce });
    console.log('√ Transferred', `#${token}`, `(${nonce})`);
  }
});
