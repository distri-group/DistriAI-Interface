import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import React, { useState, useEffect, useRef } from "react";
import { getMachineDetailByUuid } from "../services/machine";
import { getOrderList } from "../services/order";
import SolanaAction from "../components/SolanaAction";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import webconfig from "../webconfig";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useSnackbar } from "notistack";
import { CircularProgress, Grid, TextField } from "@mui/material";
import DurationToggle from "../components/DurationToggle";
import DeviceCard from "../components/DeviceCard";
import * as anchor from "@project-serum/anchor";

function Buy({ className }) {
  document.title = "Edit model";
  const { id } = useParams();
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [formValue, setFormValue] = useState({
    duration: 0,
    taskName: "",
  });
  const [deviceDetail, setDeviceDetail] = useState({});
  const childRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prevState) => ({ ...prevState, [name]: value }));
  };
  const onSubmit = async (e) => {
    const orderId = new Date().valueOf().toString();
    e.preventDefault();
    const MachineInfo = {
      UUID: deviceDetail.UUID,
      Provider: deviceDetail.Provider,
      Region: deviceDetail.Region,
      GPU: deviceDetail.GPU,
      CPU: deviceDetail.CPU,
      Tflops: deviceDetail.Tflops,
      RAM: deviceDetail.RAM,
      AvailDiskStorage: deviceDetail.Disk,
      Reliability: deviceDetail.Reliability,
      CPS: deviceDetail.CPS,
      Speed: deviceDetail.Speed,
      MaxDuration: deviceDetail.MaxDuration,
      Price: deviceDetail.Price,
    };
    // const OrderInfo = {
    //   Intent: deviceDetail ? "train" : "deploy",
    //   DownloadURL: [],
    // };
    // OrderInfo.DownloadURL.sort((a, b) =>
    //   b.includes("requirements.txt") ? -1 : 0
    // );
    const [machinePublicKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("machine"),
        new PublicKey(deviceDetail.Metadata.Addr).toBytes(),
        anchor.utils.bytes.hex.decode(deviceDetail.Uuid),
      ],
      webconfig.PROGRAM
    );
    setSubmitting(true);
    const res = await childRef.current.placeOrder(
      machinePublicKey,
      orderId,
      formValue.duration,
      { formData: formValue, MachineInfo }
    );
    if (res.msg !== "ok") {
      setSubmitting(false);
      return enqueueSnackbar(res.msg, { variant: "error" });
    }
    enqueueSnackbar("Purchase Successfully.", { variant: "success" });
    setTimeout(() => {
      setSubmitting(false);
      navigate("/order");
    }, 300);
  };

  useEffect(() => {
    if (formValue.duration && deviceDetail.Price) {
      setAmount(formValue.duration * deviceDetail.Price);
    }
  }, [formValue, deviceDetail]);
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const amount = await childRef.current.getTokenAccountBalance(
        webconfig.MINT_PROGRAM,
        wallet.publicKey
      );
      const res = await getOrderList(1, [], wallet.publicKey.toString());
      setFormValue((prevState) => ({
        ...prevState,
        taskName: `Computing Task-${res.total}`,
      }));
      setBalance(amount / LAMPORTS_PER_SOL);
      const detail = await getMachineDetailByUuid(id);
      if (detail) {
        setDeviceDetail(detail);
      }
      setLoading(false);
    };
    if (wallet?.publicKey) {
      init();
    }
  }, [wallet, id]);
  return (
    <div className={className}>
      <SolanaAction ref={childRef}></SolanaAction>
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="container">
          <h1>Purchase Computing Power</h1>
          <div>
            <h2>Configuration</h2>
            <DeviceCard device={deviceDetail} />
          </div>
          <div>
            <h2>Order Info</h2>
            <form onSubmit={onSubmit}>
              <Grid container spacing={2}>
                <Grid item md={12}>
                  <DurationToggle
                    duration={formValue.duration}
                    setDuration={(duration) =>
                      setFormValue((prevState) => ({ ...prevState, duration }))
                    }
                    max={deviceDetail.MaxDuration}
                    title="Duration"
                  />
                </Grid>
                <Grid item md={12}>
                  <label>Task Name</label>
                </Grid>
                <Grid item md={12}>
                  <TextField
                    value={formValue.taskName}
                    name="taskName"
                    onChange={handleChange}
                    placeholder="Must be 4-45 characters"
                  />
                </Grid>
                <Grid item md={8} />
                <Grid item md={4}>
                  <p className="balance">Balance: {balance} DIST</p>
                </Grid>
                <Grid item md={12}>
                  <div className="box">
                    <div className="left">Total</div>
                    <div className="right">
                      <span style={{ fontSize: "28px" }}>{amount || 0}</span>
                      <label>DIST</label>
                    </div>
                  </div>
                </Grid>
                <Grid item md={12}>
                  <LoadingButton
                    type="submit"
                    loading={submitting}
                    className="cbtn"
                    style={{ width: 100 }}>
                    {!submitting && "Confirm"}
                  </LoadingButton>
                </Grid>
              </Grid>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default styled(Buy)`
  width: 1200px;
  margin: 0 auto;
  .container {
    width: 750px;
    h1 {
      font-weight: 700;
      font-style: normal;
      font-size: 28px;
      margin-top: 25px;
      line-height: 70px;
    }
    h2 {
      font-size: 20px;
      margin: 0;
      border-bottom: 1px solid rgb(121, 121, 121);
      line-height: 48px;
    }
    .balance {
      text-align: right;
      line-height: 50px;
      font-size: 14px;
      color: rgb(224, 196, 189);
      margin: 0;
    }
    .box {
      border-radius: 5px;
      background-color: rgb(21, 21, 21);
      display: flex;
      justify-content: space-between;
      padding: 20px;
      .left {
        display: flex;
        align-items: center;
      }
      .right {
        span,
        label {
          display: block;
          font-weight: 600;
          text-align: right;
        }
      }
    }
  }
`;
