import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import { useSnackbar } from "notistack";
import { CircularProgress, Grid, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import DurationProgress from "@/components/DurationProgress.jsx";
import DurationToggle from "@/components/DurationToggle.jsx";
import Countdown from "@/components/Countdown.jsx";
import { getOrderDetail } from "@/services/order.js";
import useSolanaMethod from "@/utils/useSolanaMethod.js";
import { PublicKey } from "@solana/web3.js";
import { getTotal } from "@/utils/index.js";
import InsufficientDialog from "@/components/InsufficientDialog";
import ConnectToWallet from "../../components/ConnectToWallet";

function ExtendDuration({ className }) {
  const { id } = useParams();
  document.title = "Edit model";
  const navigate = useNavigate();
  const { wallet, methods } = useSolanaMethod();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [extending, setExtending] = useState(false);
  const [duration, setDuration] = useState(1);
  const [balance, setBalance] = useState(0);
  const [deviceDetail, setDeviceDetail] = useState({});
  const [orderDetail, setOrderDetail] = useState({});
  const [insufficientDialog, setInsufficientDialog] = useState(false);
  const [connectModal, setConnectModal] = useState(false);
  const amount = useMemo(() => {
    if (deviceDetail.Price) {
      return getTotal(deviceDetail.Price, parseFloat(duration));
    }
    return 0;
  }, [duration, deviceDetail]);

  async function onSubmit() {
    if (!wallet?.publicKey) return setConnectModal(true);
    if (orderDetail.Buyer !== wallet.publicKey.toString())
      return enqueueSnackbar(
        "You are not connected with right account. Please change wallet account.",
        { variant: "info" }
      );
    const machinePublicKey = methods.getMachinePublicKey(
      deviceDetail.Uuid,
      new PublicKey(deviceDetail.Provider)
    );
    setExtending(true);
    try {
      await methods.renewOrder(machinePublicKey, id, duration);
      await checkIfExtended();
      enqueueSnackbar(`Order extended ${duration} h.`, { variant: "success" });
      navigate("/dashboard");
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setExtending(false);
  }
  async function checkIfExtended() {
    const timeout = 5000;
    const intervalTime = 1000;
    return new Promise((resolve) => {
      let timer = null;
      const interval = setInterval(async () => {
        try {
          const res = await getOrderDetail(id);
          if (res.Duration === duration + orderDetail.Duration) {
            clearInterval(interval);
            resolve(true);
          }
        } catch (error) {
          console.error("Error while fetching order list:", error);
          clearInterval(interval);
          clearTimeout(timer);
          throw error;
        }
      }, intervalTime);
      timer = setTimeout(() => {
        clearInterval(interval);
        resolve(false);
      }, timeout);
    });
  }
  useEffect(() => {
    async function init() {
      setLoading(true);
      const res = await getOrderDetail(id);
      setOrderDetail(res);
      if (res.Metadata?.MachineInfo) {
        setDeviceDetail(res.Metadata.MachineInfo);
      }
      const balance = await methods.getTokenBalance(wallet.publicKey);
      setBalance(balance);
      setLoading(false);
    }
    if (wallet?.publicKey) {
      init();
    }
    // eslint-disable-next-line
  }, [wallet, id]);
  return (
    <div className={className}>
      <h1>Extend Duration</h1>
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          <div>
            <div className="title">
              <span>Configuration</span>
            </div>
            <div className="info">
              <span className="name">{deviceDetail.GPU}</span>
              <Stack direction="row" spacing={1} style={{ marginBottom: 24 }}>
                <span>{deviceDetail.Tflops || "--"}</span>
                <label>TFLOPS</label>
              </Stack>
              <Grid container>
                <Grid item md={4}>
                  <Stack spacing={1}>
                    <label>RAM</label>
                    <span>{deviceDetail.RAM}</span>
                  </Stack>
                </Grid>
                <Grid item md={4}>
                  <Stack spacing={1}>
                    <label>Avail Disk Storage</label>
                    <span>{deviceDetail.AvailDiskStorage} GB</span>
                  </Stack>
                </Grid>
                <Grid item md={4}>
                  <Stack spacing={1}>
                    <label>CPU</label>
                    <span>{deviceDetail.CPU}</span>
                  </Stack>
                </Grid>
              </Grid>
            </div>
          </div>
          <div>
            <div className="title">
              <span>Order Info</span>
            </div>
            <div className="info">
              <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" spacing={1}>
                  <label>Start Time</label>
                  <span>
                    {new Date(orderDetail.StartTime).toLocaleString()}
                  </span>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <label>Remaining Time</label>
                  <span>
                    <Countdown
                      deadlineTime={new Date(orderDetail.EndTime).getTime()}
                    />
                  </span>
                </Stack>
              </Stack>
              <DurationProgress
                startTime={orderDetail.StartTime}
                duration={orderDetail.Duration}
              />
            </div>
          </div>
          <div>
            <div className="title">
              <span>Extend Duration</span>
            </div>
            <Stack spacing={2} className="info">
              <DurationToggle
                duration={duration}
                setDuration={setDuration}
                max={deviceDetail.MaxDuration - orderDetail.Duration}
              />
              <Stack direction="row" spacing={1}>
                <label style={{ display: "block", width: 160 }}>
                  Max Duration
                </label>
                <span>{deviceDetail.MaxDuration}h</span>
              </Stack>
              <Stack direction="row" spacing={1}>
                <label style={{ display: "block", width: 160 }}>Price(h)</label>
                <span>{orderDetail.Price} DIST</span>
              </Stack>
              <Stack direction="row" justifyContent="end">
                <span className="balance">Balance: {balance} DIST</span>
              </Stack>
            </Stack>
          </div>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="total">
            <span>Total</span>
            <Stack>
              <span className="amount">{amount}</span>
              <label>DIST</label>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="center">
            <LoadingButton
              loading={extending}
              style={{ width: 160 }}
              className="cbtn"
              onClick={onSubmit}>
              {!extending && <span>Confirm</span>}
            </LoadingButton>
          </Stack>
        </div>
      )}
      <InsufficientDialog
        open={insufficientDialog}
        close={() => setInsufficientDialog(false)}
      />
      <ConnectToWallet
        open={connectModal}
        onClose={() => setConnectModal(false)}
      />
    </div>
  );
}

export default styled(ExtendDuration)`
  h1 {
    font-size: 32px;
    line-height: 44px;
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
    .name {
      font-size: 24px;
      line-height: 34px;
      padding-bottom: 8px;
    }
  }
  .balance {
    font-size: 18px;
    color: #898989;
    line-height: 26px;
  }
  .total {
    width: 1440px;
    height: 80px;
    margin: 16px 40px;
    margin-bottom: 64px;
    padding: 40px;
    background: rgba(149, 157, 165, 0.16);
    border-radius: 12px;
  }
  .amount {
    font-weight: 600;
    font-size: 32px;
    line-height: 44px;
    text-align: right;
  }
`;
