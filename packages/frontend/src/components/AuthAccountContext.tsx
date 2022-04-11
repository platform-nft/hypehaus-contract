import React from 'react';
import { MaybeAuthAccount } from '../models';

export type AuthAccountContextOptions = {
  authAccount: MaybeAuthAccount;
  setAuthAccount: React.Dispatch<React.SetStateAction<MaybeAuthAccount>>;
};

const AuthAccountContext = React.createContext<AuthAccountContextOptions>(
  null as any,
);

export default AuthAccountContext;
