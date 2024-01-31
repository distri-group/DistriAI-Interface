import styled from "styled-components";
import React, { useState, useEffect } from "react";
import OrderList from "../components/OrderList";
import { getOrderList, getFilterData } from "../services/order";

import Pager from "../components/pager";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useSnackbar } from "notistack";
import { MenuItem, Select } from "@mui/material";

let filter = {
  Direction: "buy",
};

function Home({ className }) {
  document.title = "My Order";
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterValue, setFilterValue] = useState({});
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  const loadList = async (curr) => {
    setLoading(true);
    try {
      const res = await getOrderList(curr, filter, wallet.publicKey.toString());
      console.log("Order List", res);
      if (!res) {
        return enqueueSnackbar("Order List Not Found", { variant: "error" });
      }
      setTotal(res.total);
      setList(res.list);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    const loadFilterData = () => {
      let res = getFilterData();
      setFilterData(res);
      res.forEach((t) => {
        filter[t.name] = "all";
      });
      setFilterValue(filter);
    };
    loadFilterData();
    if (wallet?.publicKey) {
      setTotal(0);
      loadList(1);
    }
    // eslint-disable-next-line
  }, [wallet?.publicKey]);

  const onFilter = (value, name) => {
    filter[name] = value;
    setFilterValue(filter);
    setCurrent(1);
    loadList(1);
  };
  const onResetFilter = () => {
    filterData.forEach((t) => {
      filter[t.name] = "all";
    });
    setFilterValue(filter);
    setCurrent(1);
    loadList(1);
  };

  const onPagerChange = (curr) => {
    setCurrent(curr);
    loadList(curr);
  };

  return (
    <div className={className}>
      <div className="con">
        <h1 className="title">My Orders</h1>
        <div className="filter">
          <span className="txt">Filter</span>
          {filterData.map((t) => {
            return (
              <span className="sel" key={t.name}>
                <Select
                  className="select"
                  defaultValue="all"
                  value={filterValue[t.name]}
                  onChange={(e) => onFilter(e.target.value, t.name)}>
                  {t.arr.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </span>
            );
          })}
          <span className="btn-txt" onClick={onResetFilter}>
            reset
          </span>
        </div>
        <div className="con-table">
          <OrderList list={list} loading={loading} />
          {total > 10 ? (
            <Pager
              current={current}
              total={total}
              pageSize={10}
              onChange={onPagerChange}
              className="pager"
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default styled(Home)`
  display: block;
  width: 100%;
  min-height: calc(100vh - 160px);
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
      font-family: Montserrat Bold, Montserrat, sans-serif;
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
