import styled from "styled-components";
import React, { useState, useEffect } from "react";
import OrderList from "../components/OrderList";
import { getOrderList } from "../services/order";
import Pager from "../components/pager";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useSnackbar } from "notistack";
import { MenuItem, Select } from "@mui/material";

const filterData = [
  { label: "All Status", value: "all" },
  { label: "Preparing", value: "0" },
  { label: "Available", value: "1" },
  { label: "Completed", value: "2" },
  { label: "Failed", value: "3" },
  { label: "Refunded", value: "4" },
];

function Home({ className }) {
  document.title = "My Order";
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterValue, setFilterValue] = useState({
    Direction: "buy",
  });
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();

  const onFilter = (e) => {
    const { value, name } = e.target;
    setFilterValue((prevState) => ({ ...prevState, [name]: value }));
    setCurrent(1);
  };
  useEffect(() => {
    const loadList = async (curr) => {
      setLoading(true);
      try {
        const res = await getOrderList(
          curr,
          filterValue,
          wallet.publicKey.toString()
        );
        setLoading(false);
        if (!res) {
          return enqueueSnackbar("Order List Not Found", { variant: "error" });
        }
        setTotal(res.total);
        setList(res.list);
      } catch (e) {
        return enqueueSnackbar(e.message, { variant: "error" });
      }
    };
    if (wallet?.publicKey) {
      loadList(current);
    }
  }, [wallet?.publicKey, filterValue, current]);

  return (
    <div className={className}>
      <div className="con">
        <h1 className="title">My Orders</h1>
        <div className="filter">
          <span className="txt">Filter</span>
          <span className="sel">
            <Select
              className="select"
              defaultValue="all"
              name="Status"
              value={filterValue.Status}
              onChange={onFilter}>
              {filterData.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </span>
          <span
            className="btn-txt"
            onClick={() => setFilterValue({ Direction: "buy" })}>
            reset
          </span>
        </div>
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
              className="pager"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default styled(Home)`
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
    width: 1200px;
    padding: 0 20px;
    margin: 10px auto;
    display: block;
    .title {
      font-weight: 700;
      font-style: normal;
      font-size: 28px;
      color: #ffffff;
      padding-left: 36px;
      background-image: url(/img/market/2.png);
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
