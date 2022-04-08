import React from 'react';
import { ConnectWalletPage, MintPage } from './components';

export default function App() {
  return (
    <div className="flex h-screen">
      <div className="flex-col m-auto max-w-lg px-16 py-12 text-center space-y-4 rounded-xl border-2 border-primary-100">
        {/* <ConnectWalletPage /> */}
        <MintPage />
      </div>
    </div>
  );
}
