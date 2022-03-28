import { task, types } from 'hardhat/config';

import * as utils from './utils';

const HH_TOTAL_MINTED = 'hypehaus:total-minted';
const HH_MINT_PUBLIC = 'hypehaus:mint-public';

task(HH_TOTAL_MINTED, 'Reports the total amount of HYPEhaus tokens minted')
  .addOptionalParam(
    'contract',
    'The address of the contract to connect to',
    undefined,
    types.string,
  )
  .setAction(async ({ contract }: utils.OptionalContractActionType, hre) => {
    const hypeHaus = await utils.connectToContract(hre, contract);
    await utils.logTotalMinted(hypeHaus);
  });

task(HH_MINT_PUBLIC, 'Mints a HYPEhaus token in a public sale as the owner')
  .addOptionalParam(
    'contract',
    'The address of the contract to connect to',
    undefined,
    types.string,
  )
  .setAction(async ({ contract }: utils.OptionalContractActionType, hre) => {
    const hypeHaus = await utils.connectToContract(hre, contract);
    await hypeHaus.setActiveSale(2); // ActiveSale.Public = 2
    await utils.logTotalMinted(hypeHaus);

    const overrides = { value: hre.ethers.utils.parseEther('0.08') };
    await hypeHaus.mintPublicSale(1, overrides);

    await utils.logTotalMinted(hypeHaus);
  });
