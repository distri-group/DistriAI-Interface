import styled from "styled-components";
import _ from "lodash";
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
    setNoWallet(!wallet?.publicKey);
  }, [wallet]);
  return (
    <div className={className}>
      <div className="con">
        <img
          className="logo"
          src="/img/logo.png"
          onDoubleClick={() => navigate("/test3")}
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
  background-color: #05040d;
  display: block;
  .wallet-adapter-button-trigger {
    background-color: #05040d !important;
    margin-top: 8px !important;
  }
  .user-header {
    width: 36px;
    height: 36px;
    display: block;
    overflow: hidden;
  }
  .con {
    width: 1200px;
    background-color: #05040d;
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
      .btn {
        color: rgb(148, 214, 226);
        line-height: 38px;
        height: 38px;
        text-align: center;
        display: block;
        overflow: hidden;
        border: 1px solid rgb(148, 214, 226);
        border-radius: 6px;
        padding: 0px 39px;
        cursor: pointer;
      }
      .icon {
        width: 115px;
        height: 36px;
      }
      .menu {
        position: absolute;
        top: 51px;
        right: 0px;
        width: 186px;
        height: 50px;
        background-color: rgba(32, 32, 32, 1);
        color: #fff;
        border-radius: 5px;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        span {
          height: 50px;
          line-height: 50px;
          text-align: center;
        }
        span:hover {
          background-color: #272727;
        }
      }
    }
  }
`;
