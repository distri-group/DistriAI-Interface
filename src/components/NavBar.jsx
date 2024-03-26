import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { KeyboardDoubleArrowDown } from "@mui/icons-material";

function NavBar({ className }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState("buyer");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  useEffect(() => {
    if (
      location.pathname === "/market" ||
      location.pathname.includes("/buy") ||
      location.pathname.includes("/order") ||
      location.pathname.includes("/extend-duration") ||
      location.pathname.includes("/end-duration")
    ) {
      setUser("buyer");
    } else if (
      location.pathname === "/device" ||
      location.pathname.includes("/reward") ||
      location.pathname.includes("/earning") ||
      location.pathname.includes("/makeoffer")
    ) {
      setUser("seller");
    }
  }, [location.pathname, user]);
  return (
    <div className={className}>
      <div className="con">
        <div style={{ display: "flex", height: "28px" }}>
          <img
            className="logo"
            src="/img/logo.png"
            onClick={() => navigate("/")}
            alt="Distri.AI"
          />
          <Button
            onClick={(e) => setAnchorEl(e.currentTarget)}
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}>
            <KeyboardDoubleArrowDown style={{ color: "white" }} />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            disableScrollLock
            onClose={() => setAnchorEl(null)}>
            <MenuItem
              onClick={() => {
                navigate("/market");
                setAnchorEl(null);
              }}>
              NEED
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/device");
                setAnchorEl(null);
              }}>
              SHARE
            </MenuItem>
            <MenuItem
              onClick={() => {
                window.open("https://docs.distri.ai/core/getting-started");
                setAnchorEl(null);
              }}>
              Getting Started
            </MenuItem>
          </Menu>
        </div>
        <div className="content-nav">
          {user === "buyer" && (
            <>
              <span onClick={() => navigate("/market")}>Market</span>
              <span onClick={() => navigate("/models")}>Models</span>
              <span style={{ cursor: "default" }}>Datasets</span>
              <span onClick={() => navigate("/order")}>My Orders</span>
            </>
          )}
          {user === "seller" && (
            <>
              <span onClick={() => navigate("/device")}>Share Device</span>
              <span onClick={() => navigate("/earning")}>Earnings</span>
              <span onClick={() => navigate("/reward")}>Rewards</span>
            </>
          )}
          <span onClick={() => navigate("/faucet")}>Faucet</span>
        </div>
        <div className="right-btn">
          <WalletMultiButton />
        </div>
      </div>
    </div>
  );
}

export default styled(NavBar)`
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
      width: 120px;
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
