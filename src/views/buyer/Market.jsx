import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { MenuItem, Select, Stack } from "@mui/material";
import { useLocation } from "react-router-dom";
import DeviceList from "../../components/DeviceList";
import Pager from "../../components/pager";
import { getMachineList, getFilterData } from "../../services/machine";

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

  // Machine Filter Change
  function onFilter(key, value) {
    setFilterValue((prevState) => ({ ...prevState, [key]: value }));
  }

  // Reset Machine Filter
  function resetFilter() {
    setFilterValue((prevState) => {
      const resetState = {};
      Object.keys(prevState).forEach((key) => {
        resetState[key] = "all";
      });
      return resetState;
    });
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
        setFilterValue(filter);
      } catch (error) {}
    }
    loadFilterData();
  }, []);

  // Reload List
  useEffect(() => {
    if (filterValue && current && Object.keys(filterValue).length > 0) {
      loadList(current);
    }
    // eslint-disable-next-line
  }, [filterValue, current]);

  return (
    <div className={className}>
      <h1 className="title">Computing Power Market</h1>
      <Stack className="filter" direction="row" spacing={2}>
        <span>Filter</span>
        {Object.entries(filterData).map(([key, value]) => (
          <span key={key}>
            <Select
              value={filterValue[key]}
              onChange={(e) => onFilter(key, e.target.value)}>
              {value.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </span>
        ))}
        <span className="btn-txt" onClick={resetFilter}>
          reset
        </span>
      </Stack>
      <div className="con-table">
        <DeviceList
          list={list}
          loading={loading}
          onPriceSort={(value) => onFilter("PriceOrder", value)}
          model={state}
        />
        {total > 10 && (
          <Pager
            current={current}
            total={total}
            pageSize={10}
            onChange={(page) => setCurrent(page)}
            className="pager"
          />
        )}
      </div>
    </div>
  );
}

export default styled(Market)`
  width: 1200px;
  margin: 10px auto;
  padding: 0 20px;
  .title {
    font-weight: 700;
    font-style: normal;
    font-size: 28px;
    padding-left: 36px;
    background-image: url(/img/market/market.png);
    background-repeat: no-repeat;
    background-size: 20px;
    background-position: left;
    margin-top: 25px;
  }
  .filter {
    padding: 11px 0;
    display: flex;
    flex-direction: row;
    line-height: 30px;
    .btn-txt {
      font-weight: 700;
      font-size: 14px;
      text-decoration: underline;
      cursor: pointer;
    }
  }
`;
