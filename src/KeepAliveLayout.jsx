import KeepAlive from "keepalive-for-react";
import NavBar from "@/components/NavBar.jsx";
import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import { getOrderList } from "@/services/order.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function KeepAliveLayout() {
  const outlet = useOutlet();
  const location = useLocation();
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const [orderDialog, setOrderDialog] = useState(false);
  const [halfOrderDialog, setHalfOrderDialog] = useState(false);
  const [ordersUnderOneHour, setOrdersUnder] = useState(0);
  const [ordersUnderHalf, setHalfOrder] = useState(0);
  const cacheKey = useMemo(() => {
    return location.pathname + location.search;
  }, [location]);
  const loadOrderList = async () => {
    const res = await getOrderList(
      1,
      100,
      { Direction: "Buy", Status: 1 },
      wallet.publicKey.toString()
    );
    let count = 0;
    for (let order of res.List) {
      if (
        order.StatusName === "Available" &&
        order.Duration > 1 &&
        order.RemainingDuration === 0
      ) {
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
        order.StatusName === "Available" &&
        order.Duration >= 10 &&
        order.RemainingDuration <= order.Duration / 2
      ) {
        halfCount++;
      }
    }
    setHalfOrder(halfCount);
    if (halfCount > 0) {
      setHalfOrderDialog(true);
    }
  };

  useEffect(() => {
    if (wallet?.publicKey) {
      loadOrderList();
    }
  }, [wallet]);
  return (
    <KeepAlive
      activeName={cacheKey}
      include={[
        /\/dashboard/,
        /\/model/,
        /\/dataset/,
        /\/earning/,
        /\/reward/,
        /\/market/,
      ]}
      max={10}
      strategy={"LRU"}>
      <div className="bg" />
      <div id="App">
        <NavBar />
        {outlet}
        <Dialog open={orderDialog}>
          <DialogTitle>
            Your remaining available time for {ordersUnderOneHour} orders is
            less than <span style={{ color: "red" }}>1 HOUR</span>
          </DialogTitle>
          <DialogContent>
            Backup or extend the duration to avoid data loss due to the end of
            order.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOrderDialog(false)}>Got it</Button>
            <Button onClick={() => navigate("/dashboard")}>View Orders</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={halfOrderDialog}>
          <DialogTitle>
            Your remaining available time for {ordersUnderHalf} orders is less
            than 50%.
          </DialogTitle>
          <DialogContent>
            Backup or extend the duration to avoid data loss due to the end of
            order.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOrderDialog(false)}>Got it</Button>
            <Button onClick={() => navigate("/dashboard")}>View Orders</Button>
          </DialogActions>
        </Dialog>
      </div>
    </KeepAlive>
  );
}
