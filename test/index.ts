import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { HypeHaus } from '../typechain-types/HypeHaus';

describe('HypeHaus', () => {
  let owner: SignerWithAddress;
  let deployer: SignerWithAddress;
  let client: SignerWithAddress;

  let hypeHaus: HypeHaus;
  let hausCoinId: BigNumber;
  let hypeHausId: BigNumber;
  let daoHausId: BigNumber;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    deployer = signers[1];
    client = signers[2];

    const factory = await ethers.getContractFactory('HypeHaus', deployer);
    hypeHaus = (await factory.deploy()) as HypeHaus;
    await hypeHaus.deployed();

    const [HAUS_COIN, HYPE_HAUS, DAO_HAUS] = await Promise.all([
      hypeHaus.HAUS_COIN(),
      hypeHaus.HYPE_HAUS(),
      hypeHaus.DAO_HAUS(),
    ]);

    hausCoinId = await hypeHaus.getIdForTokenKey(HAUS_COIN);
    hypeHausId = await hypeHaus.getIdForTokenKey(HYPE_HAUS);
    daoHausId = await hypeHaus.getIdForTokenKey(DAO_HAUS);
  });

  it('reports the appropriate token ID for a given token key', async () => {
    expect(hausCoinId).to.eq(0);
    expect(hypeHausId).to.eq(1);
    expect(daoHausId).to.eq(2);
  });

  describe('Initialization', () => {
    it('reports that the owner of the contract is the deployer', async () => {
      expect(await hypeHaus.owner()).to.eq(deployer.address);
    });

    it('reports the expected balances for a newly deployed contract', async () => {
      const $1M = ethers.utils.parseUnits('1000000', 18);
      expect(await hypeHaus.balanceOf(deployer.address, hausCoinId)).to.eq($1M);
      expect(await hypeHaus.balanceOf(deployer.address, hypeHausId)).to.eq(555);
      expect(await hypeHaus.balanceOf(deployer.address, daoHausId)).to.eq(8888);

      expect(await hypeHaus.balanceOf(owner.address, hausCoinId)).to.eq(0);
      expect(await hypeHaus.balanceOf(owner.address, hypeHausId)).to.eq(0);
      expect(await hypeHaus.balanceOf(owner.address, daoHausId)).to.eq(0);

      expect(await hypeHaus.balanceOf(client.address, hausCoinId)).to.eq(0);
      expect(await hypeHaus.balanceOf(client.address, hypeHausId)).to.eq(0);
      expect(await hypeHaus.balanceOf(client.address, daoHausId)).to.eq(0);
    });
  });

  describe('Token Creation', () => {
    it('successfully creates a new token', async () => {
      await expect(hypeHaus.createNewToken('ABC_HAUS', 1111))
        .to.emit(hypeHaus, 'CreateNewToken')
        .withArgs(3, 1111);

      await expect(hypeHaus.createNewToken('DEF_HAUS', 1234))
        .to.emit(hypeHaus, 'CreateNewToken')
        .withArgs(4, 1234);
    });

    it('fails to create a new token that already exists', async () => {
      await hypeHaus.createNewToken('ABC_HAUS', 1111);
      await expect(
        hypeHaus.createNewToken('ABC_HAUS', 2222),
      ).to.be.revertedWith('This token ID is already taken');
    });
  });

  describe('Transactions', () => {
    it('successfully transfers 10 HAUS Coins from deployer to the owner', async () => {
      const initial = await hypeHaus.balanceOf(deployer.address, hausCoinId);
      hypeHaus.awardToken(hausCoinId, owner.address, 10);
      expect(await hypeHaus.balanceOf(owner.address, hausCoinId)).to.eq(10);
      expect(await hypeHaus.balanceOf(deployer.address, hausCoinId)).to.eq(
        initial.sub(10),
      );
    });
  });
});
