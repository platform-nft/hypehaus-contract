import React from 'react';

import { AuthAccountContext, ConnectWalletPage, MintPage } from './components';
import { MaybeAuthAccount } from './models';

export default function App() {
  const [authAccount, setAuthAccount] = React.useState<MaybeAuthAccount>();

  return (
    <AuthAccountContext.Provider value={{ authAccount, setAuthAccount }}>
      <div className="flex h-screen">
        <div className="flex-col m-auto max-w-lg px-16 py-12 text-center space-y-4 rounded-xl border-2 border-primary-100">
          {authAccount ? (
            <MintPage authAccount={authAccount} />
          ) : (
            <ConnectWalletPage />
          )}
        </div>
      </div>
    </AuthAccountContext.Provider>
  );
}
