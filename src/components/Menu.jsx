import styled from "styled-components";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Modal } from "antd";

import * as solana from "../services/solana";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
window.showLoginBox = console.log;

function Menu({ className }) {
  let navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    window.showLoginBox = function () {
      setModalOpen(true);
    };
    window.freshBalance = function () {
      solana.freshAccountBalance();
    };
  }, []);

  const onShowLoginBox = () => {
    setModalOpen(true);
  };
  window.onShowLoginBox = onShowLoginBox;
  const onLogin = async () => {
    solana.getPublicKey();
  };

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
      {/* 登录提示框 */}
      <Modal
        className="login-modal"
        width={1000}
        style={{ backgroundColor: "#000" }}
        open={isModalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => {
          setModalOpen(false);
          if (!localStorage.getItem("addr")) {
            navigate("/market/");
          }
        }}
        footer={null}>
        <div className="login-box">
          <p className="big-title">Connect Your Wallet</p>
          <p className="con-title">
            If you don't have a wallet yet, you can select a provider and create
            one now
          </p>
          <p></p>
          <div className="login-line" onClick={onLogin}>
            <img src="/img/phantom.svg" alt="" />
            <label>Phantom</label>
          </div>
        </div>
      </Modal>
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
