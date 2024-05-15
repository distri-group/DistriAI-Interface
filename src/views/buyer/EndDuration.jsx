import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useSnackbar } from "notistack";
import { CircularProgress, Popover, Stack, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import DurationProgress from "@/components/DurationProgress.jsx";
import { PublicKey } from "@solana/web3.js";
import Countdown from "@/components/Countdown.jsx";
import { getOrderDetail } from "@/services/order.js";
import useSolanaMethod from "@/utils/useSolanaMethod.js";
import { useClearCache } from "@/components/ClearCacheProvider";

function EndDuration({ className }) {
  document.title = "End Duration";
  const { id } = useParams();
  const { wallet, methods } = useSolanaMethod();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const [detail, setDetail] = useState({});
  const [deviceDetail, setDeviceDetail] = useState({});
  const [balance, setBalance] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [remainingTime, setRemainingTime] = useState();
  const { clearCache } = useClearCache();
  const open = Boolean(anchorEl);

  async function onSubmit() {
    if (detail.StatusName === "Available" && remainingTime < 3600000) {
      return enqueueSnackbar("Remaining duration less than 1 hour.", {
        variant: "info",
      });
    }
    if (
      detail.StatusName !== "Available" &&
      detail.StatusName !== "Preparing"
    ) {
      return enqueueSnackbar("Order not in training", { variant: "info" });
    }
    setEnding(true);
    const machinePublicKey = methods.getMachinePublicKey(
      detail.Metadata.MachineInfo.Uuid,
      new PublicKey(detail.Seller)
    );
    try {
      await methods.refundOrder(
        machinePublicKey,
        id,
        new PublicKey(detail.Seller)
      );
      enqueueSnackbar("Refund order success.", { variant: "success" });
      setTimeout(() => {
        clearCache();
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setEnding(false);
  }
  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      try {
        const res = await getOrderDetail(id);
        setDetail(res);
        if (res.Metadata?.MachineInfo) {
          setDeviceDetail(res.Metadata.MachineInfo);
        }
        const remains = new Date(res.EndTime).getTime() - new Date().getTime();
        setRemainingTime(remains);
        const amount = await methods.getTokenBalance(wallet.publicKey);
        setBalance(amount);
      } catch (error) {}
      setLoading(false);
    }
    if (wallet?.publicKey) {
      loadDetail();
    }
    // eslint-disable-next-line
  }, [id, wallet]);
  return (
    <div className={className}>
      <h1>End Duration</h1>
      <div className="form">
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
                    <span>{new Date(detail.StartTime).toLocaleString()}</span>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <label>Remaining Time</label>
                    <span>
                      <Countdown
                        deadlineTime={new Date(detail.EndTime).getTime()}
                      />
                    </span>
                  </Stack>
                </Stack>
                <DurationProgress
                  startTime={detail.StartTime}
                  duration={detail.Duration}
                />
                <Grid container>
                  <Grid item md={3}>
                    <Stack spacing={1}>
                      <label>Price</label>
                      <span>{deviceDetail.Price} DIST / h</span>
                    </Stack>
                  </Grid>
                  <Grid item md={3}>
                    <Stack spacing={1}>
                      <label>Total Duration</label>
                      <span>
                        <b>{detail.Duration}</b> h
                      </span>
                    </Stack>
                  </Grid>
                  <Grid item md={3}>
                    <Stack spacing={1}>
                      <label>Total Price</label>
                      <span>
                        <b>{deviceDetail.Price * detail.Duration}</b> DIST
                      </span>
                    </Stack>
                  </Grid>
                  <Grid item md={3}>
                    <Stack spacing={1}>
                      <label>Remain Duration</label>
                      <span>{detail.RemainingDuration || 0} h</span>
                    </Stack>
                  </Grid>
                </Grid>
                <Stack direction="row" justifyContent="end">
                  <span className="balance">Balance: {balance} DIST</span>
                </Stack>
              </div>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                className="total">
                <label style={{ display: "flex", alignItems: "center" }}>
                  Refund Total
                  <span
                    className="tip"
                    aria-owns={open ? "mouse-over-popover" : undefined}
                    aria-haspopup="true"
                    onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
                    onMouseLeave={() => setAnchorEl(null)}></span>
                  <Popover
                    id="mouse-over-popover"
                    sx={{
                      pointerEvents: "none",
                      width: "40%",
                    }}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    slotProps={{
                      paper: {
                        style: {
                          backgroundColor: "#d7d7d7",
                        },
                      },
                    }}
                    onClose={() => setAnchorEl(null)}
                    disableRestoreFocus>
                    <div style={{ padding: "8px 12px" }}>
                      <h3 style={{ textAlign: "center", margin: "4px 0" }}>
                        Refund Policy
                      </h3>
                      <p style={{ margin: "8px 0" }}>
                        Full refunds are available for the unused rental time of
                        'available' orders. The minimum unit for calculation is
                        per hour (any partial hour used will be counted as 1
                        full hour).
                      </p>
                      <p style={{ margin: "8px 0" }}>
                        The used rental time will be deducted, and the refund
                        amount calculated based on the remaining rental hours
                        multiplied by the hourly rate.
                      </p>
                    </div>
                  </Popover>
                </label>
                <Stack>
                  <span className="amount">
                    {detail.RemainingDuration * detail.Price || 0}
                  </span>
                  <label>DIST</label>
                </Stack>
              </Stack>
              <Stack direction="row" justifyContent="center">
                <LoadingButton
                  loading={ending}
                  onClick={onSubmit}
                  style={{ width: 160 }}
                  className="cbtn confirm">
                  {!ending && <span>Confirm</span>}
                </LoadingButton>
              </Stack>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default styled(EndDuration)`
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
  .tip {
    display: block;
    width: 12px;
    height: 12px;
    margin-left: 4px;
    background-image: url(/img/market/tip.svg);
    background-position: center;
    background-size: 100%;
    background-repeat: no-repeat;
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
    label {
      font-size: 20px;
      color: #898989;
      line-height: 28px;
    }
    span {
      font-size: 20px;
      line-height: 28px;
    }
    .amount {
      font-weight: 600;
      font-size: 32px;
      line-height: 44px;
      text-align: right;
    }
  }
`;
