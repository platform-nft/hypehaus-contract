import React from 'react';
import { ethers } from 'ethers';

import { AuthAccount } from '../models';
import hero from '../assets/hero.png';
import { ReactComponent as MetaMaskLogo } from '../assets/metamask-fox.svg';

import Button from './Button';
import AuthAccountContext from './AuthAccountContext';

export default function ConnectWalletPage() {
  return (
    <div className="space-y-4">
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

type Connection =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'success'; account: AuthAccount }
  | { status: 'failed'; reason: string };

function ConnectWalletButton() {
  const { setAuthAccount } = React.useContext(AuthAccountContext);

  const [connection, setConnection] = React.useState<Connection>({
    status: 'idle',
  });

  const handleConnectWallet = async () => {
    setConnection({ status: 'pending' });
    if (!window.ethereum) {
      setConnection({
        status: 'failed',
        reason: 'Please install the MetaMask extension on your browser',
      });
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const [address] = await provider.send('eth_requestAccounts', []);
      const authAccount: AuthAccount = {
        address,
        provider,
        balance: await provider.getBalance(address),
        network: await provider.getNetwork(),
      };

      if (!ethers.utils.isAddress(address)) {
        throw new Error(`Invalid address provided: '${address}'`);
      }

      setConnection({ status: 'success', account: authAccount });
      setAuthAccount(authAccount);
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
          {connection.status === 'pending' ? 'Connecting…' : 'Connect MetaMask'}
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
