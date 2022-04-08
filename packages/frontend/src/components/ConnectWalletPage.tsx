import React from 'react';
import { ethers } from 'ethers';

import Button from './Button';
import hero from '../assets/hero.png';
import { ReactComponent as MetaMaskLogo } from '../assets/metamask-fox.svg';

declare let window: any;

export default function ConnectWalletPage() {
  return (
    <div className="flex-col m-auto max-w-lg px-16 py-12 text-center space-y-4 rounded-xl border-2 border-primary-100">
      <img
        src={hero}
        alt="Hero image"
        className="mx-auto aspect-square w-2/3 rounded-2xl"
      />
      <h1 className="text-3xl font-bold">Mint *HYPEHAUS</h1>
      <p>To mint, connect your MetaMask wallet below</p>
      <ConnectWalletButton />
    </div>
  );
}

type Account = {
  address: string;
  balance: ethers.BigNumber;
};

type Connection =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'success'; network: ethers.providers.Network; account: Account }
  | { status: 'failed'; reason: string };

function ConnectWalletButton() {
  const [connection, setConnection] = React.useState<Connection>({
    status: 'idle',
  });

  const handleConnectWallet = async () => {
    setConnection({ status: 'pending' });
    if (!window.ethereum) {
      setConnection({
        status: 'failed',
        reason: 'Your browser does not support Web3',
      });
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const [account] = await provider.send('eth_requestAccounts', []);
      setConnection({
        status: 'success',
        network: await provider.getNetwork(),
        account: {
          address: account,
          balance: await provider.getBalance(account),
        },
      });
    } catch (error: any) {
      // User cancelled request
      if (error.code === 4001) {
        setConnection({ status: 'idle' });
      } else {
        setConnection({
          status: 'failed',
          reason: error.message || String(error),
        });
      }
    }
  };

  React.useEffect(() => {
    if (connection.status === 'success') {
      console.log(connection);
    }
  }, [connection]);

  return (
    <div className="space-y-2">
      <Button
        disabled={connection.status === 'pending'}
        onClick={handleConnectWallet}>
        <div className="flex flex-row">
          <MetaMaskLogo
            className={[
              'h-6',
              'aspect-square',
              'mr-1.5',
              connection.status === 'pending' ? 'grayscale' : '',
            ].join(' ')}
          />
          Connect MetaMask
        </div>
      </Button>
      {connection.status === 'failed' && (
        <p className="text-sm text-error-500">
          Failed to connect: {connection.reason}
        </p>
      )}
    </div>
  );
}
