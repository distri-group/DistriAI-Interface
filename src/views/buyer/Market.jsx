import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import DeviceList from "@/components/DeviceList";
import Pager from "@/components/pager";
import { getMachineList, getFilterData } from "@/services/machine";
import Filter from "@/components/Filter";

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
    <div className={className}>
      <h1 className="title">Computing Power Market</h1>
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
      />
      <div className="con-table">
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
            className="pager"
          />
        )}
      </div>
    </div>
  );
}

export default styled(Market)`
  width: 100%;
  .title {
    font-weight: 600;
    font-size: 32px;
    line-height: 44px;
    margin: 0;
  }
  .filter {
    padding-top: 24px;
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
