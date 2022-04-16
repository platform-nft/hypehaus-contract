import React from 'react';

import { GlobalContext } from './components';
import { MaybeAuthAccount, MintResult } from './models';
import { ConnectWalletPage, MintPage, SuccessfulMintPage } from './pages';

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
      <div className="flex flex-col h-screen md:mx-12">
        <div className="flex-col max-w-lg space-y-4 py-16 px-12 text-center m-auto md:max-w-4xl md:rounded-xl md:border-2 md:border-primary-100">
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
