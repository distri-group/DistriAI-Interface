import styled from "styled-components";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useSnackbar } from "notistack";
import { CircularProgress, Stack, Grid } from "@mui/material";
import DurationProgress from "@/components/DurationProgress.jsx";
import Countdown from "@/components/Countdown.jsx";
import DeviceCard from "@/components/DeviceCard.jsx";
import { getOrderDetail } from "@/services/order.js";

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
            <h1>{record.Metadata.formData.taskName}</h1>
            <p style={{ color: "#898989" }}>
              <b>For: </b>
              {record.Buyer}
            </p>
            <h2 className={record.StatusName}>
              {" "}
              · {record.StatusName}{" "}
              {record.StatusName === "Failed" && <span>Failed reason</span>}
            </h2>
            {record.Metadata.MachineInfo ? (
              <>
                <div>
                  <div className="title">
                    <span>Order Info</span>
                  </div>
                  <div className="info">
                    <Stack
                      className="time"
                      direction="row"
                      justifyContent="space-between">
                      <Stack direction="row" spacing={1}>
                        <label>Start Time</label>
                        <span>
                          {new Date(record.StartTime) > 0
                            ? new Date(record.StartTime).toLocaleString()
                            : "--"}
                        </span>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        {record.StatusName !== "Failed" &&
                          (record.StatusName === "Available" ? (
                            <>
                              <label>Remaining Time</label>
                              <span>
                                <Countdown
                                  deadlineTime={new Date(
                                    record.EndTime
                                  ).getTime()}
                                />
                              </span>
                            </>
                          ) : record.StatusName === "Refunded" ? (
                            <>
                              <label>Refund Time</label>
                              <span>
                                {new Date(record.RefundTime).toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <>
                              <label>End Time</label>
                              <span>
                                {new Date(record.EndTime).toLocaleString()}
                              </span>
                            </>
                          ))}
                      </Stack>
                    </Stack>
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
                    <Grid container spacing={2}>
                      <Grid item md={4}>
                        <Stack className="price-box" direction="column">
                          <label>Price</label>
                          <span>
                            <b>{record.Price}</b> DIST / h
                          </span>
                        </Stack>
                      </Grid>
                      {record.RefundDuration && (
                        <Grid item md={4}>
                          <Stack className="price-box" direction="column">
                            <label>Refunded</label>
                            <span>
                              <b>{record.RefundDuration}</b> h -{" "}
                              <b>{record.RefundDuration * record.Price}</b> DIST
                            </span>
                          </Stack>
                        </Grid>
                      )}
                      <Grid item md={4}>
                        <Stack className="price-box" direction="column">
                          <label>Total Duration</label>
                          <span>
                            <b>
                              {record.RefundDuration
                                ? record.Duration - record.RefundDuration
                                : record.Duration}
                            </b>{" "}
                            h
                          </span>
                        </Stack>
                      </Grid>
                      <Grid item md={4}>
                        <Stack className="price-box" direction="column">
                          <label>Total Earnings</label>
                          <span>
                            <b>
                              {record.Price *
                                (record.RefundDuration
                                  ? record.Duration - record.RefundDuration
                                  : record.Duration)}
                            </b>{" "}
                            DIST
                          </span>
                        </Stack>
                      </Grid>
                    </Grid>
                  </div>
                </div>
                <div>
                  <div className="title">
                    <span>Configuration</span>
                  </div>
                  <DeviceCard device={record.Metadata.MachineInfo} />
                </div>
                <div>
                  <div className="title">
                    <span>Blockchain Info</span>
                  </div>
                  <div className="info">
                    <Stack direction="row" justifyContent="space-between">
                      <label>Hash</label>
                      <span>{record.Uuid}</span>
                    </Stack>
                  </div>
                </div>
              </>
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
  h1 {
    font-weight: 600;
    font-size: 32px;
    line-height: 44px;
  }
  h2 {
    margin: 0;
  }
  .title {
    border-bottom: 1px solid #797979;
    display: flex;
    justify-content: space-between;
    span {
      font-size: 28px;
      line-height: 38px;
      margin: 28px 0;
    }
  }
  .info {
    margin-top: 24px;
    padding: 0 40px;
    label {
      font-size: 20px;
      color: #898989;
      line-height: 28px;
    }
    span {
      font-size: 20px;
      line-height: 28px;
    }
  }
`;
