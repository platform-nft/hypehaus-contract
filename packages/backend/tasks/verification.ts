import { task, types } from 'hardhat/config';

import * as utils from './utils';

const HH_SET_MERKLE_ROOTS = 'hypehaus:set-merkle';

type SetMerkleRootActionType = utils.OptionalContractActionType & {
  alpha?: string;
  hypelister?: string;
  hypemember?: string;
};

task(HH_SET_MERKLE_ROOTS, 'Sets the merkle roots for all tiers')
  .addOptionalParam<string>(
    'contract',
    'The address of the HYPEHAUS contract to connect to',
    undefined,
    types.string,
  )
  .addOptionalParam<string>(
    'alpha',
    'Merkle root for the ALPHA tier',
    undefined,
    types.string,
  )
  .addOptionalParam<string>(
    'hypelister',
    'Merkle root for the HYPELISTER tier',
    undefined,
    types.string,
  )
  .addOptionalParam<string>(
    'hypemember',
    'Merkle root for the HYPEMEMBER tier',
    undefined,
    types.string,
  )
  .setAction(
    async (
      {
        contract,
        alpha: alphaMerkleRoot,
        hypelister: hypelisterMerkleRoot,
        hypemember: hypememberMerkleRoot,
      }: SetMerkleRootActionType,
      hre,
    ) => {
      const hypeHaus = await utils.connectToContract(hre, contract);

      if (alphaMerkleRoot) {
        console.log('Setting merkle root for ALPHA:', alphaMerkleRoot);
        await hypeHaus.setAlphaMerkleRoot(alphaMerkleRoot);
      }

      if (hypelisterMerkleRoot) {
        console.log(
          'Setting merkle root for HYPELISTER:',
          hypelisterMerkleRoot,
        );
        await hypeHaus.setHypelisterMerkleRoot(hypelisterMerkleRoot);
      }

      if (hypememberMerkleRoot) {
        console.log(
          'Setting merkle root for HYPEMEMBER:',
          hypememberMerkleRoot,
        );
        await hypeHaus.setHypememberMerkleRoot(hypememberMerkleRoot);
      }

      console.log('Successfully set merkle roots for all tiers!');
    },
  );
