import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { DISTFaucet, SOLFaucet } from "@/services/faucet.js";
import { useSnackbar } from "notistack";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

function Faucet({ className }) {
  document.title = "Faucet";
  const [loading, setLoading] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (wallet?.publicKey) {
      setPublicKey(wallet?.publicKey.toString());
    }
  }, [wallet]);
  const onSubmit = async () => {
    if (!publicKey) {
      return enqueueSnackbar("Please Enter Your Wallet Address.", {
        variant: "info",
      });
    }
    setLoading(true);
    const res = await SOLFaucet(publicKey);
    if (res.msg === "ok") {
      enqueueSnackbar("1 SOL has sent to your wallet", { variant: "success" });
    } else {
      enqueueSnackbar(res.msg, { variant: "error" });
    }
    setLoading(false);
  };
  const onSendDIST = async () => {
    if (!publicKey) {
      return enqueueSnackbar("Please Enter Your Wallet Address.", {
        variant: "info",
      });
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
      <div className="con">
        <h1 className="title">DistriAI Genesis Faucet</h1>
        <h2 className="title2">Testnet faucet drips 1 SOL / 5 DIST per day</h2>
        <div className="myform">
          <div className="form-row">
            <div className="tip1">
              1. Install the phantom extension from the{" "}
              <a href="https://phantom.app/" target="_blank" rel="noreferrer">
                Phantom.app
              </a>
            </div>
            <div className="tip1">
              2. Create a new wallet OR import an existing wallet.
            </div>
            <TextField
              onChange={(e) => setPublicKey(e.target.value)}
              disabled={loading}
              value={publicKey}
              placeholder="Enter Your Wallet Address"
            />
          </div>
          <div className="form-col">
            <LoadingButton
              className="cbtn"
              loading={loading}
              style={{ width: 152 }}
              type="primary"
              onClick={onSubmit}>
              {loading ? "" : "Send Me SOL"}
            </LoadingButton>
            <LoadingButton
              className="cbtn"
              loading={loading}
              style={{ width: 152 }}
              type="primary"
              onClick={onSendDIST}>
              {loading ? "" : "Send Me DIST"}
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default styled(Faucet)`
  display: block;
  overflow: hidden;
  width: 100%;
  height: calc(100% - 140px);
  color: #fff;
  .myform {
    width: 800px;
    background-color: #222;
    padding: 48px;
    display: block;
    overflow: hidden;
    margin: 40px auto;
    .form-row {
      .tip1,
      .tip2 {
        font-size: 16px;
        color: #797979;
        line-height: 30px;
        a {
          font-weight: 400;
          font-style: normal;
          font-size: 16px;
          color: #0aab50;
          line-height: 30px;
          text-decoration: none;
        }
      }
      input {
        background-color: #222;
      }
    }
  }
  .form-col {
    display: flex;
    justify-content: space-around;
  }
  .con {
    width: 1210px;
    margin: 66px auto 10px auto;
    display: block;
    overflow: hidden;
    .title {
      font-weight: 700;
      font-style: normal;
      font-size: 28px;
      color: #ffffff;
      margin-top: 25px;
      line-height: 24px;
      text-align: center;
    }
    .title2 {
      font-size: 16px;
      color: #797979;
      text-align: center;
      line-height: 20px;
    }
  }
  .block {
    display: block;
    overflow: hidden;
  }
`;
