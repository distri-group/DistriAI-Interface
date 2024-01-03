import styled from "styled-components";
import React, { useState, useEffect } from "react";
import * as util from "../utils";
import { getMachineList } from "../services/machine";
import DeviceList from "../components/DeviceList";

function Home({ className }) {
  document.title = "Market";
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 监听登录状态
  useEffect(() => {
    let addr = localStorage.getItem("addr");
    if (!addr) {
      window.showLoginBox();
    }
  }, []);
  // 加载列表数据
  const loadList = async () => {
    setLoading(true);
    try {
      let res = await getMachineList(true, 1);
      console.log("Device List", res);
      res.list.map((item) => (item.loading = false));
      setList(res.list);
    } catch (e) {
      setList([]);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadList();
  }, []);
  // 轮询刷新列表
  const reloadList = async (id) => {
    setLoading(true);
    let res = await getMachineList(true, 1);
    let list_refresh = res.list;
    let uid = id;
    console.log(
      "status",
      list_refresh[list_refresh.findIndex((item) => item.Uuid === uid)].Status
    );
    if (
      list_refresh[list_refresh.findIndex((item) => item.Uuid === uid)]
        .Status === 1
    ) {
      setTimeout(() => {
        reloadList(id);
      }, 1000);
    } else {
      util.showOK("Cancel offer success!");
      setList(list_refresh);
      setLoading(false);
      return;
    }
  };
  return (
    <div className={className}>
      <div className="hold"></div>
      <div className="con">
        <h1 className="title">Share My Device</h1>
        <div className="con-table">
          <DeviceList
            list={list}
            setList={setList}
            isMyDevice={true}
            loading={loading}
            reloadFunc={reloadList}
          />
        </div>
      </div>
    </div>
  );
}

export default styled(Home)`
  display: block;
  width: 100%;
  color: #fff;
  .con {
    width: 1200px;
    margin: 10px auto;
    display: block;
    padding: 0 20px;
    .title {
      font-family: "Montserrat Bold", "Montserrat", sans-serif;
      font-weight: 700;
      font-style: normal;
      font-size: 28px;
      color: #ffffff;
      padding-left: 36px;
      background-image: url(/img/market/2.png);
      background-repeat: no-repeat;
      background-size: 32px;
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
