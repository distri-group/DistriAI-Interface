import KeepAlive, { useKeepaliveRef } from "keepalive-for-react";
import NavBar from "@/components/NavBar.jsx";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program } from "@project-serum/anchor";
import webconfig from "@/webconfig.js";
import { useSnackbar } from "notistack";
import { ClearCacheProvider } from "./components/ClearCacheProvider";

const ProgramContext = createContext(null);

export const useProgram = () => useContext(ProgramContext);

export default function KeepAliveLayout() {
  const aliveRef = useKeepaliveRef();
  const outlet = useOutlet();
  const location = useLocation();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const cacheKey = useMemo(
    () => location.pathname + location.search,
    [location]
  );
  const [program, setProgram] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const programInit = async () => {
      try {
        const provider = new AnchorProvider(connection, wallet, {});
        const idl = await Program.fetchIdl(webconfig.PROGRAM, provider);
        const program = new Program(idl, webconfig.PROGRAM, provider);
        setProgram(program);
      } catch (error) {
        enqueueSnackbar(
          "Solana program not initialized. Please check your network connection and refresh the page.",
          { variant: "error" }
        );
      }
    };
    if (wallet?.publicKey) {
      programInit();
    }
  }, [wallet]);

  return (
    <ProgramContext.Provider value={program}>
      <div className="bg" />
      <div id="App">
        <NavBar />
        <KeepAlive
          activeName={cacheKey}
          include={["/model", "/dataset"]}
          aliveRef={aliveRef}
          max={2}
          strategy="PRE">
          <ClearCacheProvider aliveRef={aliveRef}>{outlet}</ClearCacheProvider>
        </KeepAlive>
      </div>
    </ProgramContext.Provider>
  );
}
