// 确认上架机器
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Button } from "antd";
import React, { useState, useEffect, useRef } from "react";
import * as util from "../utils";
import { getMachineDetailByUuid } from "../services/machine";
import { getMachineList } from "../services/machine";
import SolanaAction from "../components/SolanaAction";

let inputValues = {
  price: 1,
  duration: 1,
  disk: 1,
};

function Home({ className }) {
  const { id } = useParams();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deviceDetail, setDeviceDetail] = useState({});
  const [maxStorage, setMaxStorage] = useState(0);

  const childRef = useRef();
  /**
   * 获取机器信息
   */
  const init = async () => {
    let detail = await getMachineDetailByUuid(id);
    if (detail) {
      setDeviceDetail(detail);
      setMaxStorage(parseInt(detail.Metadata?.DiskInfo?.TotalSpace));
    }
    console.log("***********device detail*****************");
    console.log(detail);
  };
  useEffect(() => {
    document.title = "Make Offer";
    let addr = localStorage.getItem("addr");
    if (!addr) {
      window.showLoginBox();
    }
    init();
  }, [id]);
  const onInput = (e, n) => {
    let value = parseInt(e.target.value);
    if (!e.target.value || isNaN(e.target.value)) {
      value = 0;
    }
    inputValues[n] = value;
  };
  /**
   * 发送上架请求
   * @returns
   */
  const onSubmit = async () => {
    console.log("id", id);
    let tprice = parseFloat(inputValues.price);
    let maxDuration = inputValues.duration;
    let disk = inputValues.disk;
    // 输入验证
    if (tprice <= 0) {
      return util.showError("The price must be an integer greater than 0");
    }
    if (maxDuration <= 0) {
      return util.showError(
        "The max duration must be an integer greater than 0"
      );
    }
    if (disk <= 0) {
      return util.showError("The disk must be an integer greater than 0");
    }

    util.loading(true);
    setLoading(true);
    try {
      let result = await childRef.current.makeOffer(
        id,
        tprice,
        maxDuration,
        disk
      );

      if (result.msg === "ok") {
        //ok
        reloadList(id);
      } else {
        util.loading(false);
        setLoading(false);
        util.showError(result.msg);
      }
    } catch (e) {
      util.alert(e.message);
    }
  };
  // 轮询查询状态是否改变
  const reloadList = async (id) => {
    setLoading(true);
    let res = await getMachineList(true, 1);
    let list = res.list;
    let item_refresh = list.find((item) => item.Uuid === id);
    console.log("item_refresh", item_refresh);
    if (item_refresh.Status === 1) {
      console.log("reload done!");
      util.showOK("Make offer success!");
      setLoading(false);
      util.loading(false);
      navigate("/mydevice/");
    } else {
      console.log("reload");
      setTimeout(() => {
        reloadList(id);
      }, 1000);
    }
  };

  return (
    <div className={className}>
      <SolanaAction ref={childRef}></SolanaAction>
      <div className="hold"></div>
      <div className="con">
        <h1 className="title">Make Offer</h1>
        <div className="myform">
          <div className="form-row">
            <div className="row-txt">Price (per hour)</div>
            <Input
              onChange={(e) => onInput(e, "price")}
              type="number"
              className="my-input"
              placeholder="Enter an integer"
              min={0}
              max={99999}
            />
            <span className="uni">SOL</span>
          </div>
          <div className="form-row">
            <div className="row-txt">Max duration</div>
            <Input
              onChange={(e) => onInput(e, "duration")}
              type="number"
              className="my-input"
              placeholder="Enter an integer"
              min={0}
              max={99999}
            />
            <span className="uni">Hour</span>
          </div>
          <div className="form-row">
            <div className="row-txt">Max disk storage</div>
            <div className="row-title2">Avail Disk Storage: {maxStorage}GB</div>
            <Input
              onChange={(e) => onInput(e, "disk")}
              type="number"
              className="my-input"
              placeholder="Enter an integer"
              min={0}
              max={maxStorage}
            />
            <span className="uni">GB</span>
          </div>
          <div className="form-row">
            <div className="row-txt drow">
              <img src="/img/dot.png" style={{ width: "25px" }} />
              <span className="num" style={{ fontSize: 28 }}>
                {inputValues.price}
              </span>
              <label
                style={{ fontSize: 13, color: "#bbb", fontWeight: "normal" }}>
                SOL
              </label>
            </div>
          </div>
          <div className="form-row">
            <Button
              loading={loading}
              disabled={loading}
              type="primary"
              style={{ marginTop: 30 }}
              onClick={onSubmit}
              className="cbtn">
              {loading ? "Confirming" : "Confirm"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default styled(Home)`
  display: block;
  width: 100%;
  height: 100vh;
  color: #fff;
  .mini-btn {
    border: 1px solid #fff;
  }
  .drow {
    display: flex !important;
    align-items: center;
    flex-direction: row;
    justify-content: flex-start;
    width: 200px;
    margin-top: 20px;
  }
  .uni {
    position: absolute;
    bottom: 16px;
    font-size: 14px;
    right: 15px;
    color: #fff;
  }
  .row-title2 {
    font-size: 14px;
    color: #e0c4bd;
    line-height: 24px;
    display: block;
    margin-bottom: 10px;
  }
  .con {
    width: 1200px;
    padding: 0 20px;
    margin: 10px auto;
    display: block;
    overflow: hidden;
    .title {
      font-family: "Montserrat Bold", "Montserrat", sans-serif;
      font-weight: 700;
      font-style: normal;
      font-size: 28px;
      color: #ffffff;
      margin-top: 25px;
      line-height: 70px;
    }
  }
  .block {
    display: block;
    overflow: hidden;
  }
  .mini-btn {
    color: #fff;
    border: 1px solid #fff;
    border-radius: 4px;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
  }
  .ant-btn-primary {
    background-color: rgba(148, 214, 226, 1) !important;
    color: #000;
    height: 50px;
    line-height: 40px;
    width: 130px;
  }
  .mytable {
    display: table;
    border: 1px solid #fff;
    border-radius: 10px;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    overflow: hidden;
    .link {
      color: #fff;
      cursor: pointer;
    }
    .btn-link {
      color: #fff;
      cursor: pointer;
      text-decoration: underline;
    }
    th {
      background-color: #92d5e1;
      color: #000;
      height: 40px;
      line-height: 40px;
      text-align: left;
      padding: 0 10px;
    }
    tr td {
      border-bottom: 1px solid #fff;
      border-collapse: collapse;
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
    }
    tr:last-children {
      td {
        border-bottom: none;
      }
    }
  }
`;
