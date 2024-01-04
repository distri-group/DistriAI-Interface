import React from "react";
import { useState } from "react";
import { Modal } from "antd";
import { useWallet } from "@solana/wallet-adapter-react";

export default function ConnectModal({ open }) {
  const { connect, wallet } = useWallet();
  const [isOpen, setIsOpen] = useState(open);
  const onLogin = async () => {
    try {
      if (wallet) {
        connect();
      } else {
        console.log("No Wallet yet");
      }
    } catch (e) {
      console.log(e);
      window.open("https://phantom.app/", "_blank");
    }
  };
  return (
    <Modal
      className="login-modal"
      width={1000}
      style={{ backgroundColor: "#000" }}
      open={isOpen}
      onOk={() => setIsOpen(false)}
      onCancel={() => {
        setIsOpen(false);
      }}
      footer={null}>
      <div className="login-box">
        <p className="big-title">Connect Your Wallet</p>
        <p className="con-title">
          If you don't have a wallet yet, you can select a provider and create
          one now
        </p>
        <p></p>
        <div
          className="login-line"
          onClick={onLogin}
          style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex" }}>
            <span
              style={{
                backgroundImage: "url('/img/phantom.svg')",
                margin: 0,
                width: "53px",
                height: "53px",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "80%",
              }}
            />
            <p
              style={{
                marginBottom: "0px",
                paddingLeft: "20px",
                lineHeight: "53px",
              }}>
              Chrome extension
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ margin: 0 }}>Phantom</label>
          </div>
        </div>
      </div>
    </Modal>
  );
}
