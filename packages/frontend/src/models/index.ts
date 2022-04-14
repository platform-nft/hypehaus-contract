import { ethers } from 'ethers';

export type AsyncStatus<T> =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'success'; payload: T }
  | { status: 'failed'; reason: string };

export const IDLE: AsyncStatus<any> = { status: 'idle' };

export type AuthAccount = {
  address: string;
  balance: ethers.BigNumber;
  network: ethers.providers.Network;
  provider: ethers.providers.Web3Provider;
};

export type MaybeAuthAccount = AuthAccount | undefined | null;

export type MintResult =
  | { status: 'pending' }
  | { status: 'success'; mintAmount: number };
