import React from 'react';
// import tailwindColors from 'tailwindcss/colors';
// import { IoCheckmarkCircle } from 'react-icons/io5';

type SuccessfulMintPageProps = {
  mintAmount: number;
};

export default function SuccessfulMintPage({
  mintAmount,
}: SuccessfulMintPageProps) {
  return (
    <div className="flex flex-col space-y-4 items-center">
      {/* <IoCheckmarkCircle size="8rem" color={tailwindColors.green[600]} /> */}
      <p className="text-[8rem]">🎉</p>
      <h1 className="text-3xl font-bold">Congratulations!</h1>
      <p>
        You've successfully minted {mintAmount} *HYPEHAUS
        {mintAmount === 1 ? '' : 'es'}!
      </p>
    </div>
  );
}
