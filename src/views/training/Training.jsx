import { useState, useCallback, useEffect } from "react";
import { Stack } from "@mui/material";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useSnackbar } from "notistack";
import Filter from "@/components/Filter";
import OrderList from "@/components/OrderList";
import Pager from "@/components/Pager";
import { getOrderList, filterData, checkIfPrepared } from "@/services/order";
import styled from "styled-components";

function Training({ className }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterValue, setFilterValue] = useState({
    Direction: "buy",
    Status: "all",
  });
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOrderList(
        current,
        10,
        filterValue,
        wallet.publicKey.toString()
      );
      setTotal(res.Total);
      setList(res.List);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setLoading(false);
    // eslint-disable-next-line
  }, [current, filterValue, wallet]);
  useEffect(() => {
    if (wallet?.publicKey) {
      loadList();
    } else {
      setList([]);
      setTotal(0);
    }
  }, [wallet, filterValue, current, loadList]);
  useEffect(() => {
    const timers = [];
    for (const item of list) {
      if (item.StatusName === "Preparing") {
        const timer = setInterval(async () => {
          const prepared = await checkIfPrepared(item);
          if (prepared) {
            clearInterval(timer);
            loadList();
          }
        }, 3000);
        timers.push(timer);
      }
    }
    return () => {
      timers.forEach((timer) => clearInterval(timer));
    };
  }, [list, loadList]);
  return (
    <Stack className={className}>
      <h1>My model training and deployment task center</h1>
      <label style={{ margin: "24px 0" }}>
        Select the resources you need before starting the model training task
      </label>
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
        style={{
          height: 48,
          padding: "24px 40px",
          background: "transparent",
        }}
      />
      <OrderList list={list} loading={loading} reloadFunc={loadList} />
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
    </Stack>
  );
}
export default styled(Training)``;
