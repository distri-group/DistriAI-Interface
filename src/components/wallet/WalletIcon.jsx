import React from "react";

export const WalletIcon = ({ wallet, ...props }) => {
  return (
    wallet && (
      <img
        src={wallet.adapter.icon}
        alt={`${wallet.adapter.name} icon`}
        {...props}
      />
    )
  );
};
