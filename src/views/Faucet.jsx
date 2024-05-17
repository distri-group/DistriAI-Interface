import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { DISTFaucet, SOLFaucet } from "@/services/faucet.js";
import { useSnackbar } from "notistack";
import { TextField, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";

function Faucet({ className }) {
  document.title = "Faucet";
  const [loading, setLoading] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  const [validateError, setValidateError] = useState({
    address: null,
  });
  useEffect(() => {
    if (wallet?.publicKey) {
      setPublicKey(wallet?.publicKey.toString());
    }
  }, [wallet]);
  const handleInput = (e) => {
    const publicKey = e.target.value;
    setPublicKey(publicKey);
    if (!publicKey) {
      return setValidateError((prev) => ({
        ...prev,
        address: "Please input address or connect with wallet",
      }));
    }
    if (publicKey.length < 44) {
      return setValidateError((prev) => ({
        ...prev,
        address: "Not valid publicKey",
      }));
    }
    return setValidateError((prev) => ({
      ...prev,
      address: null,
    }));
  };
  const onSubmit = async () => {
    if (!publicKey) {
      return setValidateError((prev) => ({
        ...prev,
        address: "Please input address or connect with wallet",
      }));
    }
    if (validateError.address) {
      return;
    }
    setLoading(true);
    try {
      await SOLFaucet(publicKey);
      enqueueSnackbar("1 SOL has sent to your wallet", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setLoading(false);
  };
  const onSendDIST = async () => {
    if (validateError.address) {
      return;
    }
    setLoading(true);
    try {
      await DISTFaucet(publicKey);
      enqueueSnackbar("5 DIST have sent to your wallet", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: "error",
      });
    }
    setLoading(false);
  };

  return (
    <div className={className}>
      <h1>DistriAI Genesis Faucet</h1>
      <h2>
        Testnet faucet drips <span>1 SOL / 5 DIST</span> per day
      </h2>
      <div className="container">
        <p className="text">
          1. Install the phantom extension from the{" "}
          <a href="https://phantom.app/" target="_blank" rel="noreferrer">
            Phantom.app
          </a>
          ;
        </p>
        <p className="text">
          2. Create a new wallet OR import an existing wallet.
        </p>
        <TextField
          onChange={handleInput}
          disabled={loading}
          value={publicKey}
          error={!!validateError.address}
          placeholder="Enter your wallet address or connect with wallet."
          helperText={validateError.address}
        />
        <Stack
          direction="row"
          justifyContent="center"
          style={{ paddingTop: 64 }}>
          <LoadingButton
            className="cbtn"
            style={{ width: 160 }}
            loading={loading}
            type="primary"
            onClick={onSubmit}>
            {!loading && <span>Send Me SOL</span>}
          </LoadingButton>
          <LoadingButton
            className="cbtn"
            style={{ width: 160 }}
            loading={loading}
            type="primary"
            onClick={onSendDIST}>
            {!loading && <span>Send Me DIST</span>}
          </LoadingButton>
        </Stack>
      </div>
    </div>
  );
}

export default styled(Faucet)`
  h1 {
    margin: 0;
    margin-bottom: 16px;
    font-size: 32px;
    line-height: 44px;
  }
  h2 {
    margin: 0;
    margin-bottom: 40px;
    font-size: 16px;
    color: #898989;
    line-height: 22px;
    span {
      color: white;
    }
  }
  .container {
    background: rgba(149, 157, 165, 0.16);
    padding: 40px;
    .text {
      color: #959da5;
      a {
        color: #09e98d;
      }
    }
  }
  .cbtn {
    margin: 0 12px;
  }
`;
