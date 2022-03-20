import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { HypeHausAlt } from '../typechain-types/HypeHausAlt';

const MAX_SUPPLY = 10;
const BASE_URI = 'test://abc123/';
const COMMUNITY_PRICE = '0.05';
const PUBLIC_PRICE = '0.08';

enum ActiveSale {
  None = 0,
  Community = 1,
  Public = 2,
}

describe('HypeHausAlt contract', () => {
  let hypeHaus: HypeHausAlt;
  let signers: Record<'deployer' | 'client1' | 'client2', SignerWithAddress>;
  const addresses = { deployer: '', client1: '', client2: '' };

  beforeEach(async () => {
    const [deployer, client1, client2] = await ethers.getSigners();
    signers = { deployer, client1, client2 };
    addresses.deployer = deployer.address;
    addresses.client1 = client1.address;
    addresses.client2 = client2.address;

    const factory = await ethers.getContractFactory('HypeHausAlt', deployer);

    hypeHaus = (await factory.deploy(MAX_SUPPLY, BASE_URI)) as HypeHausAlt;
    await hypeHaus.deployed();
  });

  describe('Initialization', () => {
    it('reports the correct total of minted HYPEhaus tokens', async () => {
      expect(await hypeHaus.totalSupply()).to.eq(0);
    });
  });

  describe('Minting', () => {
    it('properly sets current active sale', async () => {
      expect(await hypeHaus.getActiveSale()).to.eq(ActiveSale.None);
      await hypeHaus.setActiveSale(ActiveSale.Community);
      expect(await hypeHaus.getActiveSale()).to.eq(ActiveSale.Community);
      await hypeHaus.setActiveSale(ActiveSale.Public);
      expect(await hypeHaus.getActiveSale()).to.eq(ActiveSale.Public);
    });

    it('mints HYPEhaus tokens when there is sufficient supply', async () => {
      await hypeHaus.setActiveSale(ActiveSale.Public);
      const overrides = { value: ethers.utils.parseEther(PUBLIC_PRICE) };

      // For loop instead of Promise.all to avoid race conditions
      for (let i = 0; i < MAX_SUPPLY; i++) {
        const signer = i % 2 === 0 ? signers.client1 : signers.client2;
        expect(await hypeHaus.totalSupply()).to.eq(i);

        await expect(hypeHaus.connect(signer).mintPublicSale(overrides))
          .to.emit(hypeHaus, 'MintHypeHaus')
          .withArgs(i, signer.address);

        expect(await hypeHaus.totalSupply()).to.eq(i + 1);
      }

      await expect(
        hypeHaus.connect(signers.deployer).mintPublicSale(overrides),
      ).to.be.revertedWith('HH_SUPPLY_EXHAUSTED');
    });

    it('fails to mint HYPEhaus tokens with insufficient funds', async () => {
      await hypeHaus.setActiveSale(ActiveSale.Public);
      await expect(
        hypeHaus.connect(signers.client1).mintPublicSale(),
      ).to.be.revertedWith('HH_INSUFFICIENT_FUNDS');
    });
  });

  describe('Token URI and Owner', () => {
    it('reports the correct URI and owner of a given minted token', async () => {
      await hypeHaus.setActiveSale(ActiveSale.Public);
      const overrides = { value: ethers.utils.parseEther(PUBLIC_PRICE) };
      await hypeHaus.connect(signers.client1).mintPublicSale(overrides);
      await hypeHaus.connect(signers.client2).mintPublicSale(overrides);
      expect(await hypeHaus.tokenURI(0)).to.eq(`${BASE_URI}0.json`);
      expect(await hypeHaus.tokenURI(1)).to.eq(`${BASE_URI}1.json`);
      expect(await hypeHaus.ownerOf(0)).to.eq(addresses.client1);
      expect(await hypeHaus.ownerOf(1)).to.eq(addresses.client2);

      // We don't care about the error messages so we leave it blank here
      const errorMsg = 'HH_NONEXISTENT_TOKEN';
      await expect(hypeHaus.tokenURI(2)).to.be.revertedWith(errorMsg);
      await expect(hypeHaus.tokenURI(MAX_SUPPLY)).to.be.revertedWith(errorMsg);
    });
  });

  describe('Active Sale', () => {
    it('fails to mint HYPEhaus tokens when public sale closed', async () => {
      await hypeHaus.setActiveSale(ActiveSale.None);
      const errorMsg = 'HH_PUBLIC_SALE_NOT_OPEN';
      await expect(hypeHaus.mintPublicSale()).to.be.revertedWith(errorMsg);
    });
  });
});
