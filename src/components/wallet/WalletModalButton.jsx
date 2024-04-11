import React, { useCallback } from "react";
import { Button as BaseWalletConnectionButton } from "./Button.jsx";
import { useWalletModal } from "./useWalletModal.jsx";

export const WalletModalButton = ({
  children = "Select Wallet",
  onClick,
  ...props
}) => {
  const { visible, setVisible } = useWalletModal();

  const handleClick = useCallback(
    (event) => {
      if (onClick) onClick(event);
      if (!event.defaultPrevented) setVisible(!visible);
    },
    [onClick, setVisible, visible]
  );

  return (
    <BaseWalletConnectionButton
      {...props}
      className="wallet-adapter-button-trigger"
      onClick={handleClick}>
      {children}
    </BaseWalletConnectionButton>
  );
};
