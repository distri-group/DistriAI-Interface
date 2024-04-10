import React from "react";
import { Button } from "./Button";
import { WalletIcon } from "./WalletIcon";

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
