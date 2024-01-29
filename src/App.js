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
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SnackbarProvider } from "notistack";
import { ThemeProvider, createTheme } from "@mui/material/styles";
let tout = "";

function App() {
  const [isHome, setIsHome] = useState(true);
  const Mtheme = createTheme({
    typography: {
      fontFamily: "Montserrat, sans-serif",
    },
    components: {
      MuiMenu: {
        styleOverrides: {
          list: {
            '&[role="menu"]': {
              backgroundColor: "#0aab50",
              color: "white",
            },
          },
        },
      },
    },
  });
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
            <ThemeProvider theme={Mtheme}>
              <SnackbarProvider
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={3000}>
                {!isHome && <Menu className="page-header" />}
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/market" element={<Market />} />
                  <Route path="/device" element={<MyDevice />} />
                  <Route path="/order" element={<MyOrder />} />
                  <Route path="/order/:uuid" element={<OrderDetail />} />
                  <Route path="/buy/:id" element={<Buy />} />
                  <Route path="/makeoffer/:id" element={<MakeOffer />} />
                  <Route
                    path="/extend-duration/:id"
                    element={<ExtendDuration />}
                  />
                  <Route path="/faucet" element={<Faucet />} />
                </Routes>
                <Footer />
              </SnackbarProvider>
            </ThemeProvider>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
