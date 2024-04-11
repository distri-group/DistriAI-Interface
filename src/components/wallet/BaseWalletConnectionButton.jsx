import React from "react";
import { Button } from "./Button.jsx";
import { WalletIcon } from "./WalletIcon.jsx";

export function BaseWalletConnectionButton({
  walletIcon,
  walletName,
  ...props
}) {
  return (
    <Button
      {...props}
      className="wallet-adapter-button-trigger"
      startIcon={
        walletIcon && walletName ? (
          <WalletIcon
            wallet={{ adapter: { icon: walletIcon, name: walletName } }}
          />
        ) : undefined
      }
    />
  );
}
