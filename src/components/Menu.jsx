import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import ConnectModal from "./ConnectModal";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { useEffect } from "react";

function Menu({ className }) {
  let navigate = useNavigate();
  const [noWallet, setNoWallet] = useState(false);
  const wallet = useAnchorWallet();
  useEffect(() => {
    setNoWallet(!wallet?.publicKey || !window.solana);
  }, [wallet]);
  return (
    <div className={className}>
      <div className="con">
        <img
          className="logo"
          src="/img/logo.png"
          onClick={() => navigate("/")}
          style={{
            width: "120px",
          }}
          alt="logo"
        />
        <div className="content-nav">
          <span onClick={() => navigate("/market")}>Market</span>
          <span onClick={() => navigate("/mydevice")}>Share Device</span>
          <span onClick={() => navigate("/myorder")}>My Orders</span>
          <span onClick={() => navigate("/faucet")}>Faucet</span>
        </div>
        <div className="right-btn">
          <WalletMultiButton />
        </div>
      </div>
      <ConnectModal open={noWallet} />
    </div>
  );
}

export default styled(Menu)`
  width: 100%;
  height: 56px;
  line-height: 56px;
  display: block;
  .wallet-adapter-button-trigger {
    background-color: transparent !important;
    margin-top: 8px !important;
  }
  .con {
    width: 1200px;
    background-color: transparent;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    margin: 0 auto;
    height: 56px;
    .logo {
      margin-left: 20px;
      cursor: pointer;
    }
    .content-nav {
      width: 600px;
      margin: 0 auto;
      height: 56px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: row;
      span {
        color: #fff;
        font-size: 14px;
        cursor: pointer;
      }
    }
    .right-btn {
      margin-right: 20px;
      position: relative;
      top: 0;
    }
  }
`;
