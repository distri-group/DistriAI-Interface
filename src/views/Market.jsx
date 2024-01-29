import styled from "styled-components";
import React, { useState, useEffect } from "react";
import DeviceList from "../components/DeviceList";
import Pager from "../components/pager";
import { getMachineList, getFilterData } from "../services/machine";
import { useSnackbar } from "notistack";
import { MenuItem, Select } from "@mui/material";

let filter = {};

function Home({ className }) {
  document.title = "Market";
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [filterValue, setFilterValue] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  const loadList = async (curr) => {
    setLoading(true);
    try {
      let res = await getMachineList(false, curr, filter);
      setTotal(res.total);
      setList(res.list);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };
  const loadFilterData = async () => {
    setLoading(true);
    try {
      let res = await getFilterData();
      if (res.Msg) {
        return enqueueSnackbar(res.Msg, { variant: "error" });
      }
      setFilterData(res);
      res.forEach((t) => {
        filter[t.name] = "all";
      });
      setFilterValue(filter);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadFilterData();
    loadList();
  }, []);

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
        <h1 className="title">Computing Power Market</h1>
        <div className="filter">
          <span className="txt">Filter</span>
          {filterData.map((t) => {
            return (
              <span className="sel" key={t.name}>
                {/* <Select
                  defaultValue="all"
                  value={filterValue[t.name]}
                  style={{ width: 160 }}
                  data-name={t.name}
                  onChange={(e) => onFilter(e, t.name)}
                  options={t.arr}
                /> */}
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
          {loading ? (
            ""
          ) : (
            <span className="btn-txt" onClick={onResetFilter}>
              reset
            </span>
          )}
        </div>
        <div className="con-table">
          <DeviceList list={list} loading={loading} />
        </div>
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
  );
}

export default styled(Home)`
  display: block;
  width: 100%;
  color: #fff;
  .hold {
    display: block;
    overflow: hidden;
    width: 100%;
    height: 56px;
    clear: both;
  }
  .con {
    width: 1200px;
    margin: 10px auto;
    display: block;
    padding: 0 20px;
    .title {
      font-family: Montserrat Bold, Montserrat, sans-serif;
      font-weight: 700;
      font-style: normal;
      font-size: 28px;
      color: #ffffff;
      padding-left: 36px;
      background-image: url(/img/market/1.png);
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
  }
  .block {
    display: block;
    overflow: hidden;
  }
  .pager {
    display: flex;
  }
`;
