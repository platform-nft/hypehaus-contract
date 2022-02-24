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
    hausCoin = (await factory.deploy(50)) as HausCoin;
    await hausCoin.deployed();
  });

  describe('Initialization', () => {
    it('it reports the expected total supply', async () => {
      expect(await hausCoin.totalSupply()).to.eq(50);
    });
  });
});
