import { task, types } from 'hardhat/config';

import * as utils from './utils';
import { stringToHypeHausSale } from '../shared';

const HH_SET_ACTIVE_SALE = 'hypehaus:set-sale';
const HH_TOTAL_MINTED = 'hypehaus:total-minted';
const HH_MINT_ADMIN = 'hypehaus:mint-admin';
const HH_MINT_PUBLIC = 'hypehaus:mint-public';

type SetActiveSaleActionType = utils.OptionalContractActionType & {
  sale: string;
};

task(HH_SET_ACTIVE_SALE, 'Sets the current active sale')
  .addOptionalParam<string>(
    'contract',
    'The address of the HYPEHAUS contract to connect to',
    undefined,
    types.string,
  )
  .addPositionalParam<string>(
    'sale',
    'The name of the sale (either "closed", "community" or "public")',
    undefined,
    types.string,
  )
  .setAction(async ({ contract, sale }: SetActiveSaleActionType, hre) => {
    const hypeHaus = await utils.connectToContract(hre, contract);
    const newActiveSale = stringToHypeHausSale(sale);
    console.log('Setting active sale to:', newActiveSale);
    await hypeHaus.setActiveSale(newActiveSale);
  });

task(HH_TOTAL_MINTED, 'Reports total amount of HYPEHAUSes minted')
  .addOptionalParam<string>(
    'contract',
    'The address of the HYPEHAUS contract',
    undefined,
    types.string,
  )
  .setAction(async ({ contract }: utils.OptionalContractActionType, hre) => {
    const hypeHaus = await utils.connectToContract(hre, contract);
    await utils.logTotalMinted(hypeHaus);
  });

type MintAdminActionType = utils.OptionalContractActionType & {
  receiver: string;
  amount: number;
};

task(HH_MINT_ADMIN, 'Mints some number of HYPEHAUSes to the receiver as admin')
  .addOptionalParam<string>(
    'contract',
    'The address of the HYPEHAUS contract to connect to',
    undefined,
    types.string,
  )
  .addPositionalParam<string>(
    'receiver',
    'The address of the recipient to mint to',
    undefined,
    types.string,
  )
  .addPositionalParam<number>(
    'amount',
    'The amount of HYPEHAUSes to mint to the receiver',
    undefined,
    types.int,
  )
  .setAction(
    async ({ receiver, amount, contract }: MintAdminActionType, hre) => {
      const hypeHaus = await utils.connectToContract(hre, contract);
      await utils.logTotalMinted(hypeHaus);
      await hypeHaus.mintAdmin(receiver, amount);
      await utils.logTotalMinted(hypeHaus);
    },
  );

type MintPublicActionType = utils.OptionalContractActionType & {
  amount?: number;
};

task(HH_MINT_PUBLIC, 'Mints HYPEHAUSes in public sale as contract owner')
  .addOptionalParam<string>(
    'contract',
    'The address of the HYPEHAUS contract to connect to',
    undefined,
    types.string,
  )
  .addOptionalParam<number>(
    'amount',
    'The amount of HYPEHAUSes to mint',
    undefined,
    types.int,
  )
  .setAction(async ({ contract, amount = 1 }: MintPublicActionType, hre) => {
    const hypeHaus = await utils.connectToContract(hre, contract);
    await hypeHaus.setActiveSale(2); // ActiveSale.Public = 2
    await utils.logTotalMinted(hypeHaus);

    const publicMintPrice = hre.ethers.utils.parseEther('0.08');
    const overrides = { value: publicMintPrice.mul(amount) };
    await hypeHaus.mintPublic(amount, overrides);

    await utils.logTotalMinted(hypeHaus);
  });
