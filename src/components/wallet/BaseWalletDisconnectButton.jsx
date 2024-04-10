import { useWalletDisconnectButton } from "@solana/wallet-adapter-base-ui";
import React from "react";
import { BaseWalletConnectionButton } from "./BaseWalletConnectionButton";

export function BaseWalletDisconnectButton({
  children,
  disabled,
  labels,
  onClick,
  ...props
}) {
  const { buttonDisabled, buttonState, onButtonClick, walletIcon, walletName } =
    useWalletDisconnectButton();
  return (
    <BaseWalletConnectionButton
      {...props}
      disabled={disabled || buttonDisabled}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
        if (e.defaultPrevented) {
          return;
        }
        if (onButtonClick) {
          onButtonClick();
        }
      }}
      walletIcon={walletIcon}
      walletName={walletName}>
      {children ? children : labels[buttonState]}
    </BaseWalletConnectionButton>
  );
}
