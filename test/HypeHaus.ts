import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { HypeHaus } from '../typechain-types/HypeHaus';

const MAX_SUPPLY = 10;
const BASE_URI = 'test://abc123/';
const PRICE = '0.05';

describe('HypeHaus contract', () => {
  let hypeHaus: HypeHaus;
  let signers: Record<'deployer' | 'client1' | 'client2', SignerWithAddress>;
  const addresses = { deployer: '', client1: '', client2: '' };

  beforeEach(async () => {
    const [deployer, client1, client2] = await ethers.getSigners();
    signers = { deployer, client1, client2 };
    addresses.deployer = deployer.address;
    addresses.client1 = client1.address;
    addresses.client2 = client2.address;

    const factory = await ethers.getContractFactory('HypeHaus', deployer);

    hypeHaus = (await factory.deploy(MAX_SUPPLY, BASE_URI)) as HypeHaus;
    await hypeHaus.deployed();
  });

  describe('Initialization', () => {
    it('reports the correct maximum supply', async () => {
      expect(await hypeHaus.maxSupply()).to.eq(MAX_SUPPLY);
    });

    it('reports the correct total of minted HYPEhaus tokens', async () => {
      expect(await hypeHaus.totalMinted()).to.eq(0);
    });
  });

  describe('Minting', () => {
    describe('To specific address', () => {
      it('mints HYPEhaus tokens when there is sufficient supply', async () => {
        // For loop instead of Promise.all to avoid race conditions
        for (let i = 0; i < MAX_SUPPLY; i++) {
          const address = i % 2 === 0 ? addresses.client1 : addresses.client2;
          expect(await hypeHaus.totalMinted()).to.eq(i);

          await expect(hypeHaus.mintHypeHausToAddress(address))
            .to.emit(hypeHaus, 'MintHypeHaus')
            .withArgs(i, address);

          expect(await hypeHaus.totalMinted()).to.eq(i + 1);
        }

        await expect(
          hypeHaus.mintHypeHausToAddress(addresses.client1),
        ).to.be.revertedWith('HypeHaus: Supply exhausted');
      });
    });

    describe('Via public function', async () => {
      it('mints HYPEhaus tokens when there is sufficient supply', async () => {
        const overrides = { value: ethers.utils.parseEther(PRICE) };

        // For loop instead of Promise.all to avoid race conditions
        for (let i = 0; i < MAX_SUPPLY; i++) {
          const signer = i % 2 === 0 ? signers.client1 : signers.client2;
          expect(await hypeHaus.totalMinted()).to.eq(i);

          await expect(hypeHaus.connect(signer).mintHypeHaus(overrides))
            .to.emit(hypeHaus, 'MintHypeHaus')
            .withArgs(i, signer.address);

          expect(await hypeHaus.totalMinted()).to.eq(i + 1);
        }

        await expect(
          hypeHaus.connect(signers.deployer).mintHypeHaus(overrides),
        ).to.be.revertedWith('HypeHaus: Supply exhausted');
      });

      it('fails to mint HYPEhaus tokens with insufficient funds', async () => {
        await expect(
          hypeHaus.connect(signers.client1).mintHypeHaus(),
        ).to.be.revertedWith('HypeHaus: Not enough ETH');
      });
    });
  });

  describe('Token URI and Owner', () => {
    it('reports the correct URI and owner of a given minted token', async () => {
      await hypeHaus.mintHypeHausToAddress(addresses.client1);
      await hypeHaus.mintHypeHausToAddress(addresses.client2);
      expect(await hypeHaus.tokenURI(1)).to.eq(`${BASE_URI}1.json`);
      expect(await hypeHaus.tokenURI(0)).to.eq(`${BASE_URI}0.json`);
      expect(await hypeHaus.ownerOf(0)).to.eq(addresses.client1);
      expect(await hypeHaus.ownerOf(1)).to.eq(addresses.client2);

      const overrides = { value: ethers.utils.parseEther(PRICE) };
      await hypeHaus.connect(signers.client1).mintHypeHaus(overrides);
      await hypeHaus.connect(signers.client2).mintHypeHaus(overrides);
      expect(await hypeHaus.tokenURI(2)).to.eq(`${BASE_URI}2.json`);
      expect(await hypeHaus.tokenURI(3)).to.eq(`${BASE_URI}3.json`);
      expect(await hypeHaus.ownerOf(2)).to.eq(addresses.client1);
      expect(await hypeHaus.ownerOf(3)).to.eq(addresses.client2);

      // We don't care about the error messages so we leave it blank here
      await expect(hypeHaus.tokenURI(4)).to.be.revertedWith('');
      await expect(hypeHaus.tokenURI(MAX_SUPPLY)).to.be.revertedWith('');
    });
  });
});
