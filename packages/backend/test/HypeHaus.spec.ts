import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
import { MerkleTree } from 'merkletreejs';

import { HypeHaus } from '../typechain-types/HypeHaus';

type MerkleTreeLeaf = ReturnType<typeof keccak256>;
type MerkleTreeProof = ReturnType<MerkleTree['getHexProof']>;

const MAX_SUPPLY = 10;
const BASE_TOKEN_URI = 'test://abc123/';

const COMMUNITY_SALE_PRICE = ethers.utils.parseEther('0.05');
const PUBLIC_SALE_PRICE = ethers.utils.parseEther('0.08');

const MAX_TOKENS_PER_ALPHA_WALLET = 3;
const MAX_TOKENS_PER_HYPELIST_WALLET = 2;
const MAX_TOKENS_PER_HYPEMEMBER_WALLET = 1;
const MAX_TOKENS_PER_PUBLIC_WALLET = 2;

const keccak256 = ethers.utils.keccak256;

const ERR_COMMUNITY_SALE_NOT_ACTIVE = 'HH_COMMUNITY_SALE_NOT_ACTIVE';
const ERR_PUBLIC_SALE_NOT_ACTIVE = 'HH_PUBLIC_SALE_NOT_ACTIVE';
const ERR_SUPPLY_EXHAUSTED = 'HH_SUPPLY_EXHAUSTED';
const ERR_INVALID_MINT_AMOUNT = 'HH_INVALID_MINT_AMOUNT';
const ERR_INSUFFICIENT_FUNDS = 'HH_INSUFFICIENT_FUNDS';
const ERR_ADDRESS_ALREADY_CLAIMED = 'HH_ADDRESS_ALREADY_CLAIMED';
const ERR_VERIFICATION_FAILURE = 'HH_VERIFICATION_FAILURE';

enum Sale {
  Inactive = 0,
  Community = 1,
  Public = 2,
}

describe('HypeHaus Contract', () => {
  let hypeHaus: HypeHaus;

  type SignerName = 'deployer' | 'team' | `u${'1' | '2' | '3' | '4' | '5'}`;
  let signers: Record<SignerName, SignerWithAddress>;
  let addresses: Record<SignerName, SignerWithAddress['address']>;

  beforeEach(async () => {
    const [deployer, team, u1, u2, u3, u4, u5] = await ethers.getSigners();
    signers = { deployer, team, u1, u2, u3, u4, u5 };
    addresses = {
      deployer: deployer.address,
      team: team.address,
      u1: u1.address,
      u2: u2.address,
      u3: u3.address,
      u4: u4.address,
      u5: u5.address,
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
    it('reports the correct total of minted HYPEHAUSes', async () => {
      expect(await hypeHaus.totalMinted()).to.eq(0);
    });
  });

  describe('Prerequisites', () => {
    describe('Active Sale', () => {
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

      it('fails to mint when the community sale is not active', async () => {
        const leaves = [addresses.u1].map(keccak256);
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        const root = tree.getHexRoot();
        const proof = tree.getHexProof(leaves[0]);

        // Set the same root for all tiers for testing purposes
        await hypeHaus.setAlphaTierMerkleRoot(root);
        await hypeHaus.setHypelistTierMerkleRoot(root);
        await hypeHaus.setHypememberTierMerkleRoot(root);

        const expectFailedCommunityMints = async () => {
          await expect(hypeHaus.mintAlpha(1, proof)).to.be.revertedWith(
            ERR_COMMUNITY_SALE_NOT_ACTIVE,
          );
          await expect(hypeHaus.mintHypelister(1, proof)).to.be.revertedWith(
            ERR_COMMUNITY_SALE_NOT_ACTIVE,
          );
          await expect(hypeHaus.mintHypemember(1, proof)).to.be.revertedWith(
            ERR_COMMUNITY_SALE_NOT_ACTIVE,
          );
        };

        await hypeHaus.setActiveSale(Sale.Inactive);
        await expectFailedCommunityMints();

        await hypeHaus.setActiveSale(Sale.Public);
        await expectFailedCommunityMints();
      });

      it('fails to mint when the public sale is not active', async () => {
        await hypeHaus.setActiveSale(Sale.Inactive);
        await expect(hypeHaus.mintPublic(1)).to.be.revertedWith(
          ERR_PUBLIC_SALE_NOT_ACTIVE,
        );

        await hypeHaus.setActiveSale(Sale.Community);
        await expect(hypeHaus.mintPublic(1)).to.be.revertedWith(
          ERR_PUBLIC_SALE_NOT_ACTIVE,
        );
      });
    });

    describe('Sufficient Supply', () => {
      function getAlmostMax(mintAmount: number) {
        return MAX_SUPPLY % mintAmount === 0
          ? Math.floor((MAX_SUPPLY - 1) / mintAmount)
          : Math.floor(MAX_SUPPLY / mintAmount);
      }

      it('fails to mint when supply has run out', async () => {
        const [_d, _t, ...restSigners] = await ethers.getSigners();
        const leaves = restSigners.map((s) => keccak256(s.address));
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        const root = tree.getHexRoot();

        await hypeHaus.setActiveSale(Sale.Community);
        await hypeHaus.setAlphaTierMerkleRoot(root);
        await hypeHaus.setHypelistTierMerkleRoot(root);
        await hypeHaus.setHypememberTierMerkleRoot(root);

        const almostMaxAlpha = getAlmostMax(MAX_TOKENS_PER_ALPHA_WALLET);
        await Promise.all(
          [...Array(getAlmostMax(almostMaxAlpha))].map(async (_, i) => {
            await expect(
              hypeHaus
                .connect(restSigners[i])
                .mintAlpha(
                  MAX_TOKENS_PER_ALPHA_WALLET,
                  tree.getHexProof(leaves[i]),
                  {
                    value: COMMUNITY_SALE_PRICE.mul(
                      MAX_TOKENS_PER_ALPHA_WALLET,
                    ),
                  },
                ),
            ).to.not.be.revertedWith(ERR_SUPPLY_EXHAUSTED);
          }),
        );

        await hypeHaus.setActiveSale(Sale.Community);
        await expect(
          hypeHaus
            .connect(restSigners[almostMaxAlpha])
            .mintHypelister(2, tree.getHexProof(leaves[almostMaxAlpha]), {
              value: COMMUNITY_SALE_PRICE,
            }),
        ).to.be.revertedWith(ERR_SUPPLY_EXHAUSTED);
      });
    });

    describe('Unique Claim', () => {
      it('fails to mint when the signer has already minted in the community sale', async () => {
        const cohort = [signers.u1, signers.u2, signers.u3];
        const leaves = cohort.map((signer) => keccak256(signer.address));
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        const root = tree.getHexRoot();
        const getProof = (index: number) => tree.getHexProof(leaves[index]);

        await hypeHaus.setActiveSale(Sale.Community);
        await hypeHaus.setAlphaTierMerkleRoot(root);
        await hypeHaus.setHypelistTierMerkleRoot(root);
        await hypeHaus.setHypememberTierMerkleRoot(root);

        await expect(
          hypeHaus
            .connect(signers.u1)
            .mintAlpha(1, getProof(0), { value: COMMUNITY_SALE_PRICE }),
        ).to.not.be.revertedWith('');

        await expect(
          hypeHaus
            .connect(signers.u2)
            .mintHypelister(1, getProof(1), { value: COMMUNITY_SALE_PRICE }),
        ).to.not.be.revertedWith('');

        await expect(
          hypeHaus
            .connect(signers.u3)
            .mintHypemember(1, getProof(2), { value: COMMUNITY_SALE_PRICE }),
        ).to.not.be.revertedWith('');

        await Promise.all(
          cohort.map(async (signer, index) => {
            await expect(
              hypeHaus
                .connect(signer)
                .mintAlpha(1, getProof(index), { value: COMMUNITY_SALE_PRICE }),
            ).to.be.revertedWith(ERR_ADDRESS_ALREADY_CLAIMED);
            await expect(
              hypeHaus.connect(signer).mintHypelister(1, getProof(index), {
                value: COMMUNITY_SALE_PRICE,
              }),
            ).to.be.revertedWith(ERR_ADDRESS_ALREADY_CLAIMED);
            await expect(
              hypeHaus.connect(signer).mintHypemember(1, getProof(index), {
                value: COMMUNITY_SALE_PRICE,
              }),
            ).to.be.revertedWith(ERR_ADDRESS_ALREADY_CLAIMED);
          }),
        );
      });

      it('fails to mint when the signer has already minted in the public sale', async () => {
        const cohort = [signers.u1, signers.u2, signers.u3];
        await hypeHaus.setActiveSale(Sale.Public);

        await expect(
          hypeHaus
            .connect(signers.u1)
            .mintPublic(1, { value: PUBLIC_SALE_PRICE }),
        ).to.not.be.revertedWith('');

        await expect(
          hypeHaus
            .connect(signers.u2)
            .mintPublic(1, { value: PUBLIC_SALE_PRICE }),
        ).to.not.be.revertedWith('');

        await expect(
          hypeHaus
            .connect(signers.u3)
            .mintPublic(1, { value: PUBLIC_SALE_PRICE }),
        ).to.not.be.revertedWith('');

        await Promise.all(
          cohort.map(async (signer) => {
            await expect(
              hypeHaus
                .connect(signer)
                .mintPublic(1, { value: PUBLIC_SALE_PRICE }),
            ).to.be.revertedWith(ERR_ADDRESS_ALREADY_CLAIMED);
            await expect(
              hypeHaus
                .connect(signer)
                .mintPublic(1, { value: PUBLIC_SALE_PRICE }),
            ).to.be.revertedWith(ERR_ADDRESS_ALREADY_CLAIMED);
            await expect(
              hypeHaus
                .connect(signer)
                .mintPublic(1, { value: PUBLIC_SALE_PRICE }),
            ).to.be.revertedWith(ERR_ADDRESS_ALREADY_CLAIMED);
          }),
        );
      });
    });

    describe('Mint Amount', () => {
      let tree: MerkleTree;
      let leaves: MerkleTreeLeaf[];
      let proofs: MerkleTreeProof[];
      let signers: SignerWithAddress[];

      async function expectFailedCommunityMint(
        signer: SignerWithAddress,
        proof: MerkleTreeProof,
        maxMintAmount: number,
        mintFn: (
          contract: HypeHaus,
          amount: number,
          proof: MerkleTreeProof,
        ) => Promise<any>,
      ) {
        await expect(
          mintFn(hypeHaus.connect(signer), 0, proof),
        ).to.be.revertedWith(ERR_INVALID_MINT_AMOUNT);
        await expect(
          mintFn(hypeHaus.connect(signer), maxMintAmount + 1, proof),
        ).to.be.revertedWith(ERR_INVALID_MINT_AMOUNT);
      }

      beforeEach(async () => {
        signers = await ethers.getSigners().then((signers) => signers.slice(2));
        leaves = signers.slice(0, -1).map((s) => keccak256(s.address));
        tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        proofs = leaves.map((l) => tree.getHexProof(l));

        await hypeHaus.setActiveSale(Sale.Community);
        await hypeHaus.setAlphaTierMerkleRoot(tree.getHexRoot());
        await hypeHaus.setHypelistTierMerkleRoot(tree.getHexRoot());
        await hypeHaus.setHypememberTierMerkleRoot(tree.getHexRoot());
      });

      it('fails to mint an invalid amount as an Alpha', async () => {
        await expectFailedCommunityMint(
          signers[0],
          proofs[0],
          MAX_TOKENS_PER_ALPHA_WALLET,
          (hypeHaus, amount, proof) => hypeHaus.mintAlpha(amount, proof),
        );
      });

      it('fails to mint an invalid amount as a Hypelister', async () => {
        await expectFailedCommunityMint(
          signers[0],
          proofs[0],
          MAX_TOKENS_PER_HYPELIST_WALLET,
          (hypeHaus, amount, proof) => hypeHaus.mintHypelister(amount, proof),
        );
      });

      it('fails to mint an invalid amount as a Hypemember', async () => {
        await expectFailedCommunityMint(
          signers[0],
          proofs[0],
          MAX_TOKENS_PER_HYPELIST_WALLET,
          (hypeHaus, amount, proof) => hypeHaus.mintHypemember(amount, proof),
        );
      });

      it('fails to mint an invalid amount as a public member', async () => {
        await hypeHaus.setActiveSale(Sale.Public);
        await expect(hypeHaus.mintPublic(0)).to.be.revertedWith(
          ERR_INVALID_MINT_AMOUNT,
        );
        await expect(
          hypeHaus.mintPublic(MAX_TOKENS_PER_PUBLIC_WALLET + 1),
        ).to.be.revertedWith(ERR_INVALID_MINT_AMOUNT);
      });
    });

    describe('Sufficient Funds', () => {
      let tree: MerkleTree;
      let leaves: MerkleTreeLeaf[];
      let proofs: MerkleTreeProof[];
      let signers: SignerWithAddress[];

      beforeEach(async () => {
        signers = await ethers.getSigners().then((signers) => signers.slice(2));
        leaves = signers.slice(0, -1).map((s) => keccak256(s.address));
        tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        proofs = leaves.map((l) => tree.getHexProof(l));
      });

      beforeEach(async () => {
        signers = await ethers.getSigners().then((signers) => signers.slice(2));
      });

      beforeEach(async () => {
        await hypeHaus.setActiveSale(Sale.Community);
        await hypeHaus.setAlphaTierMerkleRoot(tree.getHexRoot());
        await hypeHaus.setHypelistTierMerkleRoot(tree.getHexRoot());
        await hypeHaus.setHypememberTierMerkleRoot(tree.getHexRoot());
      });

      it('fails to mint with insufficient funds as an Alpha', async () => {
        for (
          let amount = 1, i = 0;
          amount < MAX_TOKENS_PER_ALPHA_WALLET;
          amount++, i++
        ) {
          await expect(
            hypeHaus.connect(signers[i]).mintAlpha(amount, proofs[i]),
          ).to.be.revertedWith(ERR_INSUFFICIENT_FUNDS);
        }
      });

      it('fails to mint with insufficient funds as a Hypelister', async () => {
        for (
          let amount = 1, i = 0;
          amount < MAX_TOKENS_PER_HYPELIST_WALLET;
          amount++, i++
        ) {
          await expect(
            hypeHaus.connect(signers[i]).mintHypelister(amount, proofs[i]),
          ).to.be.revertedWith(ERR_INSUFFICIENT_FUNDS);
        }
      });

      it('fails to mint with insufficient funds as a Hypemember', async () => {
        for (
          let amount = 1, i = 0;
          amount < MAX_TOKENS_PER_HYPELIST_WALLET;
          amount++, i++
        ) {
          await expect(
            hypeHaus.connect(signers[i]).mintHypemember(amount, proofs[i]),
          ).to.be.revertedWith(ERR_INSUFFICIENT_FUNDS);
        }
      });

      it('fails to mint with insufficient funds as a public member', async () => {
        await hypeHaus.setActiveSale(Sale.Public);
        await expect(
          hypeHaus.connect(signers[0]).mintPublic(1),
        ).to.be.revertedWith(ERR_INSUFFICIENT_FUNDS);

        await expect(
          hypeHaus.connect(signers[0]).mintPublic(MAX_TOKENS_PER_PUBLIC_WALLET),
        ).to.be.revertedWith(ERR_INSUFFICIENT_FUNDS);
      });
    });

    describe('Verification', () => {
      type Tier = {
        tree: MerkleTree;
        leaves: MerkleTreeLeaf[];
        proofs: MerkleTreeProof[];
        verifiedSigners: SignerWithAddress[];
      };

      let alphaTier: Tier;
      let hypelisterTier: Tier;
      let hypememberTier: Tier;
      let unverifiedSigners: SignerWithAddress[];

      beforeEach(async () => {
        const allSigners = await ethers.getSigners().then((s) => s.slice(2));
        const [a1, a2, hl1, hl2, hm1, hm2, ...restSigners] = allSigners;
        unverifiedSigners = restSigners;

        const aLeaves = [a1, a2].map((s) => keccak256(s.address));
        const hlLeaves = [hl1, hl2].map((s) => keccak256(s.address));
        const hmLeaves = [hm1, hm2].map((s) => keccak256(s.address));

        const aTree = new MerkleTree(aLeaves, keccak256, { sortPairs: true });
        const hlTree = new MerkleTree(hlLeaves, keccak256, { sortPairs: true });
        const hmTree = new MerkleTree(hmLeaves, keccak256, { sortPairs: true });

        const aProofs = aLeaves.map((leaf) => aTree.getHexProof(leaf));
        const hlProofs = hlLeaves.map((leaf) => hlTree.getHexProof(leaf));
        const hmProofs = hmLeaves.map((leaf) => hmTree.getHexProof(leaf));

        alphaTier = {
          leaves: aLeaves,
          tree: aTree,
          proofs: aProofs,
          verifiedSigners: [a1, a2],
        };

        hypelisterTier = {
          leaves: hlLeaves,
          tree: hlTree,
          proofs: hlProofs,
          verifiedSigners: [hl1, hl2],
        };

        hypememberTier = {
          leaves: hmLeaves,
          tree: hmTree,
          proofs: hmProofs,
          verifiedSigners: [hm1, hm2],
        };

        await hypeHaus.setActiveSale(Sale.Community);
        await hypeHaus.setAlphaTierMerkleRoot(aTree.getHexRoot());
        await hypeHaus.setHypelistTierMerkleRoot(hlTree.getHexRoot());
        await hypeHaus.setHypememberTierMerkleRoot(hmTree.getHexRoot());
      });

      it('fails to mint when the signer cannot be proved to be an Alpha', async () => {
        for (const [index, signer] of alphaTier.verifiedSigners.entries()) {
          expect(
            hypeHaus.connect(signer).mintAlpha(1, alphaTier.proofs[index], {
              value: COMMUNITY_SALE_PRICE,
            }),
          ).to.not.be.revertedWith(ERR_VERIFICATION_FAILURE);
        }

        expect(
          hypeHaus
            .connect(unverifiedSigners[0])
            .mintAlpha(1, alphaTier.proofs[0], {
              value: COMMUNITY_SALE_PRICE,
            }),
        ).to.be.revertedWith(ERR_VERIFICATION_FAILURE);
      });

      it('fails to mint when the signer cannot be proved to be a Hypelister', async () => {
        for (const [
          index,
          signer,
        ] of hypelisterTier.verifiedSigners.entries()) {
          expect(
            hypeHaus
              .connect(signer)
              .mintHypelister(1, hypelisterTier.proofs[index], {
                value: COMMUNITY_SALE_PRICE,
              }),
          ).to.not.be.revertedWith(ERR_VERIFICATION_FAILURE);
        }

        expect(
          hypeHaus
            .connect(unverifiedSigners[0])
            .mintHypelister(1, hypelisterTier.proofs[0], {
              value: COMMUNITY_SALE_PRICE,
            }),
        ).to.be.revertedWith(ERR_VERIFICATION_FAILURE);
      });

      it('fails to mint when the signer cannot be proved to be a Hypemember', async () => {
        for (const [
          index,
          signer,
        ] of hypememberTier.verifiedSigners.entries()) {
          expect(
            hypeHaus
              .connect(signer)
              .mintHypemember(1, hypememberTier.proofs[index], {
                value: COMMUNITY_SALE_PRICE,
              }),
          ).to.not.be.revertedWith(ERR_VERIFICATION_FAILURE);
        }

        expect(
          hypeHaus
            .connect(unverifiedSigners[0])
            .mintHypemember(1, hypememberTier.proofs[0], {
              value: COMMUNITY_SALE_PRICE,
            }),
        ).to.be.revertedWith(ERR_VERIFICATION_FAILURE);
      });
    });
  });

  describe('Minting', () => {
    let tree: MerkleTree;
    let leaves: MerkleTreeLeaf[];
    let proofs: MerkleTreeProof[];
    let signers: SignerWithAddress[];

    beforeEach(async () => {
      signers = await ethers.getSigners().then((signers) => signers.slice(2));
      leaves = signers.slice(0, -1).map((s) => keccak256(s.address));
      tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
      proofs = leaves.map((l) => tree.getHexProof(l));
      expect(await hypeHaus.totalMinted()).to.eq(0);
    });

    async function expectSuccessfulCommunityMint(
      index: number,
      maxMintAmount: number,
      mintFn: (
        contract: HypeHaus,
        amount: number,
        proof: MerkleTreeProof,
        overrides: any,
      ) => Promise<ContractTransaction>,
    ) {
      const signer = signers[index];
      const proof = proofs[index];
      const previousTotal = await hypeHaus.totalMinted();

      const overrides = { value: COMMUNITY_SALE_PRICE.mul(maxMintAmount) };
      await expect(
        mintFn(hypeHaus.connect(signer), maxMintAmount, proof, overrides),
      ).to.emit(hypeHaus, 'Transfer');

      const currentTotal = await hypeHaus.totalMinted();
      const expectedTotal = previousTotal.add(maxMintAmount);
      expect(currentTotal).to.eq(expectedTotal);
    }

    describe('Community Sale', () => {
      beforeEach(async () => {
        await hypeHaus.setActiveSale(Sale.Community);
        await hypeHaus.setAlphaTierMerkleRoot(tree.getHexRoot());
        await hypeHaus.setHypelistTierMerkleRoot(tree.getHexRoot());
        await hypeHaus.setHypememberTierMerkleRoot(tree.getHexRoot());
      });

      it('mints a valid amount as an Alpha', async () => {
        for (
          let amount = 1, index = 0;
          amount <= MAX_TOKENS_PER_ALPHA_WALLET;
          amount++, index++
        ) {
          await expectSuccessfulCommunityMint(
            index,
            amount,
            (hypeHaus, amount, proof, overrides) =>
              hypeHaus.mintAlpha(amount, proof, overrides),
          );
        }
      });

      it('mints a valid amount as a Hypelister', async () => {
        for (
          let amount = 1, index = 0;
          amount <= MAX_TOKENS_PER_HYPELIST_WALLET;
          amount++, index++
        ) {
          await expectSuccessfulCommunityMint(
            index,
            amount,
            (hypeHaus, amount, proof, overrides) =>
              hypeHaus.mintHypelister(amount, proof, overrides),
          );
        }
      });

      it('mints a valid amount as a Hypemember', async () => {
        for (
          let amount = 1, index = 0;
          amount <= MAX_TOKENS_PER_HYPEMEMBER_WALLET;
          amount++, index++
        ) {
          await expectSuccessfulCommunityMint(
            index,
            amount,
            (hypeHaus, amount, proof, overrides) =>
              hypeHaus.mintHypemember(amount, proof, overrides),
          );
        }
      });
    });

    describe('Public Sale', () => {
      beforeEach(async () => {
        await hypeHaus.setActiveSale(Sale.Public);
      });

      it('mints a valid amount as a public member', async () => {
        for (
          let amount = 1, i = 0;
          amount <= MAX_TOKENS_PER_PUBLIC_WALLET;
          amount++, i++
        ) {
          const signer = signers[i];
          const previousTotal = await hypeHaus.totalMinted();
          const overrides = { value: PUBLIC_SALE_PRICE.mul(amount) };
          await expect(hypeHaus.connect(signer).mintPublic(amount, overrides))
            .to.emit(hypeHaus, 'Transfer')
            .withArgs(ethers.constants.AddressZero, signer.address, i);
          const currentTotal = await hypeHaus.totalMinted();
          const expectedTotal = previousTotal.add(amount);
          expect(currentTotal).to.eq(expectedTotal);
        }
      });
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
        .mintAlpha(
          MAX_TOKENS_PER_ALPHA_WALLET,
          alphaProof,
          communityMintOverrides,
        );

      await hypeHaus
        .connect(signers.u2)
        .mintHypelister(
          MAX_TOKENS_PER_HYPELIST_WALLET,
          hlProof,
          communityMintOverrides,
        );

      await hypeHaus
        .connect(signers.u3)
        .mintHypemember(
          MAX_TOKENS_PER_HYPEMEMBER_WALLET,
          hmProof,
          communityMintOverrides,
        );

      // Activate public sale
      await hypeHaus.setActiveSale(Sale.Public);
      await hypeHaus.connect(signers.u1).mintPublic(2, publicMintOverrides);
      await hypeHaus.connect(signers.u4).mintPublic(1, publicMintOverrides);

      // Test all token URIs
      await Promise.all(
        [...Array(8)].map(async (_, i) => {
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
      expect(await hypeHaus.ownerOf(7)).to.eq(addresses.u1);
      expect(await hypeHaus.ownerOf(8)).to.eq(addresses.u4);

      // Expect all token URIs to have changed when setting a new base token URI
      const newBaseTokenURI = 'test://zyx987/';
      await hypeHaus.setBaseTokenURI(newBaseTokenURI);
      await Promise.all(
        [...Array(8)].map(async (_, i) => {
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
        .mintPublic(1, { value: PUBLIC_SALE_PRICE });
      await hypeHaus
        .connect(signers.u2)
        .mintPublic(1, { value: PUBLIC_SALE_PRICE });

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
          .mintPublic(1, { value: PUBLIC_SALE_PRICE })
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
