import React from 'react';
import { ethers } from 'ethers';
import { getApp } from 'firebase/app';
import {
  collection,
  connectFirestoreEmulator,
  doc,
  getDoc,
  getFirestore,
} from 'firebase/firestore';

// import { HypeHausSale } from '@platform/backend/shared';
import { HypeHaus } from '@platform/backend/typechain-types/HypeHaus';
import HypeHausJson from '@platform/backend/artifacts/contracts/HypeHaus.sol/HypeHaus.json';

import { AsyncStatus, AuthAccount, IDLE } from '../models';
import Button from './Button';
import GlobalContext from './GlobalContext';
import HeroImage from './HeroImage';
import NumberInput, { NumberInputContext } from './NumberInput';

enum HypeHausSale {
  Inactive = 0,
  Community = 1,
  Public = 2,
}

const { REACT_APP_CONTRACT_ADDRESS, REACT_APP_FIREBASE_FUNCTIONS_BASE_URI } =
  process.env;

const firestore = getFirestore(getApp());
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(firestore, 'localhost', 8080);
}

const MintAmountContext = React.createContext<{
  mintAmount: number;
  setMintAmount: React.Dispatch<React.SetStateAction<number>>;
}>(null as any);

type MintTier = 'alpha' | 'hypelister' | 'hypemember' | 'public';
type MintTierStatus = AsyncStatus<MintTier>;

type HypeHausProperties = {
  activeSale: HypeHausSale;
  communitySalePrice: ethers.BigNumber;
  publicSalePrice: ethers.BigNumber;
  maxMintAlpha: number;
  maxMintHypelister: number;
  maxMintHypemember: number;
  maxMintPublic: number;
};

async function getTierForAddress(address: string): Promise<MintTier> {
  try {
    const allWalletsRef = collection(firestore, 'wallets');
    const walletRef = doc(allWalletsRef, address);
    const walletData = await getDoc(walletRef).then((doc) => doc.data());
    if (!walletData) return 'public';
    return walletData['tier'];
  } catch (error) {
    console.error('Tier for address could not be found:', error);
    return 'public';
  }
}

type MintPageProps = {
  authAccount: AuthAccount;
};

export default function MintPage({ authAccount }: MintPageProps) {
  const {} = React.useContext(GlobalContext);

  const [mintAmount, setMintAmount] = React.useState(1);

  const [mintTierStatus, setMintTierStatus] =
    React.useState<MintTierStatus>(IDLE);

  const [isSyncing, setIsSyncing] = React.useState(false);
  const [properties, setProperties] = React.useState<HypeHausProperties>({
    activeSale: HypeHausSale.Inactive,
    communitySalePrice: ethers.utils.parseEther('0.05'),
    publicSalePrice: ethers.utils.parseEther('0.08'),
    maxMintAlpha: 3,
    maxMintHypelister: 2,
    maxMintHypemember: 1,
    maxMintPublic: 2,
  });

  const hypeHaus = React.useMemo(() => {
    if (
      !REACT_APP_CONTRACT_ADDRESS ||
      !ethers.utils.isAddress(REACT_APP_CONTRACT_ADDRESS)
    ) {
      console.error('The contract address is not valid!');
      return undefined;
    }

    const minterAddress = authAccount.address;
    const minter = authAccount.provider.getSigner(minterAddress);

    return new ethers.Contract(
      REACT_APP_CONTRACT_ADDRESS,
      HypeHausJson.abi,
      minter,
    ) as HypeHaus;
  }, [authAccount]);

  const isInitializing = React.useMemo(() => {
    return !hypeHaus || mintTierStatus.status === 'pending' || isSyncing;
  }, [hypeHaus, mintTierStatus, isSyncing]);

  const isDisabled = React.useMemo(() => {
    // The sale is closed
    if (properties.activeSale === HypeHausSale.Inactive) return true;

    const mintTier =
      mintTierStatus.status === 'success' ? mintTierStatus.payload : 'public';

    // Community sale is on and user is not from the community
    return (
      properties.activeSale === HypeHausSale.Community && mintTier === 'public'
    );
  }, [mintTierStatus, properties.activeSale]);

  React.useEffect(() => {
    getTierForAddress(authAccount.address).then((tier) =>
      setMintTierStatus({ status: 'success', payload: tier }),
    );
  }, [authAccount]);

  React.useEffect(() => {
    if (!hypeHaus) return;
    (async () => {
      try {
        setIsSyncing(true);
        const [
          activeSale,
          communitySalePrice,
          publicSalePrice,
          maxMintAlpha,
          maxMintHypelister,
          maxMintHypemember,
          maxMintPublic,
        ] = await Promise.all([
          hypeHaus.activeSale(),
          hypeHaus.communitySalePrice(),
          hypeHaus.publicSalePrice(),
          hypeHaus.maxMintAlpha(),
          hypeHaus.maxMintHypelister(),
          hypeHaus.maxMintHypemember(),
          hypeHaus.maxMintPublic(),
        ]);
        setProperties({
          activeSale,
          communitySalePrice,
          publicSalePrice,
          maxMintAlpha,
          maxMintHypelister,
          maxMintHypemember,
          maxMintPublic,
        });
      } catch (_) {
        // Do nothing
      } finally {
        setIsSyncing(false);
      }
    })();
  }, [hypeHaus]);

  const personalMintMax = React.useMemo(() => {
    if (mintTierStatus.status !== 'success') return properties.maxMintPublic;
    switch (mintTierStatus.payload) {
      case 'alpha':
        return properties.maxMintAlpha;
      case 'hypelister':
        return properties.maxMintHypelister;
      case 'hypemember':
        return properties.maxMintHypemember;
      default:
        return properties.maxMintPublic;
    }
  }, [mintTierStatus, properties]);

  const handleClickMint = React.useCallback(async () => {
    if (!hypeHaus) return;
    console.log('MINT!');
  }, [hypeHaus]);

  return (
    <MintAmountContext.Provider value={{ mintAmount, setMintAmount }}>
      <div className="space-y-4">
        <HeroImage />
        <AuthAccountDetails
          authAccount={authAccount}
          mintTier={
            mintTierStatus.status === 'success'
              ? mintTierStatus.payload
              : undefined
          }
        />
        <p className="flex-1">How many *HYPEHAUSes would you like to mint?</p>
        <PriceInfoTable {...properties} />
        <NumberInputContext.Provider
          value={{ value: mintAmount, setValue: setMintAmount }}>
          <NumberInput disabled={isDisabled} min={1} max={personalMintMax} />
        </NumberInputContext.Provider>
        <Button
          disabled={isDisabled}
          loading={isInitializing}
          onClick={handleClickMint}>
          {isDisabled ? "Sorry, you can't mint now!" : 'Mint *HYPEHAUS'}
        </Button>
      </div>
    </MintAmountContext.Provider>
  );
}

type AuthAccountDetailsProps = {
  authAccount: AuthAccount;
  mintTier?: MintTier | undefined;
};

function AuthAccountDetails({
  authAccount,
  mintTier = 'public',
}: AuthAccountDetailsProps) {
  const tooLowBalance = React.useMemo(() => {
    return authAccount.balance.lt(ethers.utils.parseEther('0.05'));
  }, [authAccount.balance]);

  const formattedBalance = React.useMemo(() => {
    const remainder = authAccount.balance.mod(
      ethers.BigNumber.from(10).pow(16),
    );
    return ethers.utils.formatEther(authAccount.balance.sub(remainder));
  }, [authAccount.balance]);

  return (
    <div
      className={[
        'flex',
        'items-center',
        'justify-center',
        'p-2',
        'w-fit',
        'mx-auto',
        'rounded-full',
        'font-semibold',
        'text-sm',
        'text-center',
        'font-mono',
        'text-gray-700',
        'bg-gray-200',
      ].join(' ')}>
      <table className="table-fixed w-full border-collapse">
        <tbody>
          <tr>
            <td className="border-r-2 border-gray-300">
              <p
                className={[
                  mintTier !== 'public' ? 'text-primary-500' : '',
                ].join(' ')}>
                {mintTier.toUpperCase()}
              </p>
            </td>
            <td className="border-r-2 border-gray-300">
              <p>{authAccount.address.slice(0, 9)}</p>
            </td>
            <td>
              <p className={[tooLowBalance ? 'text-error-600' : ''].join(' ')}>
                {formattedBalance} Ξ
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

type PriceInfoTableProps = {
  activeSale: HypeHausSale;
  communitySalePrice: ethers.BigNumber;
  publicSalePrice: ethers.BigNumber;
};

function PriceInfoTable(props: PriceInfoTableProps) {
  const [formattedCommunityPrice, formattedPublicPrice] = React.useMemo(() => {
    return [
      ethers.utils.formatEther(props.communitySalePrice),
      ethers.utils.formatEther(props.publicSalePrice),
    ] as const;
  }, [props]);

  return (
    <table className="table-fixed w-full border-collapse">
      <tbody>
        <tr>
          <td className="border-r-2">
            <PriceInfoItem
              selected={props.activeSale === HypeHausSale.Community}
              price={formattedCommunityPrice}
              caption="PRESALE"
            />
          </td>
          <td>
            <PriceInfoItem
              selected={props.activeSale === HypeHausSale.Public}
              price={formattedPublicPrice}
              caption="PUBLIC"
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

type PriceInfoItemProps = {
  price: string;
  caption: string;
  selected?: boolean;
};

function PriceInfoItem(props: PriceInfoItemProps) {
  return (
    <div
      className={[
        'relative space-y-1 py-4',
        props.selected ? 'bg-primary-100' : '',
      ].join(' ')}>
      {props.selected && (
        <div className="absolute px-3 rounded-md translate-x-[-0.8rem] translate-y-[-0.5rem] rotate-[-35deg] bg-primary-600">
          <p className="text-gray-50 font-semibold select-none">ACTIVE</p>
        </div>
      )}
      <p className="text-3xl sm:text-4xl font-bold">{props.price} Ξ</p>
      <p className="text-xs text-gray-600">{props.caption}</p>
    </div>
  );
}
