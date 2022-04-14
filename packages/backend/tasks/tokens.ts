import { task, types } from 'hardhat/config';

import * as utils from './utils';

const HH_GET_TOKEN_URI = 'hypehaus:token-uri';
const HH_TOGGLE_REVEAL = 'hypehaus:toggle-reveal';

type GetTokenURIActionType = utils.OptionalContractActionType & {
  tokenId: number;
};

task(HH_GET_TOKEN_URI, 'Gets the token URI for a specific token')
  .addOptionalParam<string>(
    'contract',
    'The address of the HYPEHAUS contract to connect to',
    undefined,
    types.string,
  )
  .addPositionalParam<string>(
    'tokenId',
    'The ID of the token',
    undefined,
    types.int,
  )
  .setAction(async ({ contract, tokenId }: GetTokenURIActionType, hre) => {
    const hypeHaus = await utils.connectToContract(hre, contract);
    const tokenURI = await hypeHaus.tokenURI(tokenId);
    console.log('Token URI:', tokenURI);
  });

task(HH_TOGGLE_REVEAL, 'Toggle reveal of tokens')
  .addOptionalParam<string>(
    'contract',
    'The address of the HYPEHAUS contract to connect to',
    undefined,
    types.string,
  )
  .setAction(async ({ contract }: utils.OptionalContractActionType, hre) => {
    const hypeHaus = await utils.connectToContract(hre, contract);
    await hypeHaus.toggleReveal();
    console.log('Successfully toggled reveal');
  });
