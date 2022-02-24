import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { TestHypeHaus } from '../typechain-types/TestHypeHaus';

const MAX_SUPPLY = 10;

describe('HypeHaus contract', () => {
  let hypeHaus: TestHypeHaus;
  let addresses: Record<'client' | 'deployer' | 'owner', SignerWithAddress>;

  beforeEach(async () => {
    const [deployer, owner, client] = await ethers.getSigners();
    addresses = { deployer, owner, client };

    const factory = await ethers.getContractFactory('TestHypeHaus', deployer);

    hypeHaus = (await factory.deploy()) as TestHypeHaus;
    await hypeHaus.deployed();
  });

  describe('Initialization', () => {
    it('reports the correct maximum supply', async () => {
      expect(await hypeHaus.maxSupply()).to.eq(MAX_SUPPLY);
    });
  });

  describe('Awarding', () => {
    it('successfully mints HYPEhaus tokens when supply available', async () => {
      expect(await hypeHaus.totalSupply()).to.eq(0);

      await expect(hypeHaus.awardToken(addresses.owner.address))
        .to.emit(hypeHaus, 'AwardToken')
        .withArgs(0, addresses.owner.address);

      expect(await hypeHaus.totalSupply()).to.eq(1);

      await expect(hypeHaus.awardToken(addresses.owner.address))
        .to.emit(hypeHaus, 'AwardToken')
        .withArgs(1, addresses.owner.address);

      expect(await hypeHaus.totalSupply()).to.eq(2);
    });

    it('fails to mint HYPEhaus tokens when supply exhausted', async () => {
      await Promise.all(
        [...Array(MAX_SUPPLY).keys()].map(async (_, index) => {
          await hypeHaus.awardToken(
            index % 2 == 0 ? addresses.owner.address : addresses.client.address,
          );
        }),
      );

      await expect(
        hypeHaus.awardToken(addresses.owner.address),
      ).to.be.revertedWith('Supply exhausted');
    });
  });
});
