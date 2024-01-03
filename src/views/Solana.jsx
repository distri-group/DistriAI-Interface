import styled from "styled-components";
// import _ from "lodash";
// import { useNavigate, useParams, NavLink } from "react-router-dom";
// import {
//   PlayCircleOutlined,
//   CloudUploadOutlined,
//   WalletOutlined,
//   SearchOutlined,
//   HomeOutlined,
//   GlobalOutlined,
// } from "@ant-design/icons";
import {
  Modal,
  Alert,
  Menu,
  message,
  Popconfirm,
  Empty,
  Space,
  Button,
} from "antd";
import React, { useState, useEffect } from "react";
// import {
//   Connection,
//   sendAndConfirmTransaction,
//   Transaction,
//   PublicKey,
//   LAMPORTS_PER_SOL,
//   SystemProgram,
// } from "@solana/web3.js";
// import { formatAddress } from "../utils";
// import * as util from "../utils";
// import { formatImgUrl, formatterSize } from "../utils/formatter";
import * as solana from "../services/solana";

let connection = null;
let provider = null;
const accountId2 = "BMeKBUBFuuwWwKp1LhdrB3AZyhZiTCCWJ7yCaZUi11gz";

function Home({ className }) {
  const [conStatus, setConStatus] = useState("--");
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState();
  const [accountId, setAccountId] = useState();
  const [balance, setBalance] = useState(0);
  const [hasWallet, setHasWallet] = useState("--");
  const setErr = (e) => {
    setError(e.message);
    setLoading(false);
  };

  const init = async () => {
    setLoading(true);
    connection = await solana.connectToSolana();
    setConStatus(connection ? "ok" : "error");
    provider = solana.getProvider();
    setHasWallet(provider ? "yes" : "no");
    let addr = await solana.getPublicKey();
    setAccountId(addr);
    let account = solana.getAccountInfoFromStore();
    setBalance(account.balance);
    setLoading(false);
  };

  const getBalance = async () => {
    setLoading(true);
    let b = await solana.getBalance(accountId);
    setBalance(b);
    setLoading(false);
  };
  const fauct = async () => {
    setLoading(true);
    await solana.faucet(accountId);
    setLoading(false);
  };
  const getPublicKeyFromWallet = async () => {
    setLoading(true);
    let b = await solana.getPublicKey();
    setAccountId(b);
    setLoading(false);
  };
  const sendBalance = async () => {
    setLoading(true);
    let result = await solana.sendBalance(accountId, accountId2, 100000000);
    console.log(result);
    // setErr(JSON.stringify(result));
    setLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div className={className}>
      <Space direction="vertical">
        <div>conStatus:{conStatus}</div>
        <div>accountId:{accountId}</div>
        <div>balance:{balance} SOL</div>
        <div>error:{err}</div>
        <Button
          loading={loading}
          disabled={loading}
          type="primary"
          onClick={getBalance}>
          getBalance
        </Button>
        <Button
          loading={loading}
          disabled={loading}
          type="primary"
          onClick={fauct}>
          Faucet
        </Button>
      </Space>
      <hr></hr>
      <div>
        <h1>wallet</h1>
        <Space direction="vertical">
          <div>hasWallet:{hasWallet}</div>
          <Button
            loading={loading}
            disabled={loading}
            type="primary"
            onClick={getPublicKeyFromWallet}>
            getPublicKeyFromWallet
          </Button>
          <Button
            loading={loading}
            disabled={loading}
            type="primary"
            onClick={sendBalance}>
            sendBalance
          </Button>
        </Space>
      </div>
    </div>
  );
}

export default styled(Home)`
  display: block;
  color: #fff;
  padding: 20px;
  overflow: hidden;
`;
