import React from 'react';
import { ethers } from 'ethers';

import { ReactComponent as MetaMaskLogo } from '../assets/metamask-fox.svg';
import { Button, GlobalContext, HeroImage } from '../components';
import { AsyncStatus, AuthAccount } from '../models';

export default function ConnectWalletPage() {
  return (
    <div className="space-y-4 max-w-xs">
      <HeroImage />
      <h1 className="text-3xl font-bold">Mint *HYPEHAUS</h1>
      <p>Get started by connecting your MetaMask wallet below</p>
      <ConnectWalletButton />
    </div>
  );
}

type Connection = AsyncStatus<AuthAccount>;

function ConnectWalletButton() {
  const { setAuthAccount } = React.useContext(GlobalContext);

  const [connection, setConnection] = React.useState<Connection>({
    status: 'idle',
  });

  const isLoading = React.useMemo(() => {
    return connection.status === 'pending';
  }, [connection.status]);

  React.useEffect(() => {
    if (connection.status === 'success') {
      setAuthAccount(connection.payload);
    }
  }, [connection]);

  const handleConnectWallet = async () => {
    setConnection({ status: 'pending' });

    if (!window.ethereum) {
      setConnection({
        status: 'failed',
        reason: `Please install the MetaMask extension in your browser or visit this webpage in the MetaMask app.`,
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

      setConnection({ status: 'success', payload: authAccount });
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

  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        loading={isLoading}
        loadingText="Connecting…"
        onClick={handleConnectWallet}>
        <MetaMaskLogo className="h-6 aspect-square mr-1.5" />
        <p>Connect MetaMask</p>
      </Button>
      {connection.status === 'failed' && (
        <p className="text-sm text-error-500">
          Failed to connect: {connection.reason}
        </p>
      )}
    </div>
  );
}
