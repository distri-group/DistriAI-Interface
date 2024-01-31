import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getDetailByUuid } from "../services/order";
import { useSnackbar } from "notistack";
import { Button, CircularProgress } from "@mui/material";
import ProgressWithLabel from "../components/ProgressWithLabel";

function Home({ className }) {
  const { id } = useParams();
  document.title = "Order detail";
  const [record, setRecord] = useState();
  const [loading, setLoading] = useState(true);
  const wallet = useAnchorWallet();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const loadDetail = async () => {
      const res = await getDetailByUuid(id, wallet.publicKey.toString());
      setLoading(false);
      if (res.Status === 1) {
        setRecord(res.Detail);
      } else {
        return enqueueSnackbar(res.Msg, { variant: "error" });
      }
    };
    if (wallet?.publicKey) {
      loadDetail();
    }
  }, [id, wallet]);
  return (
    <div className={className}>
      <div className="con">
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <p>
              <b>For: </b>
              {record.Buyer}
            </p>
            <h2 className={record.StatusName}>{record.StatusName}</h2>
            {record.Metadata.MachineInfo ? (
              <div style={{ width: "64%" }}>
                <div className="detail">
                  <div className="info-box">
                    <div className="info-box-title">
                      <span>Order Info</span>
                    </div>
                    <div className="info-box-body">
                      <div className="time">
                        <span>
                          Start Time{" "}
                          {new Date(record.OrderTime).toLocaleString()}
                        </span>
                        <span>Remaining Time {}</span>
                      </div>
                      <ProgressWithLabel
                        value={60}
                        label={`Duration: ${record.Duration}h`}
                      />
                      <div className="price">
                        <div className="price-box">
                          <label>Price</label>
                          <span>
                            {record.Metadata.MachineInfo.Price} DIST / h
                          </span>
                        </div>
                        <div className="price-box">
                          <label>Total Duration</label>
                          <span>{record.Duration}h</span>
                        </div>
                        <div className="price-box">
                          <label>Expected Total Earnings</label>
                          <span>
                            {record.Metadata.MachineInfo.Price *
                              record.Duration}{" "}
                            DIST
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="info-box">
                    <div className="info-box-title">
                      <span>Configuration</span>
                    </div>
                    <div className="info-box-body">
                      <div className="title2">
                        # {record.Metadata.MachineInfo.UuidShort}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}>
                        <div className="box">
                          <div className="vertical">
                            <label>Provider</label>
                            <span>{record.Metadata.MachineInfo.Owner}</span>
                          </div>
                          <div className="vertical">
                            <label>Region</label>
                            <span>{record.Metadata.MachineInfo.Region}</span>
                          </div>
                        </div>
                        <div className="box">
                          <div className="vertical">
                            <label>GPU</label>
                            <span>
                              {record.Metadata.MachineInfo.GpuCount +
                                "x " +
                                record.Metadata.MachineInfo.Gpu}
                            </span>
                          </div>
                          <div className="vertical">
                            <label>CPU</label>
                            <span>{record.Metadata.MachineInfo.Cpu}</span>
                          </div>
                        </div>
                        <div className="box">
                          <div className="horizontal">
                            <label>TFLOPS</label>
                            <span>
                              {record.Metadata.MachineInfo.TFLOPS || "--"}
                            </span>
                          </div>
                          <div className="horizontal">
                            <label>RAM</label>
                            <span>{record.Metadata.MachineInfo.RAM}</span>
                          </div>
                          <div className="horizontal">
                            <label>Avail Disk Storage</label>
                            <span>{record.Metadata.MachineInfo.Disk} GB</span>
                          </div>
                          <div className="horizontal">
                            <label>Reliability</label>
                            <span>
                              {record.Metadata.MachineInfo.Reliability}
                            </span>
                          </div>
                          <div className="horizontal">
                            <label>CPS</label>
                            <span>{record.Metadata.MachineInfo.Score}</span>
                          </div>
                          <div className="horizontal">
                            <label
                              style={{ fontSize: "14px", lineHeight: "36px" }}>
                              Internet Speed
                            </label>
                            <span>
                              <div className="speed">
                                <img
                                  src="/img/market/download.svg"
                                  style={{ transform: "rotate(180deg)" }}
                                  alt=""
                                />{" "}
                                {record.Metadata.MachineInfo.UploadSpeed ||
                                  "--"}
                              </div>
                              <div className="speed">
                                <img src="/img/market/download.svg" alt="" />{" "}
                                {record.Metadata.MachineInfo.DownloadSpeed ||
                                  "--"}
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="info-box">
                    <div className="info-box-title">
                      <span>Blockchain Info</span>
                    </div>
                    <div className="info-box-body">
                      <div className="line">
                        <div className="f">
                          <span>Hash</span>
                          <span>{record.Uuid}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <span>Machine Data Not Found</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default styled(Home)`
  color: #fff;
  height: calc(100vh - 140px);
  .con {
    width: 1160px;
    margin: 10px auto;
    padding: 0 20px;
    display: block;
    overflow: hidden;
    h1 {
      font-family: Montserrat Bold, Montserrat, sans-serif;
      font-weight: 700;
      font-style: normal;
      font-size: 28px;
      color: #ffffff;
      margin: 0;
      line-height: 70px;
    }
    h2 {
      margin: 0;
    }
  }
  .info-box {
    .info-box-title {
      border-bottom: 1px solid #797979;
      display: flex;
      justify-content: space-between;
      span {
        font-weight: bold;
        font-size: 16px;
        color: #ffffff;
        line-height: 48px;
      }
      .extend-duration {
        background-color: #94d6e2;
        color: black;
        margin-right: 20px;
        :hover {
          background-color: #94d6e2;
          color: black;
        }
      }
      .end-duration {
        background-color: white;
        color: black;
        :hover {
          background-color: white;
          color: black;
        }
      }
    }
    .info-box-body {
      padding: 5px;
      display: block;
      .title2 {
        line-height: 20px;
        padding: 15px 0 7px;
        font-size: 18px;
        font-weight: bold;
      }
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
          width: 60%;
        }
        .r {
          width: 40%;
        }
      }
      .time {
        display: flex;
        justify-content: space-between;
        margin: 16px 0 12px 0;
      }
      .price {
        color: #aaa;
        font-size: 12px;
        padding-top: 20px;
        width: 30%;
        .price-box {
          display: flex;
          justify-content: space-between;
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
  }
  .color-box {
    border-radius: 5px;
    background-color: #151515;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 25px 10px;
    .l {
      display: flex;
      flex-direction: column;
      span {
        font-size: 14px;
        color: #ffffff;
        line-height: 25px;
      }
      label {
        font-size: 18px;
        color: #faffa6;
        font-weight: bold;
        line-height: 25px;
      }
    }
    .pointer {
      color: white !important;
      cursor: pointer;
      background-image: linear-gradient(to right, #20ae98, #0aab50);
      border-radius: 4px;
      padding: 0 10px;
    }
    .r {
      display: flex;
      flex-direction: row;
      align-items: center;
      .pointer,
      .disable {
        width: 150px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        color: #151515;
        text-align: center;
        margin: 0 5px;
        border-radius: 4px;
      }
      .disable {
        cursor: not-allowed;
        background-color: #2f2f2f;
      }
    }
  }
  .box {
    width: 30%;
    height: 120px;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 10px;
    span {
      word-wrap: break-word;
      font-size: 14px;
    }
    .vertical {
      padding: 4px 0;
      label {
        display: block;
      }
      span {
        width: 100%;
      }
    }
    .horizontal {
      display: flex;
      justify-content: space-between;
      .speed {
        text-align: right;
      }
    }
  }
`;
