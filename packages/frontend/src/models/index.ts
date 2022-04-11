import { ethers } from 'ethers';

export type AuthAccount = {
  address: string;
  balance: ethers.BigNumber;
  network: ethers.providers.Network;
};

export type MaybeAuthAccount = AuthAccount | undefined | null;
