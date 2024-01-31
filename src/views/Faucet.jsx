import styled from "styled-components";
import React, { useState, useEffect } from "react";
import * as solana from "../services/solana";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { faucet } from "../services/faucet";
import { useSnackbar } from "notistack";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

function Home({ className }) {
  document.title = "Faucet";
  const [loading, setLoading] = useState(false);
  const [newAddr, setNewAddr] = useState();
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setNewAddr(wallet?.publicKey.toString());
  }, [wallet]);
  const onInput = (e) => {
    let v = e.target.value;
    setNewAddr(v);
  };
  const onSubmit = async () => {
    if (!newAddr) {
      return enqueueSnackbar("Please Enter Your Wallet Address.", {
        variant: "info",
      });
    }
    setLoading(true);
    let t = await solana.faucet(newAddr);
    setLoading(false);
    if (t.msg === "ok") {
      enqueueSnackbar("1 SOL has sent to your wallet", { variant: "success" });
    } else {
      enqueueSnackbar(t.msg, { variant: "error" });
    }
  };
  const onSendDIST = async () => {
    if (!newAddr) {
      return enqueueSnackbar("Please Enter Your Wallet Address.", {
        variant: "info",
      });
    }
    setLoading(true);
    try {
      let res = await faucet(newAddr);
      setLoading(false);
      if (res?.Msg?.includes("too many airdrops")) {
        return enqueueSnackbar(res.Msg, { variant: "info" });
      }
      return enqueueSnackbar("5 DIST have sent to your wallet", {
        variant: "success",
      });
    } catch (e) {
      console.log(e);
      return enqueueSnackbar(
        "Failed to claim airdrop. Please try again later",
        { variant: "error" }
      );
    }
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
              data-name="taskName"
              onChange={onInput}
              disabled={loading}
              value={newAddr}
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

export default styled(Home)`
  display: block;
  overflow: hidden;
  width: 100%;
  height: calc(100vh - 140px);
  color: #fff;
  .myform {
    width: 800px;
    background-color: #222;
    padding: 46px;
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
          font-family: Montserrat, sans-serif;
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
      font-family: Montserrat Bold, Montserrat, sans-serif;
      font-weight: 700;
      font-style: normal;
      font-size: 28px;
      color: #ffffff;
      margin-top: 25px;
      line-height: 24px;
      text-align: center;
    }
    .title2 {
      font-family: Montserrat Bold, Montserrat, sans-serif;
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
