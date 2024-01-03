import styled from "styled-components";
import _ from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Button } from "antd";
import React, { useState, useEffect, useRef } from "react";
import * as util from "../utils";
import { getDetailByUuid } from "../services/order";
import SolanaAction from "../components/SolanaAction";
import store from "../utils/store";

let formData = {};

function Home({ className }) {
  const { id } = useParams();
  document.title = "Edit model";
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [deviceDetail, setDeviceDetail] = useState({});
  const [orderDetail, setOrderDetail] = useState({});
  const childRef = useRef();

  const onInput = (e) => {
    let v = e.target.value;
    let n = e.target.dataset.name;
    formData[n] = v;
    if (n == "duration" && v) {
      v = parseInt(v);
      if (v <= 0) {
        setAmount(0);
        return util.showError("The duration must be an integer greater than 0");
      }
      formData[n] = v;
      setAmount(v * deviceDetail.Price);
    }
  };
  const init = async () => {
    let detail = await getDetailByUuid(id);
    console.log("----------getOrderDetailById--------------");
    console.log(detail);
    if (detail) {
      setOrderDetail(detail);
      if (detail.Metadata?.machineInfo) {
        setDeviceDetail(detail.Metadata.machineInfo);
      }
    }
  };
  useEffect(() => {
    let addr = localStorage.getItem("addr");
    if (!addr) {
      window.showLoginBox();
    }
    let account = store.get("account");
    setBalance(account.balance);
    init();
  }, []);
  const valit = () => {
    if (amount == 0) {
      return "Payment token greater than 0.";
    }
    // if (amount / 1000000000000 > balance) {
    //   return "Payment token greater than balance.";
    // }
    return null;
  };
  const onSubmit = async () => {
    let vmsg = valit();
    if (vmsg) {
      return util.alert(vmsg);
    }
    setLoading(true);
    console.log({ formData, orderDetail });
    let ret = await childRef.current.renewOrder(
      orderDetail.Metadata.machineInfo.Uuid,
      id,
      formData.duration
    );
    setLoading(false);
    if (ret.msg != "ok") {
      return util.alert(ret.msg);
    }
    navigate("/myorder");
    window.freshBalance();
  };

  return (
    <div className={className}>
      <SolanaAction ref={childRef}></SolanaAction>
      <div className="con">
        <h1 className="title">Extend Duration</h1>
        <div className="myform" style={{ display: "block" }}>
          <div className="info-box">
            <div className="info-box-title">Configuration</div>
            <div className="info-box-body">
              <div className="line">
                <div className="f">
                  <span style={{ fontSize: 18, fontWeight: "bold" }}>
                    {deviceDetail.GpuCount + "x " + deviceDetail.Gpu}
                  </span>
                  <span>{deviceDetail.TFLOPS || "--"} TFLOPS</span>
                </div>
              </div>
              <div className="line">
                <div className="l">
                  <span>RAM</span>
                  <span>{deviceDetail.RAM}</span>
                </div>
                <div className="r">
                  <span>Avail Disk Storage</span>
                  <span>{deviceDetail.Disk} GB</span>
                </div>
              </div>
              <div className="line">
                <div className="f">
                  <span>CPU</span>
                  <span>{deviceDetail.Cpu}</span>
                </div>
              </div>
              <div className="line">
                <div className="f">
                  <span>Max Duration</span>
                  <span>{deviceDetail.MaxDuration}h</span>
                </div>
              </div>
            </div>
          </div>
          <div className="info-box">
            <div className="info-box-title">Order Info</div>
            <div className="info-box-body">
              <div className="line">
                <div className="f">
                  <span>Dataset Size</span>
                  <span>485 MB</span>
                </div>
              </div>
              <div className="line">
                <div className="f">
                  <span>Price(per hour)</span>
                  <span>{deviceDetail.Price} SOL</span>
                </div>
              </div>
            </div>
          </div>
          <div className="b-box">
            <div className="row">
              <b>5</b> h
            </div>
            <div className="row">Estimate the computing time</div>
          </div>
          <div className="form-row">
            <div className="row-txt">Duration </div>
            <Input
              className="my-input"
              data-name="duration"
              placeholder="Hour"
              onChange={onInput}
            />
          </div>

          <div className="right-txt">Balance: {balance} SOL</div>

          <div className="color-box">
            <div className="row-txt">Total</div>
            <div className="drow">
              <span className="num">{amount}</span>
              <label>SOL</label>
            </div>
          </div>
          <div className="form-row btn-row">
            <Button
              loading={loading}
              disabled={loading}
              style={{ width: 154 }}
              type="primary"
              className="cbtn"
              onClick={onSubmit}>
              Confirm
            </Button>
            {/* <span className="my-btn sub-btn"></span> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default styled(Home)`
  display: block;
  overflow: hidden;
  width: 100%;
  background-color: #000;
  color: #fff;
  .mini-btn {
    border: 1px solid #fff;
  }
  .pross-box {
    display: none;
  }
  .pross-box1 {
    position: fixed;
    left: calc(50% - 500px);
    top: 100px;
    width: 1000px;
    height: 530px;
    background-color: rgba(0, 0, 0, 1);
    border-width: 1px;
    border-style: solid;
    border-color: rgba(64, 64, 64, 1);
    border-radius: 5px;
    padding: 90px 0px;
    display: flex;
    flex-direction: column;
    z-index: 999;
    .close-btn {
      width: 35px;
      height: 35px;
      display: block;
      overflow: hidden;
      position: absolute;
      top: 4px;
      right: 8px;
      cursor: pointer;
      background-image: url(/img/market/close.svg);
      background-repeat: no-repeat;
      background-size: 16px;
      background-position: center;
    }
    .title {
      font-weight: 700;
      font-size: 72px;
      color: #ffffff;
      text-align: center;
    }
    .desc {
      font-size: 16px;
      color: #ffffff;
      text-align: left;
      line-height: 20px;
      padding: 21px 282px;
    }
    .progress {
      width: 60%;
      display: block;
      margin: 50px auto;
    }
    .skip {
      font-size: 16px;
      text-decoration: underline;
      color: #797979;
      text-align: center;
      line-height: 48px;
      cursor: pointer;
    }
    .recommond {
      font-size: 14px;
      color: #515151;
      text-align: center;
    }
  }
  .con {
    width: 1160px;
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
    .tab-bar {
      width: 50%;
      padding: 20px 0;
      .bar {
        width: 100%;
        display: flex;
        flex-direction: row;
        span {
          text-align: center;
          width: 50%;
          display: block;
          overflow: hidden;
          font-size: 14px;
          line-height: 48px;
          cursor: pointer;
          color: #94d6e2;
          .fa-check-circle {
            font-size: 22px;
          }
        }
      }
      .bar1 {
        .l {
          border-bottom: 3px solid rgba(148, 214, 226, 1);
        }
        .r {
          color: #797979;
        }
      }
      .bar2 {
        .l {
          color: #94e2b8;
        }
        .r {
          border-bottom: 3px solid rgba(148, 214, 226, 1);
        }
      }
    }
    .info-box {
      display: block;
      .info-box-title {
        font-weight: bold;
        font-size: 16px;
        color: #ffffff;
        border-bottom: 1px solid #797979;
        line-height: 48px;
      }
      .info-box-body {
        padding: 5px 18px;
        display: block;
        .line {
          padding: 10px 0;
          display: flex;
          flex-direction: row;
          .f {
            width: 100%;
          }
          span {
            line-height: 24px;
            display: block;
            clear: both;
            font-size: 14px;
          }
          .l {
            width: 50%;
          }
          .r {
            width: 50%;
          }
        }
      }
    }
    .b-box {
      display: block;
      padding: 30px;
      border: 1px solid rgba(121, 121, 121, 1);
      border-radius: 5px;
      margin: 20px 0;
      .row {
        display: block;
        line-height: 30px;
        font-size: 14px;
        text-align: center;
        b {
          font-size: 24px;
        }
      }
    }
    .right-txt {
      display: block;
      overflow: hidden;
      text-align: right;
      line-height: 30px;
      font-size: 14px;
      color: #e0c4bd;
    }
    .color-box {
      border-radius: 5px;
      background-color: #151515;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 19px 10px;
      .row-txt {
        font-size: 16px;
        font-weight: bold;
        line-height: 51px;
      }
      .drow {
        display: flex;
        flex-direction: column;
        span {
          width: 100%;
          font-size: 28px;
          font-weight: bold;
          text-align: right;
        }
        label {
          width: 100%;
          font-size: 13px;
          text-align: right;
        }
      }
    }
    .btn-row {
      display: block;
      margin: 30px 0;
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
