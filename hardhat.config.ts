import * as dotenv from 'dotenv';
dotenv.config();

import { task, HardhatUserConfig } from 'hardhat/config';

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

import './tasks/minting';
import './tasks/withdrawing';

const { ALCHEMY_API_KEY = '', PRIVATE_KEY = '' } = process.env;

task('accounts', 'Prints a list of all accounts', async (_, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

task(
  'balances',
  'Prints a list of balances for all accounts',
  async (_, hre) => {
    hre.ethers
      .getSigners()
      .then((signers) => signers.map((signer) => signer.getBalance()));

    const accounts = await hre.ethers.getSigners();
    const balances = await Promise.all(
      accounts.map(
        async (acc) => [acc.address, await acc.getBalance()] as const,
      ),
    );

    for (const [address, balance] of balances) {
      console.log(address, '->', balance.toString());
    }
  },
);

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY,
  // },
};

export default config;
