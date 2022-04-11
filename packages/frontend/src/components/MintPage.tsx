import React from 'react';

import Button from './Button';
import hero from '../assets/hero.png';
import { AuthAccount } from '../models';
import { ReactComponent as MetaMaskLogo } from '../assets/metamask-fox.svg';

const MIN_MINT_AMOUNT = 1;
const MAX_MINT_AMOUNT = 3;

type MintPageProps = {
  authAccount: AuthAccount;
};

export default function MintPage({ authAccount }: MintPageProps) {
  // React.useEffect(() => {
  //   console.log(authAccount);
  // }, [authAccount]);

  return (
    <div className="space-y-4">
      <img
        src={hero}
        alt="Hero image"
        className="mx-auto aspect-square w-2/3 rounded-2xl"
      />
      <div className="flex items-center justify-center pt-2 pb-2 pl-4 pr-4 w-40 mx-auto rounded-full bg-gray-200">
        <MetaMaskLogo className="h-6 mr-1" />
        <p className="font-semibold text-sm truncate text-gray-700">
          {authAccount.address.slice(0, 9)}
        </p>
      </div>
      <p>How many *HYPEHAUSes would you like to mint?</p>
      <div className="flex">
        <PriceInfo price="0.05" caption="PRESALE" />
        <PriceInfo price="0.08" caption="PUBLIC" />
      </div>
      <NumberInput />
      <Button>Mint *HYPEHAUS</Button>
    </div>
  );
}

type PriceInfoProps = {
  price: string;
  caption: string;
};

function PriceInfo(props: PriceInfoProps) {
  return (
    <div className="flex-col flex-1 space-y-1 first:border-r-2">
      <p className="text-4xl font-bold">{props.price} Ξ</p>
      <p className="text-xs text-gray-600">{props.caption}</p>
    </div>
  );
}

type NumberInputProps = {};

function NumberInput(_: NumberInputProps) {
  const [value, setValue] = React.useState(1);

  const handleChange = (input: string) => {
    try {
      const number = Number.parseInt(input);
      setValue(Math.max(MIN_MINT_AMOUNT, Math.min(number, MAX_MINT_AMOUNT)));
    } catch (error) {
      console.error('Failed to parse integer:', error);
    }
  };

  const handleClickDecrement = () => {
    setValue((prev) => Math.max(MIN_MINT_AMOUNT, prev - 1));
  };

  const handleClickIncrement = () => {
    setValue((prev) => Math.min(MAX_MINT_AMOUNT, prev + 1));
  };

  return (
    <div className="flex justify-center">
      <NumberInputButton
        disabled={value === MIN_MINT_AMOUNT}
        onClick={handleClickDecrement}>
        -
      </NumberInputButton>
      <input
        className="w-12 text-center border-y-2"
        type="number"
        step={1}
        min={MIN_MINT_AMOUNT}
        max={MAX_MINT_AMOUNT}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
      <NumberInputButton
        disabled={value === MAX_MINT_AMOUNT}
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
