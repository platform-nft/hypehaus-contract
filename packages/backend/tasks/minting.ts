import { task, types } from 'hardhat/config';

import * as utils from './utils';

const HH_TOTAL_MINTED = 'hypehaus:total-minted';
const HH_MINT_ADMIN = 'hypehaus:mint-admin';
const HH_MINT_PUBLIC = 'hypehaus:mint-public';

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
  .addOptionalParam<string>(
    'contract',
    'The address of the HYPEHAUS contract',
    undefined,
    types.string,
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
    'The address of the HYPEHAUS contract',
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
