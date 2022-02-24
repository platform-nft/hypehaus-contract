import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { HypeHausERC1155 } from '../typechain-types/HypeHausERC1155';

const HAUS_COIN_URI = 'ipfs://<haus-coin>/{id}.json';
const HYPE_HAUS_URI = 'ipfs://<hype-haus>/{id}.json';
const DAO_HAUS_URI = 'ipfs://<dao-haus>/{id}.json';

describe('HypeHaus ERC1155 contract', () => {
  let owner: SignerWithAddress;
  let deployer: SignerWithAddress;
  let client: SignerWithAddress;

  let hypeHaus: HypeHausERC1155;
  let HAUS_COIN: BigNumber;
  let HYPE_HAUS: BigNumber;
  let DAO_HAUS: BigNumber;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    deployer = signers[1];
    client = signers[2];

    const factory = await ethers.getContractFactory(
      'HypeHausERC1155',
      deployer,
    );
    hypeHaus = (await factory.deploy()) as HypeHausERC1155;
    await hypeHaus.deployed();

    HAUS_COIN = await hypeHaus.HAUS_COIN();
    HYPE_HAUS = await hypeHaus.HYPE_HAUS();
    DAO_HAUS = await hypeHaus.DAO_HAUS();
  });

  describe('Initialization', () => {
    it('reports appropriate token ID for given token key', async () => {
      expect(HAUS_COIN).to.eq(0);
      expect(HYPE_HAUS).to.eq(1);
      expect(DAO_HAUS).to.eq(2);
    });

    it('reports deployer is owner of contract', async () => {
      expect(await hypeHaus.owner()).to.eq(deployer.address);
    });

    it('reports expected balances for accounts on deploy', async () => {
      const $1M = ethers.utils.parseUnits('1000000', 18);
      expect(await hypeHaus.balanceOf(deployer.address, HAUS_COIN)).to.eq($1M);
      expect(await hypeHaus.balanceOf(deployer.address, HYPE_HAUS)).to.eq(555);
      expect(await hypeHaus.balanceOf(deployer.address, DAO_HAUS)).to.eq(8888);

      expect(await hypeHaus.balanceOf(owner.address, HAUS_COIN)).to.eq(0);
      expect(await hypeHaus.balanceOf(owner.address, HYPE_HAUS)).to.eq(0);
      expect(await hypeHaus.balanceOf(owner.address, DAO_HAUS)).to.eq(0);

      expect(await hypeHaus.balanceOf(client.address, HAUS_COIN)).to.eq(0);
      expect(await hypeHaus.balanceOf(client.address, HYPE_HAUS)).to.eq(0);
      expect(await hypeHaus.balanceOf(client.address, DAO_HAUS)).to.eq(0);
    });
  });

  describe('Token URI', () => {
    it('reports correct token URI for given token kind ID', async () => {
      expect(await hypeHaus.uri(HAUS_COIN)).to.eq(HAUS_COIN_URI);
      expect(await hypeHaus.uri(HYPE_HAUS)).to.eq(HYPE_HAUS_URI);
      expect(await hypeHaus.uri(DAO_HAUS)).to.eq(DAO_HAUS_URI);
    });
  });

  describe('Token Creation', () => {
    it('successfully creates new tokens', async () => {
      await expect(hypeHaus.createNewTokenKind(1111, ''))
        .to.emit(hypeHaus, 'CreateNewTokenKind')
        .withArgs(3, 1111, '');

      await expect(hypeHaus.createNewTokenKind(1234, ''))
        .to.emit(hypeHaus, 'CreateNewTokenKind')
        .withArgs(4, 1234, '');
    });
  });

  describe('Transactions', () => {
    describe('HAUS coins', () => {
      it('approves transfer of 10 HAUS Coins from deployer to owner', async () => {
        const initial = await hypeHaus.balanceOf(deployer.address, HAUS_COIN);
        hypeHaus.awardToken(HAUS_COIN, owner.address, 10);
        expect(await hypeHaus.balanceOf(owner.address, HAUS_COIN)).to.eq(10);
        expect(await hypeHaus.balanceOf(deployer.address, HAUS_COIN)).to.eq(
          initial.sub(10),
        );
      });

      it('rejects transfer of 10 HAUS Coins from client to deployer', async () => {
        await expect(
          hypeHaus.connect(client).awardToken(HAUS_COIN, deployer.address, 10),
        ).to.be.revertedWith('');
      });
    });

    describe('HYPEhaus NFT', () => {
      it('approves transfer of 5 HYPEhaus tokens from deployer to client', async () => {
        const initial = await hypeHaus.balanceOf(deployer.address, HYPE_HAUS);
        hypeHaus.awardToken(HYPE_HAUS, owner.address, 5);
        expect(await hypeHaus.balanceOf(owner.address, HYPE_HAUS)).to.eq(5);
        expect(await hypeHaus.balanceOf(deployer.address, HYPE_HAUS)).to.eq(
          initial.sub(5),
        );
      });

      it('rejects transfer of 556 HYPEhaus tokens from deployer to client', async () => {
        await expect(
          hypeHaus.awardToken(HYPE_HAUS, client.address, 556),
        ).to.be.revertedWith('');
      });
    });

    describe('DAOhaus NFT', () => {
      it('approves transfer of 5 DAOhaus tokens from deployer to client', async () => {
        const initial = await hypeHaus.balanceOf(deployer.address, HYPE_HAUS);
        hypeHaus.awardToken(HYPE_HAUS, owner.address, 5);
        expect(await hypeHaus.balanceOf(owner.address, HYPE_HAUS)).to.eq(5);
        expect(await hypeHaus.balanceOf(deployer.address, HYPE_HAUS)).to.eq(
          initial.sub(5),
        );
      });

      it('rejects transfer of 889 DAOhaus tokens from deployer to client', async () => {
        await expect(
          hypeHaus.awardToken(DAO_HAUS, client.address, 8889),
        ).to.be.revertedWith('');
        hypeHaus.functions.mintMoreHausCoins;
      });
    });
  });

  /*
  describe('Minting', () => {
    describe('HAUS Coins', () => {
      it('successfully mints more HAUS coins', async () => {
        const $1M = ethers.utils.parseUnits('1000000', 18);
        await hypeHaus.mintMoreHausCoins(1000);
      });
    });
  });
  */
});
