import "./App.css";
import { Routes, Route } from "react-router-dom";
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
import NavBar from "@/components/NavBar";
import Home from "@/views/Home";
import Faucet from "@/views/Faucet";
import Market from "@/views/buyer/Market";
import Buy from "@/views/buyer/Buy";
import MyOrder from "@/views/buyer/MyOrder";
import OrderDetail from "@/views/buyer/OrderDetail";
import ExtendDuration from "@/views/buyer/ExtendDuration";
import EndDuration from "@/views/buyer/EndDuration";
import MyDevice from "@/views/seller/MyDevice";
import MakeOffer from "@/views/seller/MakeOffer";
import Reward from "@/views/seller/Reward";
import RewardDetail from "@/views/seller/RewardDetail";
import Earning from "@/views/seller/Earning";
import EarningDetail from "@/views/seller/EarningDetail";
import Contents from "@/views/model&dataset/Contents";
import Create from "@/views/model&dataset/Create";
import Detail from "@/views/model&dataset/Detail";
import { useNavigate } from "react-router-dom";

function App() {
  window.Buffer = Buffer;
  const [isHome, setIsHome] = useState(true);
  const navigate = useNavigate();
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
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "white",
          },
        },
      },
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
      MuiChip: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: "#555",
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
      MuiTab: {
        styleOverrides: {
          root: {
            backgroundColor: "#2d2d2d",
          },
        },
      },
      MuiTabPanel: {
        styleOverrides: {
          root: {
            padding: "24px 0",
            backgroundColor: "#2d2d2d",
            borderRadius: "0 15px 15px 15px",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            color: "white",
            paddingBottom: 4,
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: "white",
            "&.Mui-checked": {
              color: "#0aab50",
            },
          },
        },
      },
    },
  });
  useEffect(() => {
    const tout = setInterval(function () {
      let tmp = window.location.pathname === "/home";
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
  useEffect(() => {
    const handleNavigate = ({ detail }) => {
      if (detail.type === "routeChange") {
        navigate(detail.path);
      }
    };
    window.addEventListener("qiankunRouter", handleNavigate);
    return () => {
      window.removeEventListener("routeChange", handleNavigate);
    };
  }, []);
  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect={true}>
        <WalletModalProvider>
          <ThemeProvider theme={Mtheme}>
            <SnackbarProvider
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              autoHideDuration={3000}>
              {!isHome && <NavBar className="page-header" />}
              <Routes>
                <Route path="home" element={<div id="home" />} />
                <Route path="market" element={<Market />} />
                <Route path="device">
                  <Route index element={<MyDevice />} />
                  <Route path=":id">
                    <Route path="buy" element={<Buy />} />
                    <Route path="list" element={<MakeOffer />} />
                  </Route>
                </Route>
                <Route path="order">
                  <Route index element={<MyOrder />} />
                  <Route path=":id">
                    <Route index element={<OrderDetail />} />
                    <Route path="extend" element={<ExtendDuration />} />
                    <Route path="end" element={<EndDuration />} />
                  </Route>
                </Route>
                <Route path="reward">
                  <Route index element={<Reward />} />
                  <Route path=":period" element={<RewardDetail />} />
                </Route>
                <Route path="earning">
                  <Route index element={<Earning />} />
                  <Route path=":id" element={<EarningDetail />} />
                </Route>
                <Route path="model">
                  <Route index element={<Contents type="model" />} />
                  <Route
                    path=":owner/:name"
                    element={<Detail type="model" />}
                  />
                  <Route path="add" element={<Create type="model" />} />
                </Route>
                <Route path="dataset">
                  <Route index element={<Contents type="dataset" />} />
                  <Route
                    path=":owner/:name"
                    element={<Detail type="dataset" />}
                  />
                  <Route path="add" element={<Create type="dataset" />} />
                </Route>
                <Route path="faucet" element={<Faucet />} />
              </Routes>
            </SnackbarProvider>
          </ThemeProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
