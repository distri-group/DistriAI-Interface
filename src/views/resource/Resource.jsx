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
  useEffect(() => {
    if (wallet?.publicKey) {
      getTotalSize();
    }
    // eslint-disable-next-line
  }, [wallet]);
  return (
    <Stack className={className} spacing={3}>
      <h1>My resources sharing space</h1>
      <label>Manage all my shared resources</label>
      <Stack className="trans-box" justifyContent="space-between">
        <Stack direction="row" spacing={3} alignItems="end">
          <h2>Storage</h2>
          <label>Used</label>
          <span>
            <b>{usedStorage}</b>GB
          </span>
        </Stack>
        <Stack
          direction="row"
          spacing={3}
          alignItems="end"
          style={{ marginLeft: 24 }}>
          <label>Remain</label>
          <span>
            <b>{remainStorage}</b>GB
          </span>
          <Button className="cbtn" style={{ width: 200 }}>
            Buy
          </Button>
        </Stack>
      </Stack>
      <div>
        <TabContext value={type}>
          <TabList
            onChange={(e, value) => setType(value)}
            TabIndicatorProps={{
              style: { display: "none" },
            }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              style={{ width: "100%" }}>
              <div>
                <Tab
                  className="tab-item"
                  label="Computing Power"
                  value="computing-power"
                />
                <Tab className="tab-item" label="Models" value="model" />
                <Tab className="tab-item" label="Datasets" value="dataset" />
              </div>
              <Button
                onClick={() => {
                  if (type === "dataset") {
                    navigate("/dataset/add");
                  } else {
                    navigate("/model/add");
                  }
                }}
                className="cbtn"
                style={{
                  width: 200,
                }}>
                Share
              </Button>
            </Stack>
          </TabList>
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
  }
`;
