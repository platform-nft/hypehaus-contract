import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { HypeHaus } from '../typechain-types/HypeHaus';

describe('HypeHaus Contract', () => {
  let owner: SignerWithAddress;
  let deployer: SignerWithAddress;
  let client: SignerWithAddress;

  let hypeHaus: HypeHaus;
  let HAUS_COIN: BigNumber;
  let HYPE_HAUS: BigNumber;
  let DAO_HAUS: BigNumber;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    deployer = signers[1];
    client = signers[2];

    const factory = await ethers.getContractFactory('HypeHaus', deployer);
    hypeHaus = (await factory.deploy()) as HypeHaus;
    await hypeHaus.deployed();

    const [HAUS_COIN_KEY, HYPE_HAUS_KEY, DAO_HAUS_KEY] = await Promise.all([
      hypeHaus.HAUS_COIN(),
      hypeHaus.HYPE_HAUS(),
      hypeHaus.DAO_HAUS(),
    ]);

    HAUS_COIN = await hypeHaus.getIdForTokenKey(HAUS_COIN_KEY);
    HYPE_HAUS = await hypeHaus.getIdForTokenKey(HYPE_HAUS_KEY);
    DAO_HAUS = await hypeHaus.getIdForTokenKey(DAO_HAUS_KEY);
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
    it('reports correct token URI for given token ID', async () => {
      async function checkFileIdForTokenId(tokenId: BigNumber) {
        const tokenUri = await hypeHaus.uri(tokenId);
        const [fileId] = tokenUri.slice(-1 * (64 + '.json'.length)).split('.');
        expect(fileId).to.match(/^[0-9a-f]{64}$/g);
        expect(fileId).to.eq(tokenId.toHexString().slice(2).padStart(64, '0'));
      }

      await checkFileIdForTokenId(HAUS_COIN);
      await checkFileIdForTokenId(HYPE_HAUS);
      await checkFileIdForTokenId(DAO_HAUS);
    });
  });

  describe('Token Creation', () => {
    it('successfully creates new tokens', async () => {
      await expect(hypeHaus.createNewToken('ABC_HAUS', 1111))
        .to.emit(hypeHaus, 'CreateNewToken')
        .withArgs(3, 1111);

      await expect(hypeHaus.createNewToken('DEF_HAUS', 1234))
        .to.emit(hypeHaus, 'CreateNewToken')
        .withArgs(4, 1234);
    });

    it('fails to create new token that already exists', async () => {
      await hypeHaus.createNewToken('ABC_HAUS', 1111);
      await expect(
        hypeHaus.createNewToken('ABC_HAUS', 2222),
      ).to.be.revertedWith('This token ID is already taken');
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

  // describe('Minting', () => {
  //   describe('HAUS Coins', () => {
  //     it('successfully mints more HAUS coins', async () => {
  //       const $1M = ethers.utils.parseUnits('1000000', 18);
  //       await hypeHaus.mintMoreHausCoins(1000);
  //     });
  //   });
  // });
});
