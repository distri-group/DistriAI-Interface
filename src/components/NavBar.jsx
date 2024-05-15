import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { WalletMultiButton } from "./wallet/WalletMultiButton.jsx";
import { useEffect, useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import { KeyboardDoubleArrowDown } from "@mui/icons-material";
import { getOrderList } from "@/services/order.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
function NavBar({ className }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState("buyer");
  const [anchorEl, setAnchorEl] = useState(null);
  const [orderDialog, setOrderDialog] = useState(false);
  const [halfOrderDialog, setHalfOrderDialog] = useState(false);
  const [ordersUnderOneHour, setOrdersUnder] = useState(0);
  const [ordersUnderHalf, setHalfOrder] = useState(0);
  const wallet = useAnchorWallet();

  const open = Boolean(anchorEl);

  const handleOrderDialogClose = () => {
    setOrderDialog(false);
  };
  const handleHalfOrderDialogClose = () => {
    setHalfOrderDialog(false);
  };

  useEffect(() => {
    const loadOrderList = async () => {
      const res = await getOrderList(
        1,
        100,
        { Direction: "buy", Status: 1 },
        wallet.publicKey.toString()
      );
      let count = 0;
      for (let order of res.List) {
        if (order.Duration > 1 && order.RemainingDuration === 0) {
          count++;
          res.List = res.List.filter((item) => item !== order);
        }
      }
      setOrdersUnder(count);
      if (count > 0) {
        setOrderDialog(true);
      }
      let halfCount = 0;
      for (let order of res.List) {
        if (
          order.Duration >= 10 &&
          (new Date(order.EndTime).getTime() - Date.now()) / 3600000 <
            order.Duration / 2
        ) {
          halfCount++;
        }
      }
      setHalfOrder(halfCount);
      if (halfCount > 0) {
        setHalfOrderDialog(true);
      }
    };
    if (wallet?.publicKey) {
      loadOrderList();
    }
  }, [wallet]);
  useEffect(() => {
    if (
      location.pathname === "/market" ||
      location.pathname.includes("buy") ||
      location.pathname.includes("order") ||
      location.pathname.includes("dashboard") ||
      location.pathname.includes("model")
    ) {
      setUser("buyer");
    } else if (
      location.pathname === "/device" ||
      location.pathname.includes("reward") ||
      location.pathname.includes("earning") ||
      location.pathname.includes("list")
    ) {
      setUser("seller");
    }
  }, [location.pathname, user]);
  return (
    <div className={className}>
      <div className="con">
        <div
          style={{
            display: "flex",
            height: "28px",
            justifyContent: "space-between",
          }}>
          <img
            className="logo"
            src="/img/logo.png"
            onClick={() => navigate("/home")}
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
              Need
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/device");
                setAnchorEl(null);
              }}>
              Share
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
              <span onClick={() => navigate("/model")}>Models</span>
              <span onClick={() => navigate("/dataset")}>Datasets</span>
              <span onClick={() => navigate("/dashboard")}>
                {ordersUnderOneHour > 0 ? (
                  <Stack direction="row">
                    <img
                      src="/img/clock.png"
                      alt="alarm"
                      style={{
                        marginRight: 8,
                      }}
                    />
                    <span style={{ margin: 0 }}>Dashboard</span>
                  </Stack>
                ) : (
                  "Dashboard"
                )}
              </span>
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
        <Dialog open={orderDialog} onClose={() => setOrderDialog(false)}>
          <DialogTitle>
            Your remaining available time for {ordersUnderOneHour} orders is
            less than <span style={{ color: "red" }}>1 HOUR</span>
          </DialogTitle>
          <DialogContent>
            Backup or extend the duration to avoid data loss due to the end of
            order.
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOrderDialogClose}>Got it</Button>
            <Button
              onClick={() => {
                navigate("/dashboard");
                handleOrderDialogClose();
              }}>
              View Orders
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={halfOrderDialog}
          onClose={() => setHalfOrderDialog(false)}>
          <DialogTitle>
            Your remaining available time for {ordersUnderHalf} orders is less
            than 50%.
          </DialogTitle>
          <DialogContent>
            Backup or extend the duration to avoid data loss due to the end of
            order.
          </DialogContent>
          <DialogActions>
            <Button onClick={handleHalfOrderDialogClose}>Got it</Button>
            <Button
              onClick={() => {
                navigate("/dashboard");
                handleHalfOrderDialogClose();
              }}>
              View Orders
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default styled(NavBar)`
  width: 100%;
  height: 56px;
  line-height: 56px;
  margin-bottom: 40px;
  padding: 32px 0;
  display: block;
  .wallet-adapter-button-trigger {
    background-color: transparent !important;
    margin-top: 8px !important;
  }
  .con {
    background-color: transparent;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    margin: 0 auto;
    height: 56px;
    .logo {
      width: 120px;
      cursor: pointer;
    }
    .content-nav {
      width: 840px;
      margin: 0 auto;
      height: 56px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      span {
        font-weight: 500;
        font-size: 20px;
        line-height: 28px;
        cursor: pointer;
        margin: 0 60px;
      }
    }
    .right-btn {
      position: relative;
      top: 0;
    }
  }
`;
