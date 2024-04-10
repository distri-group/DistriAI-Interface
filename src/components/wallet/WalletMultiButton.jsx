import React from "react";
import { BaseWalletMultiButton } from "./BaseWalletMultiButton";

const LABELS = {
  "change-wallet": "Change wallet",
  connecting: "Connecting ...",
  "copy-address": "Copy address",
  copied: "Copied",
  disconnect: "Disconnect",
  "has-wallet": "Connect",
  "no-wallet": "Select Wallet",
};

export function WalletMultiButton(props) {
  return <BaseWalletMultiButton {...props} labels={LABELS} />;
}
