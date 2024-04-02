import React, { useEffect } from "react";
import { Modal, Box } from "@mui/material";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

export default function ConnectToWallet({ modal, onClose }) {
  const wallet = useAnchorWallet();
  useEffect(() => {
    if (wallet?.publicKey) {
      onClose();
    }
  }, [wallet]);
  return (
    <Modal
      open={modal}
      onClose={onClose}
      slotProps={{ root: { style: { zIndex: "300" } } }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1000,
          bgcolor: "#00000b",
          p: 4,
          zIndex: 300,
          borderRadius: "8px",
        }}>
        <div className="login-box">
          <p className="big-title">Connect Your Wallet</p>
          <p className="con-title">
            If you don't have a wallet yet, you can select a provider and create
            one now
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WalletMultiButton />
          </div>
        </div>
      </Box>
    </Modal>
  );
}