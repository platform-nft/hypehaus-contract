import { task, types } from 'hardhat/config';

import * as utils from './utils';

const HH_BURN_TOKEN = 'hypehaus:burn';
const HH_GET_TOKEN_URI = 'hypehaus:get-token-uri';
const HH_SET_TOKEN_URI = 'hypehaus:set-token-uri';

type BurnTokenActionType = utils.OptionalContractActionType & {
  tokenId: number;
};

task(HH_BURN_TOKEN, 'Burns the given token')
  .addOptionalParam<string>(
    'contract',
    'The address of the HYPEHAUS contract to connect to',
    undefined,
    types.string,
  )
  .addPositionalParam<number>(
    'tokenId',
    'The ID of the token to burn',
    undefined,
    types.int,
  )
  .setAction(async ({ contract, tokenId }: BurnTokenActionType, hre) => {
    const hypeHaus = await utils.connectToContract(hre, contract);
    await hypeHaus.burn(tokenId);
    console.log(`Successfully burnt token with ID '${tokenId}'`);
  });

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
  .addPositionalParam<number>(
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

type SetTokenURIActionType = utils.OptionalContractActionType & {
  baseTokenURI: string;
  hasExtension?: boolean;
};

task(HH_SET_TOKEN_URI, 'Sets the base token URI for all tokens')
  .addOptionalParam<string>(
    'contract',
    'The address of the HYPEHAUS contract to connect to',
    undefined,
    types.string,
  )
  .addPositionalParam<string>(
    'baseTokenURI',
    'The new base token URI',
    undefined,
    types.string,
  )
  .addOptionalParam<string>(
    'hasExtension',
    'Does the base token URI require a .json extension?',
    undefined,
    types.boolean,
  )
  .setAction(
    async (
      { contract, baseTokenURI, hasExtension = false }: SetTokenURIActionType,
      hre,
    ) => {
      const hypeHaus = await utils.connectToContract(hre, contract);
      await hypeHaus.setBaseTokenURI(baseTokenURI, hasExtension);
      console.log('Successfully changed base token URI');
    },
  );
