import React from 'react';
import { ethers } from 'ethers';
// import { HypeHausErrorCode } from '@platform/backend/shared';
import { HypeHaus } from '@platform/backend/typechain-types/HypeHaus';
import HypeHausJson from '@platform/backend/artifacts/contracts/HypeHaus.sol/HypeHaus.json';

import Button from './Button';
import hero from '../assets/hero.png';
import { AsyncStatus, AuthAccount } from '../models';

const { REACT_APP_CONTRACT_ADDRESS } = process.env;

const IS_PUBLIC_SALE_ACTIVE = true;
const SALE_PRICE_COMMUNITY = '0.05';
const SALE_PRICE_PUBLIC = '0.08';
const MIN_MINT_AMOUNT = 1;
const MAX_MINT_AMOUNT = IS_PUBLIC_SALE_ACTIVE ? 2 : 3;

const MintAmountContext = React.createContext<{
  mintAmount: number;
  setMintAmount: React.Dispatch<React.SetStateAction<number>>;
}>(null as any);

type MintStatus = AsyncStatus<undefined>;

type MintPageProps = {
  authAccount: AuthAccount;
};

export default function MintPage({ authAccount }: MintPageProps) {
  const [mintAmount, setMintAmount] = React.useState(1);
  const [mintStatus, setMintStatus] = React.useState<MintStatus>({
    status: 'idle',
  });

  const isPending = React.useMemo(() => {
    return mintStatus.status === 'pending';
  }, [mintStatus]);

  const tooLowBalance = React.useMemo(() => {
    return authAccount.balance.lt(ethers.utils.parseEther('0.05'));
  }, [authAccount.balance]);

  const formattedBalance = React.useMemo(() => {
    const remainder = authAccount.balance.mod(
      ethers.BigNumber.from(10).pow(16),
    );
    return ethers.utils.formatEther(authAccount.balance.sub(remainder));
  }, [authAccount.balance]);

  const mintButtonText = React.useMemo(() => {
    if (mintAmount === 1) {
      return 'Mint 1 *HYPEHAUS';
    } else {
      return `Mint ${mintAmount} *HYPEHAUSes`;
    }
  }, [mintAmount]);

  const handleClickMint = async () => {
    try {
      setMintStatus({ status: 'pending' });

      console.log({ REACT_APP_CONTRACT_ADDRESS });
      if (!REACT_APP_CONTRACT_ADDRESS) {
        throw new Error('Internal error: The contract address is not valid.');
      }

      const signer = authAccount.provider.getSigner(authAccount.address);
      const hypeHaus = new ethers.Contract(
        REACT_APP_CONTRACT_ADDRESS,
        HypeHausJson.abi,
        signer,
      ) as HypeHaus;

      const publicSalePrice = await hypeHaus.publicSalePrice();
      await hypeHaus.mintPublic(mintAmount, {
        value: publicSalePrice.mul(mintAmount),
      });

      setMintStatus({ status: 'success', payload: undefined });
    } catch (error: any) {
      let reason: string;
      const errorMessage: string = error.data?.message || error.message;

      if (!errorMessage) {
        reason = `An unknown error occurred. Please try again later. (Error ${
          error.code || 'UNKNOWN'
        })`;
        console.error('An unknown error occurred:', error);
      }

      if (errorMessage.includes('HH_ADDRESS_ALREADY_CLAIMED')) {
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

      setMintStatus({ status: 'failed', reason });
    }
  };

  return (
    <MintAmountContext.Provider value={{ mintAmount, setMintAmount }}>
      <div className="space-y-4">
        <img
          src={hero}
          alt="*HYPEHAUS"
          className="mx-auto aspect-square w-2/3 rounded-2xl"
        />
        <div
          className={[
            'flex',
            'items-center',
            'justify-center',
            'p-2',
            'w-56',
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
                <td>
                  <p
                    className={[tooLowBalance ? 'text-error-600' : ''].join(
                      ' ',
                    )}>
                    {formattedBalance} Ξ
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="flex-1">How many *HYPEHAUSes would you like to mint?</p>
        <table className="table-fixed w-full border-collapse">
          <tbody>
            <tr>
              <td className="border-r-2">
                <PriceInfo price={SALE_PRICE_COMMUNITY} caption="PRESALE" />
              </td>
              <td>
                <PriceInfo price={SALE_PRICE_PUBLIC} caption="PUBLIC" />
              </td>
            </tr>
          </tbody>
        </table>
        <NumberInput disabled={isPending} />
        <Button disabled={isPending} onClick={handleClickMint}>
          {isPending ? 'Minting…' : mintButtonText}
        </Button>
        {mintStatus.status === 'failed' && (
          <p className="font-medium text-sm text-error-500">
            {mintStatus.reason}
          </p>
        )}
      </div>
    </MintAmountContext.Provider>
  );
}

type PriceInfoProps = {
  price: string;
  caption: string;
};

function PriceInfo(props: PriceInfoProps) {
  return (
    <div className="space-y-1">
      <p className="text-4xl font-bold">{props.price} Ξ</p>
      <p className="text-xs text-gray-600">{props.caption}</p>
    </div>
  );
}

type NumberInputProps = {
  disabled?: boolean;
};

function NumberInput({ disabled }: NumberInputProps) {
  const { mintAmount, setMintAmount } = React.useContext(MintAmountContext);

  const handleChange = (input: string) => {
    try {
      const number = Number.parseInt(input);
      setMintAmount(
        Math.max(MIN_MINT_AMOUNT, Math.min(number, MAX_MINT_AMOUNT)),
      );
    } catch (error) {
      console.error('Failed to parse integer:', error);
    }
  };

  const handleClickDecrement = () => {
    setMintAmount((prev) => Math.max(MIN_MINT_AMOUNT, prev - 1));
  };

  const handleClickIncrement = () => {
    setMintAmount((prev) => Math.min(MAX_MINT_AMOUNT, prev + 1));
  };

  return (
    <div className="flex justify-center">
      <NumberInputButton
        disabled={disabled || mintAmount === MIN_MINT_AMOUNT}
        onClick={handleClickDecrement}>
        -
      </NumberInputButton>
      <input
        className="w-12 text-center border-y-2"
        disabled={disabled}
        type="number"
        step={1}
        min={MIN_MINT_AMOUNT}
        max={MAX_MINT_AMOUNT}
        value={mintAmount}
        onChange={(e) => handleChange(e.target.value)}
      />
      <NumberInputButton
        disabled={disabled || mintAmount === MAX_MINT_AMOUNT}
        onClick={handleClickIncrement}>
        +
      </NumberInputButton>
    </div>
  );
}

type NumberInputButtonProps = React.PropsWithChildren<{
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}>;

function NumberInputButton(props: NumberInputButtonProps) {
  return (
    <button
      {...props}
      className={[
        'w-12',
        'h-12',
        'font-bold',
        'border-2',
        'text-center',
        'select-none',
        'first:rounded-l-md',
        'last:rounded-r-md',
        'border-primary-200',
        'bg-primary-100',
        'disabled:text-gray-400',
        'disabled:border-gray-200',
        'disabled:bg-gray-100',
      ].join(' ')}>
      {props.children}
    </button>
  );
}
