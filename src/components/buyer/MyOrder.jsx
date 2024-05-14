import styled from "styled-components";
import React, { useState, useEffect } from "react";
import OrderList from "@/components/OrderList";
import { getOrderList, filterData, checkIfPrepared } from "@/services/order";
import Pager from "@/components/pager";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import Filter from "@/components/Filter";
import { ToggleButton, ToggleButtonGroup, Stack } from "@mui/material";

function MyOrder({ className }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterValue, setFilterValue] = useState({
    Direction: "buy",
    Status: "all",
  });
  const wallet = useAnchorWallet();

  async function loadList(curr, filter) {
    setLoading(true);
    try {
      const res = await getOrderList(
        curr,
        10,
        filter,
        wallet.publicKey.toString()
      );
      setTotal(res.Total);
      setList(res.List);
    } catch (error) {}
    setLoading(false);
  }
  useEffect(() => {
    if (wallet?.publicKey) {
      loadList(current, filterValue);
    }
  }, [wallet, filterValue, current]);
  useEffect(() => {
    const timers = [];
    for (const item of list) {
      if (item.StatusName === "Preparing") {
        const timer = setInterval(async () => {
          const prepared = await checkIfPrepared(item);
          if (prepared) {
            clearInterval(timer);
            loadList(current);
          }
        }, 3000);
        timers.push(timer);
      }
    }
    return () => {
      timers.forEach((timer) => clearInterval(timer));
    };
  }, [list]);
  return (
    <div className={className}>
      <ToggleButtonGroup>
        <Stack direction="row" spacing={2}>
          <ToggleButton
            value="gpu"
            sx={{ width: 160, padding: "4px", textTransform: "none" }}>
            GPU Orders
          </ToggleButton>
          <ToggleButton
            disabled
            value="dataset"
            sx={{ width: 160, padding: "4px", textTransform: "none" }}>
            Datasets Orders
          </ToggleButton>
          <ToggleButton
            disabled
            value="api"
            sx={{ width: 160, padding: "4px", textTransform: "none" }}>
            API Orders
          </ToggleButton>
        </Stack>
      </ToggleButtonGroup>
      <Filter
        data={filterData}
        defaultValue={{
          Direction: "buy",
          Status: "all",
        }}
        onFilter={(value) => {
          setCurrent(1);
          setFilterValue(value);
        }}
        loading={loading}
      />
      <OrderList
        list={list}
        loading={loading}
        reloadFunc={() => loadList(current)}
      />
      {total > 10 && (
        <Pager
          current={current}
          total={total}
          pageSize={10}
          onChange={(curr) => {
            setCurrent(curr);
          }}
        />
      )}
    </div>
  );
}

export default styled(MyOrder)`
  h1 {
    margin: 0;
    padding-bottom: 24px;
  }
`;
