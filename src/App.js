import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useEffect, useMemo } from "react";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SnackbarProvider } from "notistack";
import { ThemeProvider, createTheme } from "@mui/material/styles/index.js";
import { Buffer } from "buffer";
import { useNavigate, Navigate } from "react-router-dom";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import KeepAliveLayout from "./KeepAliveLayout.jsx";
import Faucet from "@/views/Faucet.jsx";
import Home from "@/views/Home.jsx";
import Test from "@/views/Test.jsx";
import Buy from "@/views/market/Buy.jsx";
import Market from "@/views/market/Market.jsx";
import Resource from "@/views/resource/Resource.jsx";
import MakeOffer from "@/views/resource/MakeOffer.jsx";
import Create from "@/views/resource/model&dataset/Create.jsx";
import Detail from "@/views/resource/model&dataset/Detail.jsx";
import FileUpload from "@/views/resource/model&dataset/FileUpload.jsx";
import Token from "@/views/token/Token.jsx";
import EarningDetail from "@/views/token/EarningDetail.jsx";
import RewardDetail from "@/views/token/RewardDetail.jsx";
import ModelRewardDetail from "@/views/token/ModelRewardDetail.jsx";
import Training from "@/views/training/Training.jsx";
import EndDuration from "@/views/training/EndDuration.jsx";
import ExtendDuration from "@/views/training/ExtendDuration.jsx";
import OrderDetail from "@/views/training/OrderDetail.jsx";

function App() {
  window.Buffer = Buffer;
  const network = WalletAdapterNetwork.Devnet;
  const endPoint = useMemo(() => clusterApiUrl(network), [network]);
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
        styleOverrides: {
          root: {
            ".MuiOutlinedInput-input": {
              padding: "18px 16px",
            },
            ".MuiOutlinedInput-notchedOutline": {
              padding: "18px 16px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#898989",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#898989",
            },
            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#898989",
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            ".MuiOutlinedInput-input": {
              padding: "18px 16px",
            },
            ".MuiOutlinedInput-notchedOutline": {
              padding: "18px 16px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#898989",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              top: -12,
              borderColor: "#898989!important",
            },
          },
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
            padding: 16,
            color: "white",
          },
          icon: {
            color: "white",
          },
        },
        defaultProps: {
          MenuProps: {
            sx: {
              "@media(max-width: 1920px) and (max-height: 1080px)": {
                zoom: "75%",
              },
            },
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            background: "rgba(149, 157, 165, 0.16)",
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
            backgroundColor: "transparent",
            color: "white",
            borderColor: "white",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            background: "rgba(149,157,165,0.08)",
          },
        },
      },
      MuiTabPanel: {
        styleOverrides: {
          root: {
            padding: 0,
            borderRadius: 8,
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
    const handleNavigate = ({ detail }) => {
      if (detail.type === "routeChange") {
        navigate(detail.path);
      }
    };
    window.addEventListener("qiankunRouter", handleNavigate);
    return () => {
      window.removeEventListener("routeChange", handleNavigate);
    };
    // eslint-disable-next-line
  }, []);
  return (
    <ConnectionProvider endpoint={endPoint}>
      <WalletProvider
        wallets={[new SolflareWalletAdapter()]}
        autoConnect={true}>
        <WalletModalProvider>
          <ThemeProvider theme={Mtheme}>
            <SnackbarProvider
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              autoHideDuration={3000}>
              <Routes>
                <Route index element={<Navigate to="home" />} />
                <Route path="home" element={<Home />} />
                <Route path="/*" element={<KeepAliveLayout />}>
                  <Route path="market" element={<Market />} />
                  <Route path="resource" element={<Resource />} />
                  <Route path="device">
                    <Route path=":id">
                      <Route path="buy" element={<Buy />} />
                      <Route path="list" element={<MakeOffer />} />
                    </Route>
                  </Route>
                  <Route path="model">
                    <Route
                      path=":owner/:name"
                      element={<Detail type="model" />}
                    />
                    <Route path="add" element={<Create type="model" />} />
                  </Route>
                  <Route path="dataset">
                    <Route
                      path=":owner/:name"
                      element={<Detail type="dataset" />}
                    />
                    <Route path="add" element={<Create type="dataset" />} />
                  </Route>
                  <Route path="training" element={<Training />} />
                  <Route path="order">
                    <Route path=":id">
                      <Route index element={<OrderDetail />} />
                      <Route path="extend" element={<ExtendDuration />} />
                      <Route path="end" element={<EndDuration />} />
                      <Route path="create-model" element={<FileUpload />} />
                    </Route>
                  </Route>
                  <Route path="token" element={<Token />} />
                  <Route path="reward">
                    <Route
                      path="model/:period"
                      element={<ModelRewardDetail />}
                    />
                    <Route path=":period" element={<RewardDetail />} />
                  </Route>
                  <Route path="earning">
                    <Route path=":id" element={<EarningDetail />} />
                  </Route>
                  <Route path="faucet" element={<Faucet />} />
                  <Route path="test" element={<Test />} />
                </Route>
              </Routes>
            </SnackbarProvider>
          </ThemeProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
