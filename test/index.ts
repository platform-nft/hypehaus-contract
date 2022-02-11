import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { HypeHaus } from "../typechain-types/HypeHaus";

describe("HypeHaus", () => {
  let owner: SignerWithAddress;

  let hypeHaus: HypeHaus;
  let hausCoinId: BigNumber;
  let hypeHausId: BigNumber;
  let daoHausId: BigNumber;

  beforeEach(async () => {
    owner = (await ethers.getSigners())[0];

    const factory = await ethers.getContractFactory("HypeHaus");
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

  it("reports the appropriate token ID for a given token key", async () => {
    expect(hausCoinId).to.eq(0);
    expect(hypeHausId).to.eq(1);
    expect(daoHausId).to.eq(2);
  });

  describe("Initialization", () => {
    it("reports the expected balance for a newly deployed contract", async () => {
      const $1M = ethers.utils.parseUnits("1000000", 18);
      expect(await hypeHaus.balanceOf(owner.address, hausCoinId)).to.eq($1M);
      expect(await hypeHaus.balanceOf(owner.address, hypeHausId)).to.eq(555);
      expect(await hypeHaus.balanceOf(owner.address, daoHausId)).to.eq(8888);
    });
  });

  describe("Token Creation", () => {
    it("successfully creates a new token", async () => {
      await expect(hypeHaus.createNewToken("ABC_HAUS", 1111))
        .to.emit(hypeHaus, "CreateNewToken")
        .withArgs(3, 1111);

      await expect(hypeHaus.createNewToken("DEF_HAUS", 1234))
        .to.emit(hypeHaus, "CreateNewToken")
        .withArgs(4, 1234);
    });

    it("fails when creating a token that already exists", async () => {
      await hypeHaus.createNewToken("ABC_HAUS", 1111);
      await expect(
        hypeHaus.createNewToken("ABC_HAUS", 2222)
      ).to.be.revertedWith("This ID is already taken");
    });
  });
});
