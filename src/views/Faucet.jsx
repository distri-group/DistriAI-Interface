import styled from "styled-components";
import { Input, Button } from "antd";
import React, { useState, useEffect } from "react";
import * as solana from "../services/solana";
import * as util from "../utils";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

function Home({ className }) {
  document.title = "Faucet";
  const [loading, setLoading] = useState(false);
  const [newAddr, setNewAddr] = useState();
  const wallet = useAnchorWallet();
  useEffect(() => {
    setNewAddr(wallet?.publicKey.toString());
  }, [wallet]);
  const onInput = (e) => {
    let v = e.target.value;
    setNewAddr(v);
  };
  const onSubmit = async () => {
    if (!newAddr) {
      return util.alert("Please Enter Your Wallet Address.");
    }
    setLoading(true);
    let t = await solana.faucet(newAddr);
    setLoading(false);
    if (t.msg === "ok") {
      util.alert("Submitted successfully!");
    } else {
      util.alert(t.msg);
    }
  };

  return (
    <div className={className}>
      <div className="hold"></div>
      <div className="con">
        <h1 className="title">DistriAI Genesis SOL Faucet</h1>
        <h2 className="title2">Testnet faucet drips 1 SOL per day</h2>
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
            <Input
              className="my-input"
              data-name="taskName"
              onChange={onInput}
              onKeyUp={onInput}
              disabled={loading}
              value={newAddr}
              placeholder="Enter Your Wallet Address"
              allowClear={true}
            />
          </div>
          <div className="form-row">
            <Button
              className="mybtn22 cbtn"
              loading={loading}
              disabled={loading}
              style={{ width: 152 }}
              type="primary"
              onClick={onSubmit}>
              Send Me SOL
            </Button>
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
  height: 100vh;
  color: #fff;
  .hold {
    display: block;
    overflow: hidden;
    width: 100%;
    height: 56px;
    clear: both;
  }
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
          font-family: "Montserrat", sans-serif;
          font-weight: 400;
          font-style: normal;
          font-size: 16px;
          color: #0aab50;
          line-height: 30px;
          text-decoration: none;
        }
      }
      .my-input {
        border: 1px solid #797979;
        margin: 24px 0;
        background-color: #222;
      }
      input {
        background-color: #222;
      }
      .mybtn22 {
        height: 50px;
        line-height: 40px;
        margin: 20px auto;
        display: block;
        color: white !important;
      }
    }
  }
  .con {
    width: 1210px;
    margin: 10px auto;
    display: block;
    overflow: hidden;
    .title {
      font-family: "Montserrat Bold", "Montserrat", sans-serif;
      font-weight: 700;
      font-style: normal;
      font-size: 28px;
      color: #ffffff;
      margin-top: 25px;
      line-height: 24px;
      text-align: center;
    }
    .title2 {
      font-family: "Montserrat Bold", "Montserrat", sans-serif;
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
  .ant-btn-primary {
    color: #000;
    height: 50px;
    line-height: 40px;
  }
`;
