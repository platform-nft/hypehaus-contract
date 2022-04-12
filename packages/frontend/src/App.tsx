import React from 'react';

import {
  ConnectWalletPage,
  GlobalContext,
  MintPage,
  SuccessfulMintPage,
} from './components';
import { MaybeAuthAccount, MintResult } from './models';

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function App() {
  const [authAccount, setAuthAccount] = React.useState<MaybeAuthAccount>();
  const [mintResult, setMintResult] = React.useState<MintResult>({
    status: 'pending',
  });

  return (
    <GlobalContext.Provider
      value={{ authAccount, setAuthAccount, setMintResult }}>
      <div className="flex flex-col h-screen">
        <div className="flex-col w-full space-y-4 p-16 text-center m-auto sm:max-w-lg sm:rounded-xl sm:border-2 sm:border-primary-100">
          {mintResult.status === 'success' ? (
            <SuccessfulMintPage mintAmount={mintResult.mintAmount} />
          ) : authAccount ? (
            <MintPage authAccount={authAccount} />
          ) : (
            <ConnectWalletPage />
          )}
        </div>
      </div>
    </GlobalContext.Provider>
  );
}
