import React from 'react';
import { MaybeAuthAccount, MintResult } from '../models';

export type GlobalContextOptions = {
  authAccount: MaybeAuthAccount;
  setAuthAccount: React.Dispatch<React.SetStateAction<MaybeAuthAccount>>;
  setMintResult: React.Dispatch<React.SetStateAction<MintResult>>;
};

const GlobalContext = React.createContext<GlobalContextOptions>(null as any);

export default GlobalContext;
