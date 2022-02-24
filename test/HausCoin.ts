import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { HausCoin } from '../typechain-types/HausCoin';

describe('HausCoin contract', () => {
  let hausCoin: HausCoin;
  let deployer: SignerWithAddress;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    deployer = signers[0];

    const factory = await ethers.getContractFactory('HausCoin', deployer);
    hausCoin = (await factory.deploy()) as HausCoin;
    await hausCoin.deployed();
  });

  describe('Initialization', () => {
    it('reports the expected initial total supply', async () => {
      expect(await hausCoin.totalSupply()).to.eq(
        ethers.BigNumber.from(1e6).mul(ethers.BigNumber.from(10).pow(18)),
      );
    });
  });
});
