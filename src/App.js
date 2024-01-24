import "./App.css";
import Menu from "./components/Menu";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Home from "./views/Home";
import Buy from "./views/Buy";
import Market from "./views/Market";
import MakeOffer from "./views/MakeOffer";
import OrderDetail from "./views/OrderDetail";
import MyDevice from "./views/MyDevice";
import MyOrder from "./views/MyOrder";
import Faucet from "./views/Faucet";
import Footer from "./components/footer";
import ExtendDuration from "./views/ExtendDuration";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { ConfigProvider, theme } from "antd";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import Test from "./views/Test";
import { SnackbarProvider } from "notistack";
let tout = "";

function App() {
  const [isHome, setIsHome] = useState(true);
  useEffect(() => {
    tout = setInterval(function () {
      let tmp = window.location.pathname === "/";
      if (tmp !== isHome) {
        setIsHome(tmp);
      }
    }, 100);
    return () => {
      clearInterval(tout);
    };
  });
  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[new PhantomWalletAdapter()]} autoConnect={true}>
        <WalletModalProvider>
          <BrowserRouter>
            <ConfigProvider
              theme={{
                algorithm: theme.darkAlgorithm,
              }}>
              <SnackbarProvider
                anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                {!isHome && <Menu className="page-header" />}
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/market" element={<Market />} />
                  <Route path="/mydevice" element={<MyDevice />} />
                  <Route path="/myorder" element={<MyOrder />} />
                  <Route path="/order-detail/:uuid" element={<OrderDetail />} />
                  <Route path="/buy/:id" element={<Buy />} />
                  <Route path="/makeoffer/:id" element={<MakeOffer />} />
                  <Route
                    path="/extend-duration/:id"
                    element={<ExtendDuration />}
                  />
                  <Route path="/faucet" element={<Faucet />} />
                  <Route path="/test" element={<Test />} />
                </Routes>
                <Footer />
              </SnackbarProvider>
            </ConfigProvider>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
