import React from 'react';

import { GlobalContext } from './components';
import { MaybeAuthAccount, MintResult } from './models';
import { ConnectWalletPage, MintPage, SuccessfulMintPage } from './pages';

const { REACT_APP_VERSION } = process.env;

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
        <div className="flex flex-col max-w-lg m-auto py-16 px-12 text-center md:max-w-4xl md:rounded-xl md:border-2 md:border-primary-100">
          {mintResult.status === 'success' ? (
            <SuccessfulMintPage mintAmount={mintResult.mintAmount} />
          ) : authAccount ? (
            <MintPage authAccount={authAccount} />
          ) : (
            <ConnectWalletPage />
          )}
        </div>
        {REACT_APP_VERSION && (
          <p className="absolute top-4 right-4 text-gray-400 select-none">
            v{REACT_APP_VERSION}
          </p>
        )}
      </div>
    </GlobalContext.Provider>
  );
}
