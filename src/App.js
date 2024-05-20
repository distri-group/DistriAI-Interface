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
import Faucet from "@/views/Faucet.jsx";
import Market from "@/views/buyer/Market.jsx";
import Buy from "@/views/buyer/Buy.jsx";
import OrderDetail from "@/views/buyer/OrderDetail.jsx";
import ExtendDuration from "@/views/buyer/ExtendDuration.jsx";
import EndDuration from "@/views/buyer/EndDuration.jsx";
import MyDevice from "@/views/seller/MyDevice.jsx";
import MakeOffer from "@/views/seller/MakeOffer.jsx";
import Reward from "@/views/seller/Reward.jsx";
import RewardDetail from "@/views/seller/RewardDetail.jsx";
import Earning from "@/views/seller/Earning.jsx";
import EarningDetail from "@/views/seller/EarningDetail.jsx";
import Contents from "@/views/model&dataset/Contents.jsx";
import Create from "@/views/model&dataset/Create.jsx";
import Detail from "@/views/model&dataset/Detail.jsx";
import { useNavigate, Navigate } from "react-router-dom";
import Test from "@/views/Test.jsx";
import { clusterApiUrl } from "@solana/web3.js";
import Dashboard from "@/views/buyer/Dashboard.jsx";
import KeepAliveLayout from "./KeepAliveLayout.jsx";
import FileUpload from "./views/model&dataset/FileUpload.jsx";
import Home from "./views/Home.jsx";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

function App() {
  window.Buffer = Buffer;
  const network = WalletAdapterNetwork.Devnet;
  const endPoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter({ clusterApiUrl: network })],
    [network]
  );
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
          root: {
            border: "1px solid #898989",
            "&$focused": {
              borderColor: "red",
            },
            "&$focused $notchedOutline": {
              borderColor: "inherit !important",
            },
          },
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
      <WalletProvider wallets={wallets} autoConnect={true}>
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
                  <Route path="device">
                    <Route index element={<MyDevice />} />
                    <Route path=":id">
                      <Route path="buy" element={<Buy />} />
                      <Route path="list" element={<MakeOffer />} />
                    </Route>
                  </Route>
                  <Route path="order">
                    <Route path=":id">
                      <Route index element={<OrderDetail />} />
                      <Route path="extend" element={<ExtendDuration />} />
                      <Route path="end" element={<EndDuration />} />
                      <Route path="create-model" element={<FileUpload />} />
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
                  <Route path="dashboard" element={<Dashboard />} />
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
