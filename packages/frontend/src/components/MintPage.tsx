import React from 'react';
import Button from './Button';

import hero from '../assets/hero.png';

export default function MintPage() {
  return (
    <div className="space-y-4">
      <img
        src={hero}
        alt="Hero image"
        className="mx-auto aspect-square w-2/3 rounded-2xl"
      />
      <p>How many *HYPEHAUSes would you like to mint?</p>
      <div className="flex">
        <PriceInfo price="0.05" caption="ALLOW LIST" />
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
      <p className="text-3xl font-bold">{props.price} Ξ</p>
      <p className="text-xs text-gray-600">{props.caption}</p>
    </div>
  );
}

type NumberInputProps = {};

function NumberInput(props: NumberInputProps) {
  return (
    <div className="flex justify-center">
      <NumberInputButton>-</NumberInputButton>
      <input
        className="w-12 text-center border-y-2"
        type="number"
        value={1}
        min={1}
        max={3}
        step={1}
      />
      <NumberInputButton>+</NumberInputButton>
    </div>
  );
}

type NumberInputButtonProps = React.PropsWithChildren<{}>;

function NumberInputButton(props: NumberInputButtonProps) {
  return (
    <button
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
      ].join(' ')}>
      {props.children}
    </button>
  );
}
