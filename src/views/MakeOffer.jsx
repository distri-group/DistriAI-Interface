import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { getMachineDetailByUuid } from "../services/machine";
import SolanaAction from "../components/SolanaAction";
import { useSnackbar } from "notistack";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import webconfig from "../webconfig";

let inputValues = {
  price: 0,
  duration: 0,
  disk: 0,
};

function Home({ className }) {
  const { id } = useParams();
  document.title = "Make Offer";
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [maxStorage, setMaxStorage] = useState(0);

  const childRef = useRef();
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      let detail = await getMachineDetailByUuid(
        id,
        wallet.publicKey.toString()
      );
      if (detail) {
        setMaxStorage(parseInt(detail.Metadata?.DiskInfo?.TotalSpace));
      }
      setLoading(false);
    };
    if (wallet?.publicKey) {
      init();
    }
    return () => {
      inputValues = {
        price: 0,
        duration: 0,
        disk: 0,
      };
    };
  }, [id, wallet?.publicKey]);
  const onInput = (e, n) => {
    let value = parseInt(e.target.value);
    if (!e.target.value || isNaN(e.target.value)) {
      value = 0;
    }
    inputValues[n] = value;
  };
  const onPriceChange = (value) => {
    if (!isNaN(value)) {
      setPrice(parseFloat(value));
    } else {
      setPrice(0);
    }
  };
  const onSubmit = async () => {
    let tprice = parseFloat(price);
    let maxDuration = inputValues.duration;
    let disk = inputValues.disk;
    if (tprice <= 0) {
      return enqueueSnackbar("The price must greater than 0", {
        variant: "error",
      });
    }
    if (maxDuration <= 0) {
      return enqueueSnackbar(
        "The max duration must be an integer greater than 0",
        { variant: "error" }
      );
    }
    if (disk <= 0) {
      return enqueueSnackbar("The disk must be an integer greater than 0", {
        variant: "error",
      });
    }
    setLoading(true);
    const [machinePublicKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("machine"),
        wallet.publicKey.toBytes(),
        anchor.utils.bytes.hex.decode(id),
      ],
      webconfig.PROGRAM
    );
    try {
      let result = await childRef.current.makeOffer(
        machinePublicKey,
        tprice,
        maxDuration,
        disk
      );
      setLoading(false);
      if (result?.msg === "ok") {
        enqueueSnackbar("Make Offer Success.", { variant: "success" });
        setTimeout(() => {
          navigate("/device");
        }, 300);
      } else {
        enqueueSnackbar(result?.msg, { variant: "error" });
      }
    } catch (e) {
      enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  return (
    <div className={className}>
      <SolanaAction ref={childRef}></SolanaAction>
      <div className="con">
        <h1 className="title">Make Offer</h1>
        <div className="myform">
          <div className="form-row">
            <div className="row-txt">Price (per hour)</div>
            <TextField
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              placeholder="Enter the price per hour"
              min={0}
              max={99999}
            />
            <span className="uni">DIST</span>
          </div>
          <div className="form-row">
            <div className="row-txt">Max duration</div>
            <TextField
              onChange={(e) => onInput(e, "duration")}
              type="number"
              placeholder="Enter an integer"
              min={0}
              max={99999}
            />
            <span className="uni">Hour</span>
          </div>
          <div className="form-row">
            <div className="row-txt">Max disk storage</div>
            <div className="row-title2">Avail Disk Storage: {maxStorage}GB</div>
            <TextField
              onChange={(e) => onInput(e, "disk")}
              type="number"
              placeholder="Enter an integer"
              min={0}
              max={maxStorage}
            />
            <span className="uni">GB</span>
          </div>
          <div className="form-row">
            <div className="row-txt drow">
              <span
                style={{
                  margin: 0,
                  borderRadius: "100%",
                  backgroundColor: "white",
                  backgroundImage: "url('/img/token.png')",
                  backgroundSize: "70%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  width: "24px",
                  height: "24px",
                }}
              />
              <span className="num" style={{ fontSize: 28, margin: "0 10px" }}>
                {price}
              </span>
              <label
                style={{ fontSize: 13, color: "#bbb", fontWeight: "normal" }}>
                DIST
              </label>
            </div>
          </div>
          <div className="form-row">
            <LoadingButton
              loading={loading}
              style={{ marginTop: 30, width: "100px" }}
              onClick={onSubmit}
              className="cbtn">
              {loading ? "" : "Confirm"}
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default styled(Home)`
  display: block;
  width: 100%;
  height: 100%;
  color: #fff;
  .mini-btn {
    border: 1px solid #fff;
  }
  .drow {
    display: flex !important;
    align-items: center;
    flex-direction: row;
    justify-content: flex-start;
    width: 200px;
    margin-top: 20px;
  }
  .uni {
    position: absolute;
    bottom: 16px;
    font-size: 14px;
    right: 15px;
    color: #fff;
  }
  .row-title2 {
    font-size: 14px;
    color: #e0c4bd;
    line-height: 24px;
    display: block;
    margin-bottom: 10px;
  }
  .con {
    width: 1200px;
    padding: 0 20px;
    margin: 10px auto;
    display: block;
    overflow: hidden;
    .title {
      font-weight: 700;
      font-style: normal;
      font-size: 28px;
      color: #ffffff;
      margin-top: 25px;
      line-height: 70px;
    }
  }
  .block {
    display: block;
    overflow: hidden;
  }
  .mini-btn {
    color: #fff;
    border: 1px solid #fff;
    border-radius: 4px;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
  }
`;
