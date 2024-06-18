import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Button, Stack, Tab } from "@mui/material";
import { useEffect, useState } from "react";
import { getTotalSize } from "@/services/model";
import styled from "styled-components";
import { useWallet } from "@solana/wallet-adapter-react";
import MyDevice from "@/components/MyDevice";
import MyCreation from "@/components/MyCreation";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import prettyBytes from "pretty-bytes";

function Resource({ className }) {
  const [type, setType] = useState("computing-power");
  const toBeNavigated = type === "dataset" ? "dataset" : "model";
  const [usedStorage, setStorage] = useState(0);
  const navigate = useNavigate();
  const wallet = useWallet();
  const { enqueueSnackbar } = useSnackbar();
  const getSize = async () => {
    try {
      const total = await getTotalSize(wallet);
      setStorage(total);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };
  useEffect(() => {
    if (wallet.publicKey) {
      getSize();
    }
    // eslint-disable-next-line
  }, [wallet?.publicKey]);
  return (
    <Stack className={className} spacing={3}>
      <h1>My resources sharing space</h1>
      <label className="subtitle">Manage all my shared resources</label>
      <Stack className="trans-box" justifyContent="space-between">
        <h2>Storage</h2>
        <Stack direction="row" spacing={2} alignItems="center">
          <label>Used</label>
          <b>{prettyBytes(usedStorage)}</b>
        </Stack>
      </Stack>
      <div>
        <TabContext value={type}>
          <Stack direction="row" justifyContent="space-between">
            <TabList
              onChange={(e, value) => setType(value)}
              TabIndicatorProps={{
                style: { display: "none" },
              }}>
              <Tab
                className="tab-item"
                label="Computing Power"
                value="computing-power"
              />
              <Tab className="tab-item" label="Models" value="model" />
              <Tab className="tab-item" label="Datasets" value="dataset" />
            </TabList>
            <Button
              className="cbtn"
              style={{ width: 160 }}
              onClick={() => navigate(`${toBeNavigated}/add`)}>
              Share {toBeNavigated}
            </Button>
          </Stack>
          <div>
            <TabPanel value="computing-power">
              <MyDevice />
            </TabPanel>
            <TabPanel value="model">
              <MyCreation type="model" />
            </TabPanel>
            <TabPanel value="dataset">
              <MyCreation type="dataset" />
            </TabPanel>
          </div>
        </TabContext>
      </div>
    </Stack>
  );
}

export default styled(Resource)`
  .trans-box {
    height: 200px;
    b {
      font-size: 32px;
      line-height: 44px;
    }
    span {
      font-size: 18px;
      line-height: 32px;
    }
  }
`;
