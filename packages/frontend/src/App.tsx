import React from "react";

import hero from "./assets/hero.png";
import { ReactComponent as MetaMaskLogo } from "./assets/metamask-fox.svg";

type ButtonProps = Omit<React.HTMLProps<HTMLButtonElement>, "className">;

function Button(props: ButtonProps) {
  return (
    <button className="rounded-xl pt-4 pb-4 pl-6 pr-6 text-slate-md border-2 font-medium text-primary-500 border-primary-500 hover:bg-primary-500 hover:text-white hover:border-transparent">
      {props.children}
    </button>
  );
}

export default function App() {
  return (
    <div className="flex h-screen">
      <div className="flex-col m-auto max-w-lg px-16 py-12 text-center space-y-4 rounded-xl border-2 border-primary-100">
        <img
          src={hero}
          alt="Hero image"
          className="mx-auto aspect-square w-2/3 rounded-2xl"
        />
        <h1 className="text-3xl font-bold">Mint *HYPEHAUS</h1>
        <p>To mint, connect your MetaMask wallet below</p>
        <Button>
          <div className="flex flex-row">
            <MetaMaskLogo className="h-6 aspect-square mr-1" />
            Connect MetaMask
          </div>
        </Button>
      </div>
    </div>
  );
}
