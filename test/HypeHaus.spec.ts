import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { HypeHaus } from '../typechain-types/HypeHaus';

const MAX_SUPPLY = 10;
const BASE_TOKEN_URI = 'test://abc123/';
const COMMUNITY_SALE_PRICE = ethers.utils.parseEther('0.05');
const PUBLIC_SALE_PRICE = ethers.utils.parseEther('0.08');

enum Sale {
  Inactive = 0,
  Community = 1,
  Public = 2,
}

describe('HypeHaus Contract', () => {
  let hypeHaus: HypeHaus;

  type Signer = 'deployer' | 'team' | 'client1' | 'client2';
  let signers: Record<Signer, SignerWithAddress>;
  let addresses: Record<Signer, SignerWithAddress['address']>;

  beforeEach(async () => {
    const [deployer, team, client1, client2] = await ethers.getSigners();
    signers = { deployer, team, client1, client2 };
    addresses = {
      deployer: deployer.address,
      team: team.address,
      client1: client1.address,
      client2: client2.address,
    };

    const factory = await ethers.getContractFactory('HypeHaus', deployer);

    hypeHaus = (await factory.deploy(
      MAX_SUPPLY,
      BASE_TOKEN_URI,
      team.address,
    )) as HypeHaus;
    await hypeHaus.deployed();
  });

  describe('Initialization', () => {
    it('reports the correct total of minted HYPEHAUS tokens', async () => {
      expect(await hypeHaus.totalMinted()).to.eq(0);
    });
  });

  describe('Prerequisites', () => {
    it('can change the current active sale', async () => {
      expect(await hypeHaus.getActiveSale()).to.eq(Sale.Inactive);
      await hypeHaus.setActiveSale(Sale.Community);
      expect(await hypeHaus.getActiveSale()).to.eq(Sale.Community);
      await hypeHaus.setActiveSale(Sale.Public);
      expect(await hypeHaus.getActiveSale()).to.eq(Sale.Public);
      // Test that calling only-owner function as non-owner fails (we don't care
      // about the error message so we pass an empty string).
      await expect(
        hypeHaus.connect(signers.client1).setActiveSale(Sale.Inactive),
      ).to.be.revertedWith('');
    });
  });

  describe('Minting', () => {
    describe('Community Sale', () => {
      it('mints HYPEHAUS tokens when there is sufficient supply', async () => {
        await hypeHaus.setActiveSale(Sale.Community);
        const overrides = { value: COMMUNITY_SALE_PRICE };

        // For loop instead of Promise.all to avoid race conditions
        for (let i = 0; i < MAX_SUPPLY; i++) {
          // Before minting
          expect(await hypeHaus.totalMinted()).to.eq(i);

          // After minting
          const signer = i % 2 === 0 ? signers.client1 : signers.client2;
          await hypeHaus.connect(signer).mintCommunitySale(1, overrides);
          expect(await hypeHaus.totalMinted()).to.eq(i + 1);
        }

        await expect(
          hypeHaus.connect(signers.deployer).mintCommunitySale(1, overrides),
        ).to.be.revertedWith('HH_SUPPLY_EXHAUSTED');
      });

      it('fails to mint HYPEHAUS tokens when there is insufficient funds', async () => {
        await hypeHaus.setActiveSale(Sale.Community);
        await expect(
          hypeHaus.connect(signers.client1).mintCommunitySale(1),
        ).to.be.revertedWith('HH_INSUFFICIENT_FUNDS');
      });
    });

    describe('Public Sale', () => {
      it('mints HYPEHAUS tokens when there is sufficient supply', async () => {
        await hypeHaus.setActiveSale(Sale.Public);
        const overrides = { value: PUBLIC_SALE_PRICE };

        // For loop instead of Promise.all to avoid race conditions
        for (let i = 0; i < MAX_SUPPLY; i++) {
          // Before minting
          expect(await hypeHaus.totalMinted()).to.eq(i);

          // After minting
          const signer = i % 2 === 0 ? signers.client1 : signers.client2;
          await hypeHaus.connect(signer).mintPublicSale(1, overrides);
          expect(await hypeHaus.totalMinted()).to.eq(i + 1);
        }

        await expect(
          hypeHaus.connect(signers.deployer).mintPublicSale(1, overrides),
        ).to.be.revertedWith('HH_SUPPLY_EXHAUSTED');
      });

      it('fails to mint HYPEHAUS tokens when there is insufficient funds', async () => {
        await hypeHaus.setActiveSale(Sale.Public);
        await expect(
          hypeHaus.connect(signers.client1).mintPublicSale(1),
        ).to.be.revertedWith('HH_INSUFFICIENT_FUNDS');
      });
    });
  });

  describe('Changing Active Sale', () => {
    it('fails to mint HYPEHAUS tokens when no sale is active', async () => {
      await hypeHaus.setActiveSale(Sale.Inactive);
      const errorMsg = 'HH_SALE_NOT_ACTIVE';
      await expect(hypeHaus.mintPublicSale(1)).to.be.revertedWith(errorMsg);
      await expect(hypeHaus.mintCommunitySale(1)).to.be.revertedWith(errorMsg);
    });

    it('fails to mint HYPEHAUS tokens when the public sale is not active', async () => {
      await hypeHaus.setActiveSale(Sale.Community);
      const errorMsg = 'HH_PUBLIC_SALE_NOT_ACTIVE';
      await expect(hypeHaus.mintPublicSale(1)).to.be.revertedWith(errorMsg);
    });

    it('fails to mint HYPEHAUS tokens when the community sale is not active', async () => {
      await hypeHaus.setActiveSale(Sale.Public);
      const errorMsg = 'HH_COMMUNITY_SALE_NOT_ACTIVE';
      await expect(hypeHaus.mintCommunitySale(1)).to.be.revertedWith(errorMsg);
    });
  });

  describe('Token URI and Owner', () => {
    it('reports the correct URI and owner of a given minted token', async () => {
      await hypeHaus.setActiveSale(Sale.Public);
      const overrides = { value: PUBLIC_SALE_PRICE };
      await hypeHaus.connect(signers.client1).mintPublicSale(3, overrides);
      await hypeHaus.connect(signers.client2).mintPublicSale(1, overrides);

      await Promise.all(
        [...Array(4)].map(async (_, i) => {
          expect(await hypeHaus.tokenURI(i)).to.eq(
            `${BASE_TOKEN_URI}${i}.json`,
          );
        }),
      );

      expect(await hypeHaus.ownerOf(0)).to.eq(addresses.client1);
      expect(await hypeHaus.ownerOf(1)).to.eq(addresses.client1);
      expect(await hypeHaus.ownerOf(2)).to.eq(addresses.client1);
      expect(await hypeHaus.ownerOf(3)).to.eq(addresses.client2);

      const errorMsg = 'HH_NONEXISTENT_TOKEN';
      await expect(hypeHaus.tokenURI(4)).to.be.revertedWith(errorMsg);
      await expect(hypeHaus.tokenURI(MAX_SUPPLY)).to.be.revertedWith(errorMsg);
    });

    it('can change the base URI for all minted tokens', async () => {
      const newBaseTokenURI = 'test://xyz789/';
      const overrides = { value: PUBLIC_SALE_PRICE };

      await hypeHaus.setActiveSale(Sale.Public);
      await hypeHaus.mintPublicSale(2, overrides);
      expect(await hypeHaus.tokenURI(0)).to.eq(`${BASE_TOKEN_URI}0.json`);
      expect(await hypeHaus.tokenURI(1)).to.eq(`${BASE_TOKEN_URI}1.json`);

      await hypeHaus.setBaseTokenURI(newBaseTokenURI);
      expect(await hypeHaus.tokenURI(0)).to.eq(`${newBaseTokenURI}0.json`);
      expect(await hypeHaus.tokenURI(1)).to.eq(`${newBaseTokenURI}1.json`);
    });
  });

  describe('Withdrawing', () => {
    it("withdraws balance into the team's wallet", async () => {
      await hypeHaus.setActiveSale(Sale.Public);

      // Helper functions
      const getBalance = (signer: Signer) => signers[signer].getBalance();
      const mintTokenAs = async (signer: SignerWithAddress) => {
        return await hypeHaus
          .connect(signer)
          .mintPublicSale(1, { value: PUBLIC_SALE_PRICE })
          .then((tx) => tx.wait())
          .then((receipt) => receipt.gasUsed.mul(receipt.effectiveGasPrice));
      };

      // Initial balance state
      const initialBalances = {
        client1: await getBalance('client1'),
        client2: await getBalance('client2'),
        team: await getBalance('team'),
      };

      // First, mint one token each token for client1 and client2.
      const totalGasUsedClient1 = await mintTokenAs(signers.client1);
      const totalGasUsedClient2 = await mintTokenAs(signers.client2);

      // Next, check that the given client balances is equal to the expected
      // balances.
      const givenClient1Balance = await getBalance('client1');
      const givenClient2Balance = await getBalance('client2');

      const expectedClient1Balance = initialBalances.client1
        .sub(PUBLIC_SALE_PRICE)
        .sub(totalGasUsedClient1);
      const expectedClient2Balance = initialBalances.client2
        .sub(PUBLIC_SALE_PRICE)
        .sub(totalGasUsedClient2);

      expect(givenClient1Balance).to.eq(expectedClient1Balance);
      expect(givenClient2Balance).to.eq(expectedClient2Balance);
      expect(await getBalance('team')).to.eq(initialBalances.team);

      // Finally, withdraw the pending balance into the team's wallet and check
      // that the team's new balance is equal to the initial balance plus the
      // sum of client1 and client2's payments (0.08 ether each).
      await hypeHaus.withdraw();
      const expectedTeamBalance = initialBalances.team.add(
        PUBLIC_SALE_PRICE.mul(2),
      );
      expect(await getBalance('team')).to.eq(expectedTeamBalance);

      // The client balances should not have changed when withdrawing.
      expect(await getBalance('client1')).to.eq(givenClient1Balance);
      expect(await getBalance('client2')).to.eq(givenClient2Balance);
    });
  });
});
