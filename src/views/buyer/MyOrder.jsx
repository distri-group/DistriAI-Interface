import styled from "styled-components";
import React, { useState, useEffect } from "react";
import OrderList from "../../components/OrderList";
import { getOrderList, filterData } from "../../services/order";
import Pager from "../../components/pager";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { MenuItem, Select, Stack } from "@mui/material";

function MyOrder({ className }) {
  document.title = "My Order";
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterValue, setFilterValue] = useState({
    Direction: "buy",
    Status: "all",
  });
  const wallet = useAnchorWallet();

  function onFilter(event) {
    setFilterValue((prevState) => ({
      ...prevState,
      Status: parseInt(event.target.value),
    }));
    setCurrent(1);
  }
  useEffect(() => {
    async function loadList(curr) {
      setLoading(true);
      try {
        const res = await getOrderList(
          curr,
          10,
          filterValue,
          wallet.publicKey.toString()
        );
        setTotal(res.Total);
        setList(res.List);
      } catch (error) {}
      setLoading(false);
    }
    if (wallet?.publicKey) {
      loadList(current);
    }
  }, [wallet, filterValue, current]);

  return (
    <div className={className}>
      <div className="con">
        <h1 className="title">My Orders</h1>
        <Stack direction="row" spacing={2} className="filter">
          <span className="txt">Filter</span>
          {Object.entries(filterData).map(([key, value]) => (
            <span key={key}>
              <Select value={filterValue[key]} onChange={onFilter}>
                {value.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </span>
          ))}
          <span
            className="btn-txt"
            onClick={() => setFilterValue({ Direction: "buy", Status: "all" })}>
            reset
          </span>
        </Stack>
        <div className="con-table">
          <OrderList list={list} loading={loading} />
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
      </div>
    </div>
  );
}

export default styled(MyOrder)`
  display: block;
  width: 100%;
  min-height: calc(100% - 160px);
  color: #fff;
  .filter {
    padding: 11px 0;
    display: flex;
    flex-direction: row;
    line-height: 30px;
    .txt {
      font-size: 14px;
      line-height: 30px;
      height: 30px;
      display: block;
    }
    .sel {
      padding: 0px 7px;
    }
    .btn-txt {
      font-weight: 700;
      font-size: 14px;
      text-decoration: underline;
      color: #ffffff;
      cursor: pointer;
    }
  }
  .con {
    .title {
      font-weight: 700;
      font-style: normal;
      font-size: 28px;
      color: #ffffff;
      padding-left: 36px;
      background-image: url(/img/market/seller.png);
      background-repeat: no-repeat;
      background-size: 26px;
      background-position: left;
      margin-top: 25px;
    }
  }
  .block {
    display: block;
    overflow: hidden;
  }
`;
