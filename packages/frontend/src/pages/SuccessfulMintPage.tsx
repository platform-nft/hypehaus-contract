import React from 'react';
import logo from '../assets/hypehaus-animated.gif';

type SuccessfulMintPageProps = {
  mintAmount: number;
};

export default function SuccessfulMintPage({
  mintAmount,
}: SuccessfulMintPageProps) {
  return (
    <div className="flex flex-col items-center space-y-4 max-w-xs">
      <img
        src={logo}
        alt="*HYPEHAUS logo"
        className="w-full aspect-square rounded-2xl"
      />
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Congrats!</h1>
        <div className="flex flex-col">
          <p>
            You have minted {mintAmount} *HYPEHAUS
            {mintAmount !== 1 ? 'es' : ''}.
          </p>
          <p>Welcome to *HYPEHAUS!</p>
        </div>
      </div>
    </div>
  );
}
