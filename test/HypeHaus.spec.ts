import { expect } from 'chai';
import { ethers } from 'hardhat';
import { MerkleTree } from 'merkletreejs';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { HypeHaus } from '../typechain-types/HypeHaus';

const MAX_SUPPLY = 10;
const BASE_TOKEN_URI = 'test://abc123/';

const COMMUNITY_SALE_PRICE = ethers.utils.parseEther('0.05');
const PUBLIC_SALE_PRICE = ethers.utils.parseEther('0.08');

const MAX_TOKENS_PER_ALPHA_WALLET = 3;
const MAX_TOKENS_PER_HYPELIST_WALLET = 2;
const MAX_TOKENS_PER_HYPEMEMBER_WALLET = 1;
const MAX_TOKENS_PER_PUBLIC_WALLET = 1;

const keccak256 = ethers.utils.keccak256;

enum Sale {
  Inactive = 0,
  Community = 1,
  Public = 2,
}

describe('HypeHaus Contract', () => {
  let hypeHaus: HypeHaus;

  type SignerName = 'deployer' | 'team' | 'u1' | 'u2' | 'u3' | 'u4';
  let signers: Record<SignerName, SignerWithAddress>;
  let addresses: Record<SignerName, SignerWithAddress['address']>;

  beforeEach(async () => {
    const [deployer, team, u1, u2, u3, u4] = await ethers.getSigners();
    signers = { deployer, team, u1, u2, u3, u4 };
    addresses = {
      deployer: deployer.address,
      team: team.address,
      u1: u1.address,
      u2: u2.address,
      u3: u3.address,
      u4: u4.address,
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
        hypeHaus.connect(signers.u1).setActiveSale(Sale.Inactive),
      ).to.be.revertedWith('');
    });
  });

  describe('Minting', () => {
    async function expectSuccessfulCommunitySaleMint(
      tree: MerkleTree,
      signerName: SignerName,
      amount: number,
    ) {
      const proof = tree.getHexProof(keccak256(addresses[signerName]));
      const previousTotal = await hypeHaus.totalMinted();

      const overrides = { value: COMMUNITY_SALE_PRICE.mul(amount) };
      await hypeHaus
        .connect(signers[signerName])
        .mintCommunitySale(amount, proof, overrides);

      const currentTotal = await hypeHaus.totalMinted();
      const expectedTotal = previousTotal.add(amount);
      expect(currentTotal).to.eq(expectedTotal);
    }

    async function expectFailedCommunitySaleMint(
      tree: MerkleTree,
      signerName: SignerName,
      amount: number,
    ) {
      const claimer = keccak256(addresses.u3);
      const root = tree.getHexRoot();
      const proof = tree.getHexProof(claimer);
      await hypeHaus.setAlphaTierMerkleRoot(root);

      await expect(
        hypeHaus.connect(signers[signerName]).mintCommunitySale(amount, proof, {
          value: COMMUNITY_SALE_PRICE.mul(amount),
        }),
      ).to.be.revertedWith('HH_MERKLE_PROOF_FAILURE');
    }

    describe('Community Sale - Alpha', () => {
      let leaves: string[];
      let tree: MerkleTree;
      let mintAmount: number;

      beforeEach(async () => {
        await hypeHaus.setActiveSale(Sale.Community);
        leaves = [addresses.u1, addresses.u2].map(keccak256);
        tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        mintAmount = MAX_TOKENS_PER_ALPHA_WALLET;

        const root = tree.getHexRoot();
        await hypeHaus.setAlphaTierMerkleRoot(root);
      });

      it('mints 3 HYPEHAUSes in a community sale as an Alpha', async () => {
        await expectSuccessfulCommunitySaleMint(tree, 'u1', mintAmount);
        await expectSuccessfulCommunitySaleMint(tree, 'u2', mintAmount);
      });

      it('fails to mint 3 HYPEHAUSes in a community sale as a non-Alpha', async () => {
        await expectFailedCommunitySaleMint(tree, 'u3', mintAmount);
      });
    });

    describe('Community Sale - Hypelist', () => {
      let leaves: string[];
      let tree: MerkleTree;
      let mintAmount: number;

      beforeEach(async () => {
        await hypeHaus.setActiveSale(Sale.Community);
        leaves = [addresses.u1, addresses.u2].map(keccak256);
        tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        mintAmount = MAX_TOKENS_PER_HYPELIST_WALLET;

        const root = tree.getHexRoot();
        await hypeHaus.setHypelistTierMerkleRoot(root);
      });

      it('mints 2 HYPEHAUSes in a community sale as a Hypelister', async () => {
        await expectSuccessfulCommunitySaleMint(tree, 'u1', mintAmount);
        await expectSuccessfulCommunitySaleMint(tree, 'u2', mintAmount);
      });

      it('fails to mint 2 HYPEHAUSes in a community sale as a non-Hypelister', async () => {
        await expectFailedCommunitySaleMint(tree, 'u3', mintAmount);
      });
    });

    describe('Community Sale - Hypemember', () => {
      let leaves: string[];
      let tree: MerkleTree;
      let mintAmount: number;

      beforeEach(async () => {
        await hypeHaus.setActiveSale(Sale.Community);
        leaves = [addresses.u1, addresses.u2].map(keccak256);
        tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        mintAmount = MAX_TOKENS_PER_HYPEMEMBER_WALLET;

        const root = tree.getHexRoot();
        await hypeHaus.setHypememberTierMerkleRoot(root);
      });

      it('mints 1 HYPEHAUS in a community sale as a Hypemember', async () => {
        await expectSuccessfulCommunitySaleMint(tree, 'u1', mintAmount);
        await expectSuccessfulCommunitySaleMint(tree, 'u2', mintAmount);
      });

      it('fails to mint 1 HYPEHAUS in a community sale as a non-Hypemember', async () => {
        await expectFailedCommunitySaleMint(tree, 'u3', mintAmount);
      });
    });

    describe('Public Sale', () => {
      beforeEach(async () => {
        await hypeHaus.setActiveSale(Sale.Public);
      });

      it('mints HYPEHAUSes when there is sufficient supply', async () => {
        const overrides = { value: PUBLIC_SALE_PRICE };

        const [_deployer, _team, ...restSigners] = await ethers.getSigners();
        const signers = restSigners.slice(0, MAX_SUPPLY - 1);

        for (const [index, signer] of signers.entries()) {
          // Before minting
          expect(await hypeHaus.totalMinted()).to.eq(index);

          // After minting
          await expect(hypeHaus.connect(signer).mintPublicSale(overrides))
            .to.emit(hypeHaus, 'Transfer')
            .withArgs(ethers.constants.AddressZero, signer.address, index);
          expect(await hypeHaus.totalMinted()).to.eq(index + 1);

          // This signer can't mint anymore
          await expect(
            hypeHaus.connect(signer).mintPublicSale(overrides),
          ).to.be.revertedWith('HH_ADDRESS_ALREADY_CLAIMED');
        }

        // Mint last one
        await hypeHaus.mintPublicSale(overrides);

        // No more HYPEHAUSes can be minted
        await expect(hypeHaus.mintPublicSale(overrides)).to.be.revertedWith(
          'HH_SUPPLY_EXHAUSTED',
        );
      });

      it('fails to mint HYPEHAUSes when there are insufficient funds', async () => {
        await expect(
          hypeHaus.connect(signers.u1).mintPublicSale(),
        ).to.be.revertedWith('HH_INSUFFICIENT_FUNDS');
      });
    });
  });

  describe('Changing Active Sale', () => {
    it('fails to mint HYPEHAUSes when the public sale is not active', async () => {
      const errorMsg = 'HH_PUBLIC_SALE_NOT_ACTIVE';

      await hypeHaus.setActiveSale(Sale.Inactive);
      await expect(hypeHaus.mintPublicSale()).to.be.revertedWith(errorMsg);

      await hypeHaus.setActiveSale(Sale.Community);
      await expect(hypeHaus.mintPublicSale()).to.be.revertedWith(errorMsg);
    });
  });

  describe('Token URI and Owner', () => {
    it('reports the correct URI and owner of a given minted token', async () => {
      // Alpha Merkle Tree
      const alphas = [addresses.u1].map(keccak256);
      const alphaTree = new MerkleTree(alphas, keccak256, { sortPairs: true });
      const alphaRoot = alphaTree.getHexRoot();
      const alphaProof = alphaTree.getHexProof(alphas[0]);
      await hypeHaus.setAlphaTierMerkleRoot(alphaRoot);

      // Hypelist Merkle Tree
      const hlLeaves = [addresses.u2].map(keccak256);
      const hlTree = new MerkleTree(hlLeaves, keccak256, { sortPairs: true });
      const hlRoot = hlTree.getHexRoot();
      const hlProof = hlTree.getHexProof(hlLeaves[0]);
      await hypeHaus.setHypelistTierMerkleRoot(hlRoot);

      // Hypemember Merkle Tree
      const hmLeaves = [addresses.u3].map(keccak256);
      const hmTree = new MerkleTree(hmLeaves, keccak256, { sortPairs: true });
      const hmRoot = hmTree.getHexRoot();
      const hmProof = hmTree.getHexProof(hmLeaves[0]);
      await hypeHaus.setHypememberTierMerkleRoot(hmRoot);

      // Overrides
      const publicMintOverrides = { value: PUBLIC_SALE_PRICE };
      const communityMintOverrides = {
        value: COMMUNITY_SALE_PRICE.mul(MAX_TOKENS_PER_ALPHA_WALLET),
      };

      // Activate community sale
      await hypeHaus.setActiveSale(Sale.Community);

      await hypeHaus
        .connect(signers.u1)
        .mintCommunitySale(
          MAX_TOKENS_PER_ALPHA_WALLET,
          alphaProof,
          communityMintOverrides,
        );

      await hypeHaus
        .connect(signers.u2)
        .mintCommunitySale(
          MAX_TOKENS_PER_HYPELIST_WALLET,
          hlProof,
          communityMintOverrides,
        );

      await hypeHaus
        .connect(signers.u3)
        .mintCommunitySale(
          MAX_TOKENS_PER_HYPEMEMBER_WALLET,
          hmProof,
          communityMintOverrides,
        );

      // Activate public sale
      await hypeHaus.setActiveSale(Sale.Public);
      await hypeHaus.connect(signers.u1).mintPublicSale(publicMintOverrides);
      await hypeHaus.connect(signers.u4).mintPublicSale(publicMintOverrides);

      // Test all token URIs
      await Promise.all(
        [...Array(7)].map(async (_, i) => {
          expect(await hypeHaus.tokenURI(i)).to.eq(
            `${BASE_TOKEN_URI}${i}.json`,
          );
        }),
      );

      // Test all token owners
      expect(await hypeHaus.ownerOf(0)).to.eq(addresses.u1);
      expect(await hypeHaus.ownerOf(1)).to.eq(addresses.u1);
      expect(await hypeHaus.ownerOf(2)).to.eq(addresses.u1);
      expect(await hypeHaus.ownerOf(3)).to.eq(addresses.u2);
      expect(await hypeHaus.ownerOf(4)).to.eq(addresses.u2);
      expect(await hypeHaus.ownerOf(5)).to.eq(addresses.u3);
      expect(await hypeHaus.ownerOf(6)).to.eq(addresses.u1);
      expect(await hypeHaus.ownerOf(7)).to.eq(addresses.u4);

      // Expect all token URIs to have changed when setting a new base token URI
      const newBaseTokenURI = 'test://zyx987/';
      await hypeHaus.setBaseTokenURI(newBaseTokenURI);
      await Promise.all(
        [...Array(7)].map(async (_, i) => {
          expect(await hypeHaus.tokenURI(i)).to.eq(
            `${newBaseTokenURI}${i}.json`,
          );
        }),
      );
    });

    it('can change the base URI for all minted HYPEHAUSes', async () => {
      const newBaseTokenURI = 'test://zyx987/';
      await hypeHaus.setActiveSale(Sale.Public);

      await hypeHaus
        .connect(signers.u1)
        .mintPublicSale({ value: PUBLIC_SALE_PRICE });
      await hypeHaus
        .connect(signers.u2)
        .mintPublicSale({ value: PUBLIC_SALE_PRICE });

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
      const getBalance = (signer: SignerName) => signers[signer].getBalance();
      const mintTokenAs = async (signer: SignerWithAddress) => {
        return await hypeHaus
          .connect(signer)
          .mintPublicSale({ value: PUBLIC_SALE_PRICE })
          .then((tx) => tx.wait())
          .then((receipt) => receipt.gasUsed.mul(receipt.effectiveGasPrice));
      };

      // Initial balance state
      const initialBalances = {
        u1: await getBalance('u1'),
        u2: await getBalance('u2'),
        team: await getBalance('team'),
      };

      // First, mint one token each token for u1 and u2.
      const totalGasUsedClient1 = await mintTokenAs(signers.u1);
      const totalGasUsedClient2 = await mintTokenAs(signers.u2);

      // Next, check that the given client balances is equal to the expected
      // balances.
      const givenClient1Balance = await getBalance('u1');
      const givenClient2Balance = await getBalance('u2');

      const expectedClient1Balance = initialBalances.u1
        .sub(PUBLIC_SALE_PRICE)
        .sub(totalGasUsedClient1);
      const expectedClient2Balance = initialBalances.u2
        .sub(PUBLIC_SALE_PRICE)
        .sub(totalGasUsedClient2);

      expect(givenClient1Balance).to.eq(expectedClient1Balance);
      expect(givenClient2Balance).to.eq(expectedClient2Balance);
      expect(await getBalance('team')).to.eq(initialBalances.team);

      // Finally, withdraw the pending balance into the team's wallet and check
      // that the team's new balance is equal to the initial balance plus the
      // sum of u1 and u2's payments (0.08 ether each).
      await hypeHaus.withdraw();
      const expectedTeamBalance = initialBalances.team.add(
        PUBLIC_SALE_PRICE.mul(2),
      );
      expect(await getBalance('team')).to.eq(expectedTeamBalance);

      // The client balances should not have changed when withdrawing.
      expect(await getBalance('u1')).to.eq(givenClient1Balance);
      expect(await getBalance('u2')).to.eq(givenClient2Balance);
    });
  });
});
