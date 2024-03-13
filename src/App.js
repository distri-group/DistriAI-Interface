import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SnackbarProvider } from "notistack";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Buffer } from "buffer";
import Home from "./views/Home";
import Buy from "./views/Buy";
import Market from "./views/Market";
import MakeOffer from "./views/MakeOffer";
import OrderDetail from "./views/OrderDetail";
import MyDevice from "./views/MyDevice";
import MyOrder from "./views/MyOrder";
import Faucet from "./views/Faucet";
import ExtendDuration from "./views/ExtendDuration";
import NavBar from "./components/NavBar";
import Rewards from "./views/Rewards";
import EndDuration from "./views/EndDuration";
import Earning from "./views/Earning";
import EarningDetail from "./views/EarningDetail";
import RewardDetail from "./views/RewardDetail";

function App() {
  window.Buffer = Buffer;
  const [isHome, setIsHome] = useState(true);
  const Mtheme = createTheme({
    palette: {
      white: {
        main: "#fff",
        light: "#fff",
        dark: "#fff",
        contrastText: "#000",
      },
    },
    components: {
      MuiTextField: {
        defaultProps: {
          fullWidth: true,
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: "white",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
          "&:disabled": {
            color: "white",
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            padding: "4px",
            color: "white",
            paddingLeft: "12px",
          },
          icon: {
            color: "white",
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              backgroundColor: "white",
              borderColor: "black",
              color: "black",
              "&:hover": {
                backgroundColor: "white",
                color: "black",
              },
            },
            color: "white",
            borderColor: "white",
          },
        },
      },
    },
  });
  useEffect(() => {
    const tout = setInterval(function () {
      let tmp = window.location.pathname === "/";
      if (tmp !== isHome) {
        setIsHome(tmp);
      }
    }, 100);
    return () => {
      clearInterval(tout);
    };
  });
  useEffect(() => {
    const setViewportContent = () => {
      const screenWidth = window.screen.width;
      const isSmallScreen = screenWidth > 500;
      const metaViewport = document.querySelector('meta[name="viewport"]');
      if (isSmallScreen) {
        metaViewport.setAttribute("content", "width=1920");
      } else {
        metaViewport.setAttribute("content", "width=500");
      }
    };
    setViewportContent();
    window.addEventListener("resize", setViewportContent);
    return () => {
      window.removeEventListener("resize", setViewportContent);
    };
  }, []);
  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect={true}>
        <WalletModalProvider>
          <BrowserRouter>
            <ThemeProvider theme={Mtheme}>
              <SnackbarProvider
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={3000}>
                {!isHome && <NavBar className="page-header" />}
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/market" element={<Market />} />
                  <Route path="/device" element={<MyDevice />} />
                  <Route path="/order" element={<MyOrder />} />
                  <Route path="/order/:id" element={<OrderDetail />} />
                  <Route path="/buy/:id" element={<Buy />} />
                  <Route path="/makeoffer/:id" element={<MakeOffer />} />
                  <Route
                    path="/extend-duration/:id"
                    element={<ExtendDuration />}
                  />
                  <Route path="/end-duration/:id" element={<EndDuration />} />
                  <Route path="/faucet" element={<Faucet />} />
                  <Route path="/reward" element={<Rewards />} />
                  <Route path="/reward/:period" element={<RewardDetail />} />
                  <Route path="/earning" element={<Earning />} />
                  <Route path="/earning/:id" element={<EarningDetail />} />
                </Routes>
              </SnackbarProvider>
            </ThemeProvider>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
