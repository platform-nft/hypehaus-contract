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
  totalMinted: ethers.BigNumber;
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
    if (!walletData || !walletData['tier']) return 'public';
    return walletData['tier'];
  } catch (error) {
    console.error('Tier for address could not be found:', error);
    return 'public';
  }
}

async function mintHypeHaus(
  contract: HypeHaus,
  authAccount: AuthAccount,
  mintTier: MintTier,
  mintAmount: number,
  { publicSalePrice, communitySalePrice }: HypeHausProperties,
) {
  if (mintTier === 'public') {
    const ethToPay = publicSalePrice.mul(mintAmount);
    await contract.mintPublic(mintAmount, { value: ethToPay });
    console.log({ mintTier, ethToPay });
    return;
  }

  let verificationBaseURI: string;
  if (
    process.env.NODE_ENV === 'development' ||
    !REACT_APP_FIREBASE_FUNCTIONS_BASE_URI
  ) {
    verificationBaseURI = `http://localhost:5001/hypehaus-nft/us-central1`;
  } else {
    verificationBaseURI = `https://${REACT_APP_FIREBASE_FUNCTIONS_BASE_URI}`;
  }

  const minterAddress = authAccount.address;
  const fetchURL = `${verificationBaseURI}/api/merkle-proof/${mintTier}/${minterAddress}`;
  const response = await fetch(fetchURL, { method: 'GET' });
  const merkleProof = await response.json();
  const ethToPay = communitySalePrice.mul(mintAmount);

  console.log({ mintTier, merkleProof, ethToPay });

  if (mintTier === 'alpha') {
    await contract.mintAlpha(mintAmount, merkleProof, { value: ethToPay });
  } else if (mintTier === 'hypelister') {
    await contract.mintHypelister(mintAmount, merkleProof, { value: ethToPay });
  } else if (mintTier === 'hypemember') {
    await contract.mintHypemember(mintAmount, merkleProof, { value: ethToPay });
  }
}

type MintPageProps = {
  authAccount: AuthAccount;
};

export default function MintPage({ authAccount }: MintPageProps) {
  const { setMintResult } = React.useContext(GlobalContext);

  const [isMinting, setIsMinting] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const [mintAmount, setMintAmount] = React.useState(1);
  const [mintTierStatus, setMintTierStatus] =
    React.useState<MintTierStatus>(IDLE);

  const [isSyncing, setIsSyncing] = React.useState(false);
  const [properties, setProperties] = React.useState<HypeHausProperties>({
    activeSale: HypeHausSale.Inactive,
    communitySalePrice: ethers.utils.parseEther('0.05'),
    publicSalePrice: ethers.utils.parseEther('0.08'),
    totalMinted: ethers.BigNumber.from(0),
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

    const hypeHaus = new ethers.Contract(
      REACT_APP_CONTRACT_ADDRESS,
      HypeHausJson.abi,
      authAccount.provider,
    ) as HypeHaus;

    const minter = authAccount.provider.getSigner(authAccount.address);
    return hypeHaus.connect(minter);
  }, [authAccount]);

  const isInitializing = React.useMemo(() => {
    return !hypeHaus || mintTierStatus.status === 'pending';
  }, [hypeHaus, mintTierStatus, isSyncing, isMinting]);

  const isLoading = React.useMemo(() => {
    return isSyncing || isMinting;
  }, [isSyncing, isMinting]);

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
    getTierForAddress(authAccount.address.toLowerCase()).then((tier) => {
      setMintTierStatus({ status: 'success', payload: tier });
    });
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
          totalMinted,
          maxMintAlpha,
          maxMintHypelister,
          maxMintHypemember,
          maxMintPublic,
        ] = await Promise.all([
          hypeHaus.activeSale(),
          hypeHaus.communitySalePrice(),
          hypeHaus.publicSalePrice(),
          hypeHaus.totalMinted(),
          hypeHaus.maxMintAlpha(),
          hypeHaus.maxMintHypelister(),
          hypeHaus.maxMintHypemember(),
          hypeHaus.maxMintPublic(),
        ]);
        setProperties({
          activeSale,
          communitySalePrice,
          publicSalePrice,
          totalMinted,
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
    if (properties.activeSale !== HypeHausSale.Community) {
      return properties.maxMintPublic;
    }

    if (mintTierStatus.status !== 'success') {
      return properties.maxMintPublic;
    }

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
    if (!hypeHaus || mintTierStatus.status !== 'success') return;
    try {
      setIsMinting(true);
      await mintHypeHaus(
        hypeHaus,
        authAccount,
        mintTierStatus.payload,
        mintAmount,
        properties,
      );
      setMintResult({ status: 'success', mintAmount });
    } catch (error: any) {
      let reason: string;
      const errorMessage: string = error.data?.message || error.message;

      if (!errorMessage) {
        reason = `An unknown error occurred. Please try again later. (Error ${
          error.code || 'UNKNOWN'
        })`;
        console.error('An unknown error occurred:', error);
      }

      if (errorMessage.includes('HH_ALREADY_CLAIMED')) {
        reason = `Sorry, you've already claimed one or more *HYPEHAUSes!`;
      } else if (errorMessage.includes('HH_COMMUNITY_SALE_NOT_ACTIVE')) {
        reason = 'Sorry, the community sale is not open yet! Come back later.';
      } else if (errorMessage.includes('HH_INSUFFICIENT_FUNDS')) {
        reason = `You don't have enough ETH to mint!`;
      } else if (errorMessage.includes('HH_INVALID_MINT_AMOUNT')) {
        reason = 'You provided an invalid amount to mint! Please try again.';
      } else if (errorMessage.includes('HH_PUBLIC_SALE_NOT_ACTIVE')) {
        reason = 'Sorry, the public sale is not open yet! Come back later.';
      } else if (errorMessage.includes('HH_SUPPLY_EXHAUSTED')) {
        reason = 'Sorry, there are no more *HYPEHAUS left to mint!';
      } else if (errorMessage.includes('HH_VERIFICATION_FAILURE')) {
        reason = `You don't seem to be in the allow list. Come back later for the public sale.`;
      } else {
        reason = errorMessage;
      }

      setError(reason);
    } finally {
      setIsMinting(false);
    }
  }, [hypeHaus, authAccount, mintTierStatus, mintAmount, properties]);

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
          <NumberInput
            disabled={isDisabled || isLoading}
            min={1}
            max={personalMintMax}
          />
        </NumberInputContext.Provider>
        <Button
          disabled={isDisabled || isLoading}
          loading={isInitializing || isLoading}
          loadingText={isMinting ? 'Minting…' : ''}
          onClick={handleClickMint}>
          {isDisabled ? "Sorry, you can't mint now!" : 'Mint *HYPEHAUS'}
        </Button>
        {error && <p className="font-medium text-sm text-error-500">{error}</p>}
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
              <p>{authAccount.address.slice(0, 9)}</p>
            </td>
            <td className="border-r-2 border-gray-300">
              <p
                className={[
                  mintTier !== 'public' ? 'text-primary-500' : '',
                ].join(' ')}>
                {mintTier.toUpperCase()}
              </p>
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
