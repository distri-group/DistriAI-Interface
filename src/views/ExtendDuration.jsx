import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { getDetailByUuid } from "../services/order";
import SolanaAction from "../components/SolanaAction";
import webconfig from "../webconfig";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ProgressWithLabel from "../components/ProgressWithLabel";
import DurationToggle from "../components/DurationToggle";

function Home({ className }) {
  const { id } = useParams();
  document.title = "Edit model";
  const navigate = useNavigate();
  const childRef = useRef();
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [deviceDetail, setDeviceDetail] = useState({});
  const [orderDetail, setOrderDetail] = useState({});

  const onInput = (e) => {
    const value = e.target.value;
    if (!value) {
      setDuration(0);
      setAmount(0);
      return null;
    }
    if (!parseInt(value)) {
      setDuration(0);
      setAmount(0);
      return enqueueSnackbar("Duration should be number greater than 0", {
        variant: "error",
      });
    }
    setDuration(parseInt(value));
    setAmount(value * (deviceDetail.Price || 0));
  };
  const getTokenBalance = async (mint, address) => {
    let res = await childRef.current.getTokenAccountBalance(mint, address);
    setBalance(res / LAMPORTS_PER_SOL);
    return res;
  };
  const onSubmit = async () => {
    setLoading(true);
    console.log("OrderData", { duration, orderDetail });
    let res = await childRef.current.renewOrder(
      orderDetail.Metadata.MachineInfo.Uuid,
      stringToPublicKey(id).toString(),
      duration
    );
    setTimeout(() => {
      if (res?.msg) {
        enqueueSnackbar(`Order extended ${duration} h.`, {
          variant: "success",
        });
        setLoading(false);
        navigate("/order");
      }
    }, 300);
  };
  const stringToPublicKey = (str) => {
    if (str.startsWith("0x")) {
      let hexString = str.slice(2);
      let uint8Array = new Uint8Array(hexString.length / 2);
      for (let i = 0; i < hexString.length; i += 2) {
        uint8Array[i / 2] = parseInt(hexString.substr(i, 2), 16);
      }
      let orderId = uint8Array;
      let counterSeed = anchor.utils.bytes.utf8.encode("order");
      let seeds = [counterSeed, wallet.publicKey.toBytes(), orderId];
      let [publicKey] = anchor.web3.PublicKey.findProgramAddressSync(
        seeds,
        new PublicKey(webconfig.contractAddress)
      );
      return publicKey;
    } else {
      let publicKey = new PublicKey(str);
      return publicKey;
    }
  };
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      let res = await getDetailByUuid(id, wallet.publicKey.toString());
      if (res.Status === 1) {
        setOrderDetail(res.Detail);
        if (res.Detail.Metadata?.MachineInfo) {
          setDeviceDetail(res.Detail.Metadata.MachineInfo);
        }
      } else {
        return enqueueSnackbar(res.Msg, { variant: "error" });
      }
      const mint = new PublicKey(webconfig.mintAddress);
      getTokenBalance(mint, wallet.publicKey);
      setLoading(false);
    };
    if (wallet?.publicKey) {
      init();
    }
    // eslint-disable-next-line
  }, [wallet, id]);

  return (
    <div className={className}>
      <SolanaAction ref={childRef}></SolanaAction>
      <div className="con">
        <h1 className="title">Extend Duration</h1>
        {loading ? (
          <CircularProgress />
        ) : (
          <div className="myform">
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
                <div
                  className="line"
                  style={{ justifyContent: "space-between" }}>
                  <div style={{ width: "30%" }}>
                    <span>RAM</span>
                    <span>{deviceDetail.RAM}</span>
                  </div>
                  <div style={{ width: "30%" }}>
                    <span>Avail Disk Storage</span>
                    <span>{deviceDetail.Disk} GB</span>
                  </div>
                  <div style={{ width: "30%" }}>
                    <span>CPU</span>
                    <span>{deviceDetail.Cpu}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="info-box">
              <div className="info-box-title">Order Info</div>
              <div className="info-box-body">
                <div className="time">
                  <div>
                    <label>Start Time</label>
                    <span>
                      {new Date(orderDetail.OrderTime).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <label>Remaining Time</label>
                    <span></span>
                  </div>
                </div>
                <ProgressWithLabel value={60} label="Duration" />
                <DurationToggle
                  duration={duration}
                  setDuration={setDuration}
                  max={deviceDetail.MaxDuration}
                  title="Extend Duration"
                />
              </div>
            </div>
            <div className="right-txt">Balance: {balance} DIST</div>
            <div className="color-box">
              <div className="row-txt">Total</div>
              <div className="drow">
                <span className="num">{amount}</span>
                <label>DIST</label>
              </div>
            </div>
            <div className="form-row btn-row">
              <LoadingButton
                loading={loading}
                style={{ width: 154 }}
                className="cbtn"
                onClick={onSubmit}>
                {loading ? "" : "Confirm"}
              </LoadingButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default styled(Home)`
  display: block;
  overflow: hidden;
  width: 100%;
  min-height: calc(100vh - 160px);
  color: #fff;
  .con {
    width: 1160px;
    padding: 0 20px;
    margin: 10px auto;
    display: block;
    overflow: hidden;
    .title {
      font-family: Montserrat Bold, Montserrat, sans-serif;
      font-weight: 700;
      font-style: normal;
      font-size: 28px;
      color: #ffffff;
      margin-top: 25px;
      line-height: 70px;
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
        padding: 5px 0;
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
  .time {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    span {
      font-weight: bolder;
      padding: 0 8px;
    }
  }
`;
