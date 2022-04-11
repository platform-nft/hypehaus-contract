import { ethers } from 'ethers';

export type AuthAccount = {
  address: string;
  balance: ethers.BigNumber;
  network: ethers.providers.Network;
  provider: ethers.providers.Web3Provider;
};

export type MaybeAuthAccount = AuthAccount | undefined | null;
