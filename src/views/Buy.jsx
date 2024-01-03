import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Button, Progress } from "antd";
import React, { useState, useEffect, useRef } from "react";
import * as util from "../utils";
import { getMachineDetailByUuid } from "../services/machine";
import { getLiberyList, getModelList } from "../services/order";
import SolanaAction from "../components/SolanaAction";
import { PublicKey } from "@solana/web3.js";
import webconfig from "../webconfig";
import { getPublicKey } from "../services/solana";

let formData = {
  taskName: "",
  libery: "",
  model: "",
  dataUrl: "",
  iters: "",
  batchsize: "",
  rate: "",
  duration: 0,
  imageName: "",
  imageTag: "",
  libType: "lib",
  buyTime: "",
  orderTime: "",
};

function Home({ className }) {
  const { id } = useParams();
  document.title = "Edit model";
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [popuStatus, setPopuStatus] = useState(0);
  const [deviceDetail, setDeviceDetail] = useState({});
  const [libType, setLibType] = useState("lib");

  const childRef = useRef();
  // 获取余额
  const getTokenBalance = async (mint, address) => {
    let res = await childRef.current.getTokenAccountBalance(mint, address);
    return res;
  };

  // 统一处理 input 逻辑
  const onInput = (e) => {
    let value = e.target.value;
    let name = e.target.dataset.name;
    formData[name] = value;
    // 总价处理
    if (name === "duration" && value && !isNaN(value)) {
      value = parseInt(value);
      if (value <= 0) {
        setAmount(0);
        return util.showError("The duration must be an integer greater than 0");
      }
      formData[name] = value;
      console.log({ deviceDetail });
      if (!deviceDetail.Price) {
        deviceDetail.Price = 1;
      }
      setAmount(value * deviceDetail.Price);
    }
  };
  // 信息初始化
  const init = async () => {
    let detail = await getMachineDetailByUuid(id);
    if (detail) {
      setDeviceDetail(detail);
    }
  };
  // 登录状态监控
  useEffect(() => {
    const mint = new PublicKey(webconfig.mintAddress);
    const getBalance = async () => {
      let addr = await getPublicKey();
      let account = new PublicKey(addr);
      let amount = await getTokenBalance(mint, account);
      setBalance(amount / 1000000000);
    };
    getBalance();
    init();
  }, [id]);
  // 格式验证
  const valit = () => {
    if (!formData.taskName) {
      return "Task name is required.";
    }
    if (!formData.duration) {
      return "Duration is required.";
    }
    // if (!formData.dataUrl) {
    //   return "DATA uploading link is required.";
    // }
    // if (amount == 0) {
    //   return "Payment token greater than 0.";
    // }
    // if (libType === "lib") {
    //   if (!formData.libery) {
    //     return "Libery is required.";
    //   }
    //   if (!formData.model) {
    //     return "Model is required.";
    //   }
    //   if (!formData.iters) {
    //     return "Iters is required.";
    //   }
    //   if (!formData.batchsize) {
    //     return "Batchsize is required.";
    //   }
    //   if (!formData.rate) {
    //     return "Learning Rate  is required.";
    //   }
    // } else {
    //   if (!formData.imageName) {
    //     return "ImageName  is required.";
    //   }
    //   if (!formData.imageTag) {
    //     return "ImageTag  is required.";
    //   }
    // }
    // formData.libType = libType;
    return null;
  };
  const onSubmit = async () => {
    let vmsg = valit();
    if (vmsg) {
      return util.alert(vmsg);
    }
    formData.amount = amount;
    formData.buyTime = new Date();
    formData.orderTime = new Date();
    setLoading(true);
    console.log({ formData });
    let ret = await placeOrderStart(deviceDetail, formData, amount);
    setLoading(false);
    if (ret.msg !== "ok") {
      return util.alert(ret.msg);
    }
    navigate("/myorder");
    window.freshBalance();
  };
  async function placeOrderStart(deviceDetail, formData) {
    let orderId = new Date().valueOf().toString();
    console.log({ deviceDetail, formData });
    let result = await childRef.current.placeOrder(
      deviceDetail.Uuid,
      orderId,
      formData.duration,
      { formData, MachineInfo: {} }
    );
    return result;
  }
  // const onChangeLib = (type) => {
  //   setLibType(type);
  // };
  return (
    <div className={className}>
      <SolanaAction ref={childRef}></SolanaAction>
      <div className="hold"></div>
      <div className={"pross-box pross-box" + popuStatus}>
        <div className="close-btn" onClick={() => setPopuStatus(2)}></div>
        <div className="title">Estimate the time</div>
        <div className="desc">
          The AI Traning time is related to the size of the dataset. Estimating
          the calculation time may take a few minutes.
        </div>
        <div className="progress">
          <Progress
            percent={99.9}
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
          />
        </div>
        <div className="skip" onClick={() => setPopuStatus(2)}>
          Skip
        </div>
        <div className="recommond">No recommond</div>
      </div>
      <div className="con">
        <h1 className="title">Edit model</h1>
        {/* Tab 选择栏 */}
        {/* <div className="tab-bar">
          {tab === 1 ? (
            <div className="bar bar1">
              <span
                className="l"
                onClick={() => {
                  setTab(1);
                }}>
                1 Estimate the computing time
              </span>
              <span
                className="r"
                onClick={() => {
                  setTab(2);
                }}>
                2 Confirm the order
              </span>
            </div>
          ) : (
            // 进入第二步后,第一步显示已完成
            <div className="bar bar2">
              <span
                className="l"
                onClick={() => {
                  setTab(1);
                }}>
                <i className="fa fa-check-circle"></i>&nbsp;&nbsp;Estimate the
                computing time
              </span>
              <span
                className="r"
                onClick={() => {
                  setTab(2);
                }}>
                2 Confirm the order
              </span>
            </div>
          )}
        </div> */}
        {/* 购买第一步界面 */}
        {/* <div
          className="myform"
          style={{ display: tab === 1 ? "block" : "none" }}>
          <div className="form-row">
            <div className="row-txt">Task Name </div>
            <Input
              className="my-input"
              data-name="taskName"
              onChange={onInput}
              onKeyUp={onInput}
              placeholder="Must be 4--45 characters"
            />
          </div>
          <div className="form-row">
            <div className="sel-out">
              <div
                className={
                  libType === "lib" ? "sel-box lib-curr curr" : "sel-box lib"
                }
                onClick={() => onChangeLib("lib")}>
                Use Built-in Libery
              </div>
              <div
                className={
                  libType === "docker"
                    ? "sel-box docker-curr curr"
                    : "sel-box docker"
                }
                onClick={() => onChangeLib("docker")}>
                Use Image From Dockerhub
              </div>
            </div>
          </div>
          <div className={libType === "docker" ? "form-row" : "form-row none"}>
            <div className="row-txt">Image Name </div>
            <Input
              onChange={onInput}
              className="my-input"
              data-name="imageName"
            />
          </div>
          <div className={libType === "docker" ? "form-row" : "form-row none"}>
            <div className="row-txt">Image Tag </div>
            <Input
              onChange={onInput}
              className="my-input"
              data-name="imageTag"
            />
          </div>
          <div className={libType === "lib" ? "form-row" : "form-row none"}>
            <div className="row-txt">Libery </div>
            <select className="my-select" data-name="libery" onChange={onInput}>
              <option value="">-select Libery-</option>
              {liberys.map((t, i) => {
                return (
                  <option value={t.value} key={i}>
                    {t.label}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={libType === "lib" ? "form-row" : "form-row none"}>
            <div className="row-txt">Model </div>
            <select className="my-select" data-name="model" onChange={onInput}>
              <option value="">-select Model-</option>
              {models.map((t, i) => {
                return (
                  <option value={t.value} key={i}>
                    {t.label}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-row">
            <div className="row-txt">
              DATASET Uploading Link <br />
            </div>
            <Input
              onChange={onInput}
              data-name="dataUrl"
              onKeyUp={onInput}
              className="my-input"
              placeholder="Basic usage"
            />
            <div className="more">
              Recommond using AMAZON S3, Google Drive, Dropbox, IPFS to upload
              the dataset, then get the data sharing URL.
            </div>
          </div>
          <div className={libType === "lib" ? "row-line" : "row-line none"}>
            <div className="form-row">
              <div className="row-txt">Epochs </div>
              <Input
                type="number"
                className="my-input"
                data-name="iters"
                onChange={onInput}
                style={{ width: "90%" }}
                placeholder="Enter an integer"
              />
            </div>
            <div className="form-row">
              <div className="row-txt">Batch Size </div>
              <Input
                type="number"
                className="my-input"
                data-name="batchsize"
                onChange={onInput}
                style={{ width: "100%" }}
                placeholder="Enter an integer"
              />
            </div>
          </div>
          <div className={libType === "lib" ? "form-row" : "form-row none"}>
            <div className="row-txt">Learning Rate </div>
            <Input onChange={onInput} className="my-input" data-name="rate" />
          </div>
          <div className="form-row btn-row">
            <Button
              loading={loading}
              disabled={loading}
              className="sub-btn cbtn2"
              style={{ width: 154, marginTop: 33 }}
              type="primary"
              onClick={() => {
                setTab(2);
                if (popuStatus === 0) {
                  setPopuStatus(1);
                }
              }}>
              Next
            </Button>
          </div>
        </div> */}
        {/* 购买第二步,确认配置信息,设置训练时长 */}
        <div className="myform">
          {/* 配置信息 starts */}
          <div className="info-box">
            <div className="info-box-title">Configuration</div>
            <div className="info-box-body">
              <div className="line">
                <div className="f">
                  {/* 使用GPU */}
                  <span style={{ fontSize: 18, fontWeight: "bold" }}>
                    {deviceDetail.GpuCount + "x " + deviceDetail.Gpu}
                  </span>
                  {/* 计算次数 */}
                  <span>{deviceDetail.TFLOPS || "--"} TFLOPS</span>
                </div>
              </div>
              <div className="line">
                {/* RAM */}
                <div className="l">
                  <span>RAM</span>
                  <span>{deviceDetail.RAM}</span>
                </div>
                {/* 可用存储空间 */}
                <div className="r">
                  <span>Avail Disk Storage</span>
                  <span>{deviceDetail.Disk} GB</span>
                </div>
              </div>
              <div className="line">
                {/* CPU */}
                <div className="f">
                  <span>CPU</span>
                  <span>{deviceDetail.Cpu}</span>
                </div>
              </div>
              <div className="line">
                {/* 最大持续时间 */}
                <div className="f">
                  <span>Max Duration</span>
                  <span>{deviceDetail.MaxDuration}h</span>
                </div>
              </div>
            </div>
          </div>
          {/* 配置信息 ends */}
          {/* 订单信息 starts */}
          <div className="info-box">
            <div className="info-box-title">Order Info</div>
            <div className="info-box-body">
              <div className="line">
                {/* 资料集大小 */}
                <div className="f">
                  <span>Dataset Size</span>
                  <span>485 MB</span>
                </div>
              </div>
              <div className="line">
                {/* 训练价格 */}
                <div className="f">
                  <span>Price(per hour)</span>
                  <span>{deviceDetail.Price} DIST</span>
                </div>
              </div>
            </div>
          </div>
          {/* 订单信息 ends */}
          {/* 估计训练所需时长 */}
          <div className="b-box">
            <div className="row">
              <b>1</b> h
            </div>
            <div className="row">Estimate the computing time</div>
          </div>
          <div className="form-row">
            {/* 需购买时长 */}
            <div className="row-txt">Duration </div>
            <Input
              className="my-input"
              data-name="duration"
              placeholder="Hour"
              onChange={onInput}
            />
          </div>
          <div className="form-row">
            <div className="row-txt">Task Name </div>
            <Input
              className="my-input"
              data-name="taskName"
              onChange={onInput}
              onKeyUp={onInput}
              placeholder="Must be 4--45 characters"
            />
          </div>
          <div className="right-txt">
            Balance: {!isNaN(balance) ? balance : 0} DIST
          </div>
          <div className="color-box">
            <div className="row-txt">Total</div>
            <div className="drow">
              <span className="num">{amount}</span>
              <label>DIST</label>
            </div>
          </div>
          {/* 确认 */}
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
  color: #fff;
  .mini-btn {
    border: 1px solid #fff;
  }
  .pross-box {
    display: none;
  }
  .none {
    display: none !important;
  }
  .sel-out {
    width: 100%;
    display: flex;
    overflow: hidden;
    flex-direction: row;
    padding: 20px 0 10px;
    justify-content: space-between;
    .sel-box {
      width: 270px;
      height: 100px;
      border-width: 1px;
      border-style: solid;
      border-radius: 5px;
      font-size: 14px;
      background-repeat: no-repeat;
      background-size: 40px;
      background-position: center 10px;
      display: block;
      overflow: hidden;
      line-height: 140px;
      text-align: center;
      cursor: pointer;
    }
    .lib {
      color: #dddddd;
      background-color: rgba(32, 32, 32, 1);
      border-color: rgba(121, 121, 121, 1);
      background-image: url(/img/market/lib.svg);
    }
    .lib-curr {
      color: #bae5ee;
      background-color: #000;
      border-color: rgba(186, 229, 238, 1);
      background-image: url(/img/market/lib-curr.svg);
      box-shadow: 0px 0px 20px rgba(186, 229, 238, 0.5137254901960784);
    }
    .docker {
      color: #dddddd;
      background-color: rgba(32, 32, 32, 1);
      border-color: rgba(121, 121, 121, 1);
      background-image: url(/img/market/docker.svg);
    }
    .docker-curr {
      color: #bae5ee;
      background-color: #000;
      border-color: rgba(186, 229, 238, 1);
      background-image: url(/img/market/docker-curr.svg);
      box-shadow: 0px 0px 20px rgba(186, 229, 238, 0.5137254901960784);
    }
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
    margin: 10px auto;
    padding: 0 20px;
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
      line-height: 50px;
      font-size: 14px;
      color: #e0c4bd;
    }
    .color-box {
      border-radius: 5px;
      background-color: #151515;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 19px 20px;
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
          line-height: 30px;
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
  .ant-btn-primary {
    color: #000;
    height: 50px;
    line-height: 40px;
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
