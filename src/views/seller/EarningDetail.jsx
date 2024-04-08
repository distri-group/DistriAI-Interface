import styled from "styled-components";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import DurationProgress from "../../components/DurationProgress";
import Countdown from "../../components/Countdown";
import DeviceCard from "../../components/DeviceCard";
import { getOrderDetail } from "../../services/order";

function EarningDetail({ className }) {
  const { id } = useParams();
  document.title = "Earning Detail";
  const [record, setRecord] = useState();
  const [loading, setLoading] = useState(true);
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      try {
        const res = await getOrderDetail(id);
        setRecord(res);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
      setLoading(false);
    }
    if (wallet?.publicKey) {
      loadDetail();
    }
    // eslint-disable-next-line
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
                          {new Date(record.StartTime) > 0
                            ? new Date(record.StartTime).toLocaleString()
                            : "--"}
                        </span>
                        {record.StatusName !== "Failed" &&
                          (record.StatusName === "Available" ? (
                            <span>
                              Remaining Time{" "}
                              <Countdown
                                deadlineTime={new Date(
                                  record.EndTime
                                ).getTime()}
                              />
                            </span>
                          ) : (
                            <span>
                              {record.StatusName === "Refunded"
                                ? "Refund Time " +
                                  new Date(record.RefundTime).toLocaleString()
                                : "End Time " +
                                  new Date(record.EndTime).toLocaleString()}
                            </span>
                          ))}
                      </div>
                      {record.StatusName !== "Failed" && (
                        <DurationProgress
                          startTime={record.StartTime}
                          endTime={
                            record.StatusName === "Available"
                              ? null
                              : record.EndTime
                          }
                          duration={record.Duration}
                          refundTime={
                            record.RefundDuration ? record.RefundTime : null
                          }
                        />
                      )}
                      <div className="price">
                        <div className="price-box">
                          <label>Price</label>
                          <span>
                            {record.Metadata.MachineInfo.Price} DIST / h
                          </span>
                        </div>
                        {record.RefundDuration && (
                          <div className="price-box">
                            <label>Refunded</label>
                            <span>
                              {record.RefundDuration} h -{" "}
                              {record.RefundDuration * record.Price} DIST
                            </span>
                          </div>
                        )}
                        <div className="price-box">
                          <label>Total Duration</label>
                          <span>
                            {record.RefundDuration
                              ? record.Duration - record.RefundDuration
                              : record.Duration}{" "}
                            h
                          </span>
                        </div>
                        <div className="price-box">
                          <label>
                            {record.StatusName === "Available" && "Expected "}
                            Total Earnings
                          </label>
                          <span>
                            {record.Price *
                              (record.RefundDuration
                                ? record.Duration - record.RefundDuration
                                : record.Duration)}{" "}
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
                    <DeviceCard device={record.Metadata.MachineInfo} />
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

export default styled(EarningDetail)`
  color: #fff;
  height: calc(100% - 140px);
  .con {
    width: 1160px;
    margin: 10px auto;
    padding: 0 20px;
    display: block;
    overflow: hidden;
    h1 {
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
          label,
          span {
            width: 50%;
          }
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
