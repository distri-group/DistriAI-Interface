import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import DeviceList from "@/components/DeviceList";
import Pager from "@/components/Pager";
import { getMachineList, getFilterData } from "@/services/machine";
import Filter from "@/components/Filter";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Stack, Tab } from "@mui/material";
import ItemList from "@/components/ItemList";

function Market({ className }) {
  document.title = "Market";
  const { state } = useLocation();
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState({});
  const [filterValue, setFilterValue] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [type, setType] = useState("computing-power");

  // Load Machine List
  async function loadList(curr) {
    setLoading(true);
    try {
      const res = await getMachineList(curr, 10, filterValue);
      setTotal(res.Total);
      setList(res.List);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setLoading(false);
  }

  // Initialize Filter
  useEffect(() => {
    async function loadFilterData() {
      try {
        const res = await getFilterData();
        setFilterData(res);
        let filter = {};
        Object.entries(res).forEach(([key, value]) => {
          filter[key] = "all";
        });
      } catch (error) {}
    }
    loadFilterData();
  }, []);

  // Reload List
  useEffect(() => {
    loadList(current);
    // eslint-disable-next-line
  }, [current, filterValue]);

  return (
    <Stack className={className} spacing={3}>
      <h1>Resource Market</h1>
      <label className="subtitle">
        Select the resources you need before starting the model training task
      </label>
      <div>
        <TabContext value={type}>
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
          <div>
            <TabPanel value="computing-power">
              <Filter
                data={filterData}
                defaultValue={{
                  Gpu: "all",
                  GpuCount: "all",
                  Region: "all",
                  OrderBy: "all",
                }}
                onFilter={(value) => {
                  setCurrent(1);
                  setFilterValue(value);
                }}
                loading={loading}
              />
              <DeviceList
                list={list}
                loading={loading}
                model={state}
                onPriceSort={(sort) => {
                  setFilterValue((prev) => ({ ...prev, PriceOrder: sort }));
                }}
              />
              {total > 10 && (
                <Pager
                  current={current}
                  total={total}
                  pageSize={10}
                  onChange={(page) => setCurrent(page)}
                  className="Pager"
                />
              )}
            </TabPanel>
            <TabPanel value="model">
              <ItemList type="model" />
            </TabPanel>
            <TabPanel value="dataset">
              <ItemList type="dataset" />
            </TabPanel>
          </div>
        </TabContext>
      </div>
    </Stack>
  );
}

export default styled(Market)`
  h1 {
    margin: 0;
  }
`;
