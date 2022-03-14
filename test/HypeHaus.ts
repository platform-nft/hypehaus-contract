import { expect } from 'chai';
import { ethers } from 'hardhat';

import { HypeHaus } from '../typechain-types/HypeHaus';

const MAX_SUPPLY = 10;
const BASE_URL = 'test://abc123/';

describe('HypeHaus contract', () => {
  let hypeHaus: HypeHaus;
  let addresses: Record<'client' | 'deployer' | 'owner', string>;

  beforeEach(async () => {
    const [deployer, owner, client] = await ethers.getSigners();
    addresses = {
      deployer: deployer.address,
      owner: owner.address,
      client: client.address,
    };

    const factory = await ethers.getContractFactory('HypeHaus', deployer);

    hypeHaus = (await factory.deploy(MAX_SUPPLY, BASE_URL)) as HypeHaus;
    await hypeHaus.deployed();
  });

  describe('Initialization', () => {
    it('reports the correct maximum supply', async () => {
      expect(await hypeHaus.maxSupply()).to.eq(MAX_SUPPLY);
    });
  });

  describe('Awarding', () => {
    it('successfully mints HYPEhaus tokens when supply available', async () => {
      expect(await hypeHaus.totalMinted()).to.eq(0);

      await expect(hypeHaus.mintHypeHaus(addresses.owner))
        .to.emit(hypeHaus, 'MintHypeHaus')
        .withArgs(0, addresses.owner);

      expect(await hypeHaus.totalMinted()).to.eq(1);

      await expect(hypeHaus.mintHypeHaus(addresses.owner))
        .to.emit(hypeHaus, 'MintHypeHaus')
        .withArgs(1, addresses.owner);

      expect(await hypeHaus.totalMinted()).to.eq(2);
    });

    it('fails to mint HYPEhaus tokens when supply exhausted', async () => {
      await Promise.all(
        [...Array(MAX_SUPPLY).keys()].map(async (_, index) => {
          await hypeHaus.mintHypeHaus(
            index % 2 == 0 ? addresses.owner : addresses.client,
          );
        }),
      );

      await expect(hypeHaus.mintHypeHaus(addresses.owner)).to.be.revertedWith(
        'HypeHaus: Supply exhausted',
      );
    });
  });

  describe('Token URI', () => {
    it('reports correct token URI for given token ID', async () => {
      await hypeHaus.mintHypeHaus(addresses.owner);
      expect(await hypeHaus.tokenURI(0)).to.eq(`${BASE_URL}0.json`);

      await hypeHaus.mintHypeHaus(addresses.client);
      expect(await hypeHaus.tokenURI(1)).to.eq(`${BASE_URL}1.json`);

      await hypeHaus.mintHypeHaus(addresses.client);
      expect(await hypeHaus.tokenURI(2)).to.eq(`${BASE_URL}2.json`);

      await hypeHaus.mintHypeHaus(addresses.client);
      expect(await hypeHaus.tokenURI(3)).to.eq(`${BASE_URL}3.json`);

      // We don't care about the error messages so we leave it blank here
      await expect(hypeHaus.tokenURI(4)).to.be.revertedWith('');
      await expect(hypeHaus.tokenURI(MAX_SUPPLY)).to.be.revertedWith('');
    });
  });
});
