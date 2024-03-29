import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getDetailByUuid } from "../services/order";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useSnackbar } from "notistack";
import { CircularProgress, Popover } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import DurationProgress from "../components/DurationProgress";
import SolanaAction from "../components/SolanaAction";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import webconfig from "../webconfig";
import * as anchor from "@project-serum/anchor";
import Countdown from "../components/Countdown";

function EndDuration({ className }) {
  document.title = "End Duration";
  const { id } = useParams();
  const wallet = useAnchorWallet();
  const navigate = useNavigate();
  const childRef = useRef();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const [detail, setDetail] = useState();
  const [balance, setBalance] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [remainingTime, setRemainingTime] = useState();
  const open = Boolean(anchorEl);
  const onSubmit = async () => {
    if (remainingTime < 3600000) {
      return enqueueSnackbar("Remaining duration less than 1 hour.", {
        variant: "info",
      });
    }
    if (detail.StatusName !== "Available") {
      return enqueueSnackbar("Order not in training", { variant: "info" });
    }
    setEnding(true);
    const [machinePublicKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("machine"),
        new PublicKey(detail.Metadata.MachineInfo.Provider).toBytes(),
        anchor.utils.bytes.hex.decode(detail.Metadata.MachineInfo.UUID),
      ],
      webconfig.PROGRAM
    );
    const res = await childRef.current.refundOrder(
      machinePublicKey,
      id,
      detail.Seller
    );
    setEnding(false);
    if (res?.msg === "ok") {
      enqueueSnackbar("Refund Order Success", {
        variant: "success",
      });
      navigate("/order");
    } else {
      enqueueSnackbar(res.msg, { variant: "error" });
    }
  };
  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      const res = await getDetailByUuid(id, wallet.publicKey.toString());
      setLoading(false);
      if (res.Status === 1) {
        setDetail(res.Detail);
        let remains =
          new Date(res.Detail.EndTime).getTime() - new Date().getTime();
        setRemainingTime(remains);
      } else {
        return enqueueSnackbar(res.Msg, { variant: "error" });
      }
    };
    const getBalance = async () => {
      setLoading(true);
      const amount = await childRef.current.getTokenAccountBalance(
        webconfig.MINT_PROGRAM,
        wallet.publicKey
      );
      setBalance(amount / LAMPORTS_PER_SOL);
    };
    if (wallet?.publicKey) {
      getBalance();
      loadDetail();
    }
    // eslint-disable-next-line
  }, [id, wallet]);
  return (
    <div className={className}>
      <SolanaAction ref={childRef}></SolanaAction>
      <div className="container">
        <h1>End Duration</h1>
        <div className="form">
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <div>
                <h2>Configuration</h2>
                <div>
                  <p>{detail.Metadata.MachineInfo.GPU}</p>
                  <span>
                    {detail.Metadata.MachineInfo.Tflops || "--"} TFLOPS
                  </span>
                  <div className="vertical">
                    <div className="box">
                      <label>RAM</label>
                      <span>{detail.Metadata.MachineInfo.RAM}</span>
                    </div>
                    <div className="box">
                      <label>Avail Disk Storage</label>
                      <span>
                        {detail.Metadata.MachineInfo.AvailDiskStorage} GB
                      </span>
                    </div>
                    <div className="box">
                      <label>CPU</label>
                      <span>{detail.Metadata.MachineInfo.CPU}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2>Order Info</h2>
                <div className="time">
                  <span>
                    Start Time{" "}
                    {new Date(detail.StartTime) > 0
                      ? new Date(detail.StartTime).toLocaleString()
                      : "--"}
                  </span>
                  <span>
                    Remaining Time{" "}
                    <Countdown
                      deadlineTime={new Date(detail.EndTime).getTime()}
                    />
                  </span>
                </div>
                {detail.StatusName !== "Failed" && (
                  <DurationProgress
                    startTime={detail.StartTime}
                    duration={detail.Duration}
                  />
                )}
                <div className="horizontal">
                  <div className="box">
                    <label>Price</label>
                    <span>{detail.Metadata.MachineInfo.Price} DIST / h</span>
                  </div>
                  <div className="box">
                    <label>Total Duration</label>
                    <span>{detail.Duration} h</span>
                  </div>
                  <div className="box">
                    <label>Total Price</label>
                    <span>
                      {detail.Metadata.MachineInfo.Price * detail.Duration} DIST
                    </span>
                  </div>
                  <div className="box">
                    <label>Remain Duration</label>
                    <span>{detail.RemainingDuration} h</span>
                  </div>
                </div>
                <p className="balance">Balance: {balance} DIST</p>
                <div className="total">
                  <span style={{ display: "flex", alignItems: "center" }}>
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
                          Full refunds are available for the unused rental time
                          of 'available' orders. The minimum unit for
                          calculation is per hour (any partial hour used will be
                          counted as 1 full hour).
                        </p>
                        <p style={{ margin: "8px 0" }}>
                          The used rental time will be deducted, and the refund
                          amount calculated based on the remaining rental hours
                          multiplied by the hourly rate.
                        </p>
                      </div>
                    </Popover>
                  </span>
                  <div>
                    <span className="balance">
                      <b>{detail.RemainingDuration * detail.Price}</b>
                    </span>
                    <span>DIST</span>
                  </div>
                </div>
                <LoadingButton
                  loading={ending}
                  onClick={onSubmit}
                  className="cbtn confirm">
                  {ending ? "" : "Confirm"}
                </LoadingButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default styled(EndDuration)`
  color: white;
  height: calc(100% - 140px);
  h1 {
    font-weight: 700;
    font-style: normal;
    font-size: 28px;
    color: white;
    margin: 0;
    line-height: 70px;
  }
  h2 {
    font-size: 16px;
    color: white;
    line-height: 48px;
    border-bottom: 1px solid #797979;
  }
  h3 {
    text-align: center;
  }
  .form {
    width: 64%;
  }
  .container {
    width: 1160px;
    margin: 10px auto;
    padding: 0 20px;
    display: block;
    overflow: hidden;
    .box {
      font-size: 14px;
      color: #aaa;
    }
    .vertical {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      label,
      span {
        display: block;
      }
    }
    .horizontal {
      width: 30%;
      .box {
        display: flex;
        justify-content: space-between;
      }
    }
    .time {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
    }
    .balance {
      text-align: right;
      color: #e0c4bd;
      font-size: 14px;
    }
    .total {
      border-radius: 5px;
      background-color: #151515;
      display: flex;
      justify-content: space-between;
      padding: 24px 20px;
      .balance {
        display: block;
        text-align: right;
        font-size: 20px;
        color: white;
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
    }
    .confirm {
      margin-top: 30px;
      width: 120px;
      height: 40px;
    }
  }
`;
