import { WalletReadyState } from "@solana/wallet-adapter-base";
import React from "react";
import { Button } from "./Button.jsx";
import { WalletIcon } from "./WalletIcon.jsx";

export const WalletListItem = ({ handleClick, tabIndex, wallet }) => {
  return (
    <li>
      <Button
        disabled={wallet.adapter.name !== "Phantom"}
        onClick={handleClick}
        startIcon={<WalletIcon wallet={wallet} />}
        tabIndex={tabIndex}>
        {wallet.adapter.name}
        {wallet.adapter.name === "Phantom" ? (
          wallet.readyState === WalletReadyState.Installed && (
            <span>Detected</span>
          )
        ) : (
          <span>Not supported</span>
        )}
      </Button>
    </li>
  );
};
