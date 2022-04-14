import React from 'react';
import logo from '../assets/hypehaus-animated.gif';

type SuccessfulMintPageProps = {
  mintAmount: number;
};

export default function SuccessfulMintPage({
  mintAmount,
}: SuccessfulMintPageProps) {
  return (
    <div className="flex flex-col space-y-4 items-center">
      <img src={logo} alt="*HYPEHAUS logo" className="rounded-lg" />
      <h1 className="text-3xl font-bold">CONGRATULATIONS</h1>
      <div>
        <p>You've successfully minted {mintAmount} *HYPEHAUSes.</p>
        <p>Welcome to *HYPEHAUS!</p>
      </div>
    </div>
  );
}
