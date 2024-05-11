import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getOrderDetail } from "@/services/order.js";
import { useSnackbar } from "notistack";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
} from "@mui/material";
import DurationProgress from "@/components/DurationProgress.jsx";
import Countdown from "@/components/Countdown.jsx";
import DeviceCard from "@/components/DeviceCard.jsx";
import { capitalize } from "lodash";

function OrderDetail({ className }) {
  const { id } = useParams();
  document.title = "Order detail";
  const [record, setRecord] = useState();
  const [loading, setLoading] = useState(true);
  const [endDialog, setEndDialog] = useState(false);
  const wallet = useAnchorWallet();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      try {
        const res = await getOrderDetail(id);
        setRecord(res);
      } catch (error) {}
      setLoading(false);
    }
    if (wallet?.publicKey) {
      loadDetail();
    }
    // eslint-disable-next-line
  }, [id, wallet]);
  function handleEndDuration() {
    if (record.StatusName !== "Available") {
      return enqueueSnackbar("Order not in training", { variant: "info" });
    }
    if (
      new Date(record.EndTime).getTime() > new Date().getTime() &&
      new Date(record.EndTime).getTime() - new Date().getTime() > 3600000
    ) {
      navigate(`/order/${id}/end`);
    } else {
      return setEndDialog(true);
    }
  }
  return (
    <div className={className}>
      <div>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <h1>{record.Metadata.formData.taskName}</h1>
            <h2 className={record.StatusName}>
              · {record.StatusName}
              {record.StatusName === "Failed" && (
                <span>
                  :{" "}
                  {record.Metadata.OrderInfo?.Message ??
                    "Failed reason not found"}
                </span>
              )}
            </h2>
            {record.Metadata.MachineInfo ? (
              <>
                <div>
                  <div className="info-box-title">
                    <span>Task Info</span>
                    {record.StatusName === "Available" && (
                      <Stack direction="row" spacing={3}>
                        <Button
                          className="cbtn"
                          style={{ width: 180 }}
                          onClick={() => navigate(`/order/${id}/extend`)}>
                          Extend Duration
                        </Button>
                        <Button
                          className="white-btn"
                          style={{ width: 180 }}
                          onClick={handleEndDuration}>
                          End Duration
                        </Button>
                        {record.Metadata.OrderInfo.Intent === "train" && (
                          <Button
                            className="cbtn"
                            style={{ width: 180 }}
                            onClick={() =>
                              navigate(`/order/${id}/create-model`)
                            }>
                            Create Model
                          </Button>
                        )}
                      </Stack>
                    )}
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
                          <label>Total Price</label>
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
                      <Grid item md={4}>
                        <Stack className="price-box" direction="column">
                          <label>Model</label>
                          <span>
                            {record.Metadata.OrderInfo?.Model || "--"}
                          </span>
                        </Stack>
                      </Grid>
                      <Grid item md={4}>
                        <Stack className="price-box" direction="column">
                          <label>Usage</label>
                          <span>
                            {capitalize(record.Metadata.OrderInfo?.Intent)}
                          </span>
                        </Stack>
                      </Grid>
                    </Grid>
                  </div>
                </div>
                <div>
                  <div className="info-box-title">
                    <span>Configuration</span>
                  </div>
                  <DeviceCard device={record.Metadata.MachineInfo} />
                </div>
                <div>
                  <div className="info-box-title">
                    <span>Blockchain Info</span>
                  </div>
                  <Stack direction="column" spacing={3} className="info">
                    <Stack direction="row" justifyContent="space-between">
                      <label>Hash</label>
                      <span>{record.Uuid}</span>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <label>From</label>
                      <span>{record.Seller}</span>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <label>To</label>
                      <span>{record.Buyer}</span>
                    </Stack>
                  </Stack>
                </div>
              </>
            ) : (
              <span>Machine Data Not Found</span>
            )}
          </>
        )}
      </div>
      <Dialog open={endDialog} onClose={() => setEndDialog(false)}>
        <DialogTitle style={{ textAlign: "center" }}>
          Refund Unavailable.
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          Remaining rental time is less than 1 hour.
        </DialogContent>
        <DialogActions>
          <Button
            style={{
              backgroundColor: "#94d6e2",
              borderRadius: "3px",
              color: "black",
              padding: "4px 12px",
            }}
            onClick={() => setEndDialog(false)}
            autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default styled(OrderDetail)`
  h1 {
    font-weight: 600;
    font-size: 32px;
    line-height: 44px;
  }
  h2 {
    margin: 0;
  }
  .info-box-title {
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
