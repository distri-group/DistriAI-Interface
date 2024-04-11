import React from "react";
import { BaseWalletConnectButton } from "./BaseWalletConnectButton.jsx";

const LABELS = {
  connecting: "Connecting ...",
  connected: "Connected",
  "has-wallet": "Connect",
  "no-wallet": "Connect Wallet",
};

export function WalletConnectButton(props) {
  return <BaseWalletConnectButton {...props} labels={LABELS} />;
}
