import styled from "styled-components";
import React, { useState, useEffect, useCallback } from "react";
import OrderList from "@/components/OrderList";
import { getOrderList, filterData, checkIfPrepared } from "@/services/order";
import Pager from "@/components/pager";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import Filter from "@/components/Filter";
import { ToggleButton, ToggleButtonGroup, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import * as anchor from "@project-serum/anchor";
import webconfig from "@/webconfig.js";

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
          const [orderPublicKey] = anchor.web3.PublicKey.findProgramAddressSync(
            [
              anchor.utils.bytes.utf8.encode("order"),
              wallet.publicKey.toBytes(),
              anchor.utils.bytes.hex.decode(item.Uuid),
            ],
            webconfig.PROGRAM
          );
          console.log(orderPublicKey.toString());
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
    </div>
  );
}

export default styled(MyOrder)`
  h1 {
    margin: 0;
    padding-bottom: 24px;
  }
`;
