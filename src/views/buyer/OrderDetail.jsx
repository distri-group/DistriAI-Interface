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
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import DurationProgress from "@/components/DurationProgress.jsx";
import Countdown from "@/components/Countdown.jsx";
import DeviceCard from "@/components/DeviceCard.jsx";
import * as anchor from "@project-serum/anchor";
import { capitalize } from "lodash";
import { getItemList } from "@/services/model";
import ConnectToWallet from "@/components/ConnectToWallet";
import { useWallet } from "@solana/wallet-adapter-react";

function OrderDetail({ className }) {
  const { id } = useParams();
  document.title = "Order detail";
  const [record, setRecord] = useState();
  const [loading, setLoading] = useState(true);
  const [endDialog, setEndDialog] = useState(false);
  const [fileUploadDialog, setFileUploadDialog] = useState(false);
  const [selectedModel, setSelectedModel] = useState("default");
  const [modelList, setModelList] = useState([]);
  const [connectModal, setConnectModal] = useState(false);
  const wallet = useAnchorWallet();
  const { signMessage } = useWallet();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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
  useEffect(() => {
    loadDetail();
    // eslint-disable-next-line
  }, []);
  function handleEndDuration() {
    if (!wallet?.publicKey) {
      return setConnectModal(true);
    }
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
  async function checkIfEnd(id) {
    const timer = setInterval(async () => {
      const res = await getOrderDetail(id);
      if (
        res.StatusName === "Completed" ||
        res.StatusName === "Failed" ||
        res.StatusName === "Refunded"
      ) {
        clearInterval(timer);
        loadDetail();
      }
    }, 3000);
  }
  async function handleFileSelect() {
    if (selectedModel === "default") {
      return enqueueSnackbar("Please select model to upload files", {
        variant: "info",
      });
    }
    try {
      const msg = `upload/file/${parseInt(
        Date.now() / 1000000
      )}/${wallet?.publicKey.toString()}`;
      const encodeMsg = new TextEncoder().encode(msg);
      const sign = await signMessage(encodeMsg, "utf8");
      const signature = anchor.utils.bytes.bs58.encode(sign);
      const search = new URLSearchParams();
      search.append("s", signature);
      search.append("n", selectedModel);
      search.append("p", wallet.publicKey.toString());
      search.append("t", Date.now());
      window.open(
        `http://${record.Metadata.MachineInfo.IP}:${
          record.Metadata.MachineInfo.Port
        }/uploadfiles?${search.toString()}`
      );
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setFileUploadDialog(false);
    setSelectedModel("default");
  }
  useEffect(() => {
    const getCreatedModelList = async () => {
      const res = await getItemList("model", 1, 100, {
        Owner: wallet.publicKey.toString(),
      });
      setModelList(res.List);
    };
    if (wallet?.publicKey) {
      getCreatedModelList();
    }
  }, [wallet]);

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
                          onClick={() => {
                            if (!wallet?.publicKey)
                              return setConnectModal(true);
                            navigate(`/order/${id}/extend`);
                          }}>
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
                            onClick={() => {
                              if (!wallet?.publicKey)
                                return setConnectModal(true);
                              setFileUploadDialog(true);
                            }}>
                            Upload File
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
                                  onEnd={checkIfEnd}
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
            className="cbtn"
            onClick={() => setEndDialog(false)}
            autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={fileUploadDialog}>
        <DialogTitle>Upload device files to model</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <span>
              Are you willing to upload files to model already created or create
              a model before?
            </span>
            <Select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
              }}>
              <MenuItem value="default" disabled>
                <span style={{ color: "black" }}>
                  Please select model you created here
                </span>
              </MenuItem>
              {modelList.map((model) => (
                <MenuItem key={model.Name} value={model.Name}>
                  <span style={{ color: "black" }}>{model.Name}</span>
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFileSelect}>Select file</Button>
          <Button onClick={() => navigate(`/order/${id}/create-model`)}>
            Create a new model
          </Button>
        </DialogActions>
      </Dialog>
      <ConnectToWallet
        open={connectModal}
        onClose={() => setConnectModal(false)}
      />
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
