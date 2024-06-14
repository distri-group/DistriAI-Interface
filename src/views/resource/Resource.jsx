import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Button, Stack, Tab } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { getTypeTotalSize } from "@/services/model";
import styled from "styled-components";
import { useWallet } from "@solana/wallet-adapter-react";
import MyDevice from "@/components/MyDevice";
import MyCreation from "@/components/MyCreation";
import { useNavigate } from "react-router-dom";

function Resource({ className }) {
  const [type, setType] = useState("computing-power");
  const availableStorage = 100;
  const [usedStorage, setStorage] = useState(0);
  const remainStorage = useMemo(
    () => availableStorage - usedStorage,
    [usedStorage]
  );
  const navigate = useNavigate();
  const wallet = useWallet();
  const getTotalSize = async () => {
    try {
      const modelTotal = await getTypeTotalSize("model", wallet);
      const datasetTotal = await getTypeTotalSize("dataset", wallet);
      setStorage(modelTotal + datasetTotal);
    } catch (error) {
      console.error(error);
    }
  };
  const handleNavigate = () => {
    if (type === "dataset") {
      navigate("/dataset/add");
    } else {
      navigate("/model/add");
    }
  };
  useEffect(() => {
    if (wallet?.publicKey) {
      getTotalSize();
    }
    // eslint-disable-next-line
  }, [wallet]);
  return (
    <Stack className={className} spacing={3}>
      <h1>My resources sharing space</h1>
      <label className="subtitle">Manage all my shared resources</label>
      <Stack className="trans-box" justifyContent="space-between">
        <Stack direction="row" spacing={2} alignItems="end">
          <h2>Storage</h2>
          <label>Used</label>
          <b>{usedStorage}</b>
          <span>GB</span>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          alignItems="end"
          style={{ marginLeft: 24 }}>
          <label>Remain</label>
          <b>{remainStorage}</b>
          <span>GB</span>
          <Button className="cbtn" style={{ width: 200 }}>
            Buy
          </Button>
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
              onClick={handleNavigate}>
              Share
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
