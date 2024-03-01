import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import SolanaAction from "../components/SolanaAction";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSnackbar } from "notistack";
import { Box, Button, Modal } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { formatAddress } from "../utils";
import Table from "./Table";
import * as anchor from "@project-serum/anchor";
import webconfig from "../webconfig";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

function DeviceList({
  className,
  list,
  setList,
  isMyDevice,
  loading,
  reloadFunc,
  onPriceSort,
}) {
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  const [deviceToCancel, setDeviceToCancel] = useState(null);
  const [connectModal, setConnectModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [priceSort, setPriceSort] = useState(null);
  const childRef = useRef();
  const cancelOffer = async (row) => {
    setBtnLoading(true);
    const [machinePublicKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("machine"),
        wallet.publicKey.toBytes(),
        anchor.utils.bytes.hex.decode(row.Uuid),
      ],
      webconfig.PROGRAM
    );
    let res = await childRef.current.cancelOffer(machinePublicKey);
    if (res?.msg !== "ok") {
      setList([...list]);
      setDeviceToCancel(null);
      setBtnLoading(false);
      return enqueueSnackbar(res?.msg, { variant: "error" });
    }
    enqueueSnackbar("Cancel Offer Success.", {
      variant: "success",
    });
    setTimeout(() => {
      setBtnLoading(false);
      setDeviceToCancel(null);
      reloadFunc();
    }, 300);
  };
  useEffect(() => {
    if (wallet?.publicKey) {
      setConnectModal(false);
    }
  }, [wallet?.publicKey]);
  useEffect(() => {
    if (priceSort !== null) {
      onPriceSort(priceSort);
    }
  }, [priceSort]);
  let columns = [
    {
      title: isMyDevice ? "Device" : "Provider",
      width: "14%",
      key: "addr",
      render: (text, record, index) => {
        return (
          <div className="provider">
            <div style={{ display: "flex" }}>
              <span
                className="level"
                style={{
                  backgroundColor:
                    record?.SecurityLevel === 0
                      ? "#f89898"
                      : record.SecurityLevel === 1
                      ? "#eebe77"
                      : record.SecurityLevel === 2
                      ? "#95d475"
                      : "#79bbff",
                }}>
                level {record?.SecurityLevel}
              </span>
            </div>
            <a
              className="addr"
              href={`https://solscan.io/address/${record.Owner}?cluster=devnet`}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}>
              {formatAddress(record.Owner)}
            </a>
            <div className="id"># {record.UuidShort}</div>
            <div className="reliability">
              <span className="l">
                <label>{record.Reliability}</label>
                <span>Reliability</span>
              </span>
              <span className="r">
                <label>{record.Score}</label>
                <span>CPS</span>
              </span>
            </div>
            <div className="region">
              <img src="/img/market/global.svg" alt="global" />
              <div className="region-info">
                <span>{record.Region}</span>
                <span>{record.Metadata?.LocationInfo?.query || ""}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Configuration",
      width: "15%",
      key: "Algorithm",
      render: (text, record, index) => {
        return (
          <div className="configuration">
            <div className="gpu">{record.GpuCount + "x " + record.Gpu}</div>
            <div className="graphicsCoprocessor">#{record.Cpu}</div>
            <div className="more">
              <span className="l">
                <label>{record.Tflops || "--"}</label>
                <span>TFLOPS</span>
              </span>
              <span className="l">
                <label>{record.RAM}</label>
                <span>RAM</span>
              </span>
              <span className="l">
                <label>
                  {record.Disk || parseInt(record.Metadata.DiskInfo.TotalSpace)}{" "}
                  GB
                </label>
                <span>Avail Disk Storage</span>
              </span>
            </div>
            <div className="dura">
              <label>Max Duration: {record.MaxDuration}h</label>
              <span>
                <img className="t180" src="/img/market/download.svg" alt="" />{" "}
                {record.UploadSpeed}
              </span>
              <font>
                <img src="/img/market/download.svg" alt="" />{" "}
                {record.DownloadSpeed}
              </font>
            </div>
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ display: "flex" }}>
          <span>Price (h)</span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}>
            <ArrowDropUp
              onClick={() => setPriceSort(true)}
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />
            <ArrowDropDown
              onClick={() => setPriceSort(false)}
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />
          </div>
        </div>
      ),
      width: "12%",
      key: "Price",
      render: (text, record, index) => {
        if (record.Status === 0) {
          return <span className="no-price">- -</span>;
        }
        return (
          <div className="price">
            <span className="token" />
            <span>{record.Price}</span>
          </div>
        );
      },
    },
    {
      title: "",
      width: "13%",
      key: "Id",
      render: (text, record, index) => {
        return (
          <Button
            disabled={record.Status === 2}
            className={
              isMyDevice
                ? "mini-btn mini-btn" + record.Status
                : record.Status === 1
                ? "mini-btn mini-btn0"
                : "mini-btn mini-btn2"
            }
            onClick={() => {
              if (!window.solana || !window.phantom || !wallet?.publicKey) {
                return setConnectModal(true);
              }
              if (!isMyDevice) {
                return navigate("/buy/" + record.Uuid);
              }
              if (record.Status === 0) {
                return navigate("/makeoffer/" + record.Uuid);
              }
              if (record.Status === 1) {
                return setDeviceToCancel(record);
              }
            }}>
            {isMyDevice
              ? record.Status === 0
                ? "Make Offer"
                : "Unlist"
              : record.Status === 1
              ? "Select"
              : "Rented"}
          </Button>
        );
      },
    },
  ];
  return (
    <div className={className}>
      <SolanaAction ref={childRef}></SolanaAction>
      <Table
        columns={columns}
        list={list}
        loading={loading}
        empty={
          isMyDevice ? (
            <span>
              Please{" "}
              <a
                className="add-machine"
                href="https://docs.distri.ai/core/getting-started/compute-node"
                target="_blank"
                rel="noreferrer">
                Add Your Machine
              </a>{" "}
              in the client
            </span>
          ) : (
            <span>No item yet</span>
          )
        }
      />
      {deviceToCancel && (
        <Modal
          open={Boolean(deviceToCancel)}
          onClose={() => {
            if (!btnLoading) {
              setDeviceToCancel(null);
            }
          }}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 1000,
              bgcolor: "#00000b",
              boxShadow: 24,
              p: 4,
              borderRadius: "8px",
              color: "#fff",
            }}>
            <h1 style={{ fontSize: "72px", textAlign: "center" }}>
              Unlist The Offer
            </h1>
            <div style={{ fontSize: "16px", textAlign: "center" }}>
              <p style={{ margin: 0, lineHeight: "19px" }}>
                This will cancel your listing.
              </p>
              <p style={{ margin: 0, lineHeight: "19px" }}>
                You will also be asked to confirm this cancelation from your
                wallet.
              </p>
            </div>
            <LoadingButton
              style={{ margin: "0 auto", display: "block", marginTop: "150px" }}
              className="cbtn"
              loading={btnLoading}
              onClick={() => {
                cancelOffer(deviceToCancel);
              }}>
              <span style={{ padding: "0 40px" }}>
                {btnLoading ? "" : "Confirm"}
              </span>
            </LoadingButton>
          </Box>
        </Modal>
      )}
      <Modal
        open={connectModal}
        onClose={() => setConnectModal(false)}
        slotProps={{ root: { style: { zIndex: "300" } } }}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 1000,
            bgcolor: "#00000b",
            p: 4,
            zIndex: 300,
            borderRadius: "8px",
          }}>
          <div className="login-box">
            <p className="big-title">Connect Your Wallet</p>
            <p className="con-title">
              If you don't have a wallet yet, you can select a provider and
              create one now
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <WalletMultiButton />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default styled(DeviceList)`
  .spin-box {
    width: 100%;
    height: 150px;
    padding-top: 50px;
    display: block;
    text-align: center;
  }
  .no-price {
    font-weight: 700;
    font-style: normal;
    font-size: 20px;
    color: #ffffff;
  }
  .level {
    margin-bottom: 5px;
    border-radius: 5px;
    line-height: 20px;
    height: 20px;
    font-size: 12px;
    padding: 0 15px;
    color: #333;
  }
  .token {
    margin: 0;
    border-radius: 100%;
    background-color: white;
    background-image: url(/img/token.png);
    background-size: 70%;
    background-position: center;
    background-repeat: no-repeat;
    width: 24px;
    height: 24px;
  }
  .mini-btn {
    border-radius: 4px;
    border: none;
    height: 31px;
    font-size: 14px;
    display: block;
    text-align: center;
    overflow: hidden;
    margin-right: 10px;
    width: 102px;
    line-height: 20px;
    float: right;
    :hover {
      border: none;
    }
    color: black;
  }
  .mini-btn0 {
    background-image: linear-gradient(to right, #20ae98, #0aab50);
    color: white;
  }
  .mini-btn0:hover {
    color: white !important;
  }
  .mini-btn1 {
    background-color: rgba(255, 185, 185, 1);
  }
  .mini-btn2 {
    background-color: rgba(70, 70, 70, 1);
    color: white;
  }
  .mini-btn1:hover {
    background-color: rgba(255, 214, 214, 1);
    color: black !important;
  }
  .t180 {
    transform: rotate(180deg);
  }
  .price {
    display: flex;
    clear: both;
    flex-direction: row;
    align-items: center;
    img {
      width: 24px;
    }
    span {
      font-size: 20px;
      color: #ffffff;
      line-height: 20px;
      margin-left: 5px;
      font-weight: bold;
    }
  }
  .provider {
    width: 237px;
    padding: 20px 0 15px;
    .status {
      width: 77px;
      height: 19px;
      line-height: 19px;
      color: #333;
      border-radius: 4px;
      display: block;
      overflow: hidden;
      text-align: center;
      font-size: 12px;
      margin-bottom: 10px;
    }
    .status0 {
      display: none;
    }
    .status1 {
      background-color: #f7ffad;
    }
    .status2 {
      background-color: #b6ff9e;
    }
    .addr {
      display: block;
      font-size: 16px;
      color: #94d6e2;
      line-height: 20px;
    }
    .id {
      font-size: 13px;
      color: #797979;
      line-height: 15px;
    }
    .reliability {
      display: flex;
      clear: both;
      flex-direction: row;
      padding: 13px 0;
      .l {
        width: 50%;
        display: flex;
        flex-direction: column;
        label {
          font-size: 16px;
          color: #e0c4bd;
          font-weight: bold;
          line-height: 20px;
        }
        span {
          color: #797979;
          font-size: 13px;
          line-height: 15px;
        }
      }
      .r {
        width: 50%;
        display: flex;
        flex-direction: column;
        label {
          font-size: 16px;
          color: #efc6ff;
          font-weight: bold;
          line-height: 20px;
        }
        span {
          color: #797979;
          font-size: 13px;
          line-height: 15px;
        }
      }
    }
    .region {
      display: flex;
      clear: both;
      flex-direction: row;
      align-items: center;
      img {
        width: 14px;
      }
      span {
        font-size: 14px;
        color: #ffffff;
        line-height: 20px;
        margin-left: 5px;
      }
    }
    .region-info {
      width: calc(100% - 40px);
      display: flex;
      justify-content: space-between;
    }
  }
  .configuration {
    width: 573px;
    padding: 10px 0 0px;
    .gpu {
      font-size: 24px;
      color: #ffffff;
      line-height: 20px;
    }
    .graphicsCoprocessor {
      font-size: 14px;
      color: #d7ff65;
      background-image: url(/img/market/cpu.svg);
      background-size: 16px;
      background-repeat: no-repeat;
      background-position: left;
      text-indent: 20px;
      line-height: 40px;
    }
    .more {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      margin-top: 11px;
      .l {
        margin-right: 69px;
        label {
          display: block;
          font-size: 16px;
          line-height: 26px;
          color: #ffffff;
        }
        span {
          display: block;
          color: #797979;
          font-size: 13px;
          line-height: 13px;
        }
      }
    }
    .dura {
      color: #ffffff;
      font-size: 13px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      height: 40px;
      line-height: 40px;
      label {
        width: 200px;
      }
      span {
        width: 200px;
        text-indent: 20px;
        img {
          width: 11px;
        }
      }
      font {
        background-size: 10px;
        background-position: left;
        background-repeat: no-repeat;
        width: 200px;
        text-indent: 20px;
        position: relative;
        top: 0;
        img {
          width: 11px;
        }
      }
    }
  }
  .empty-box {
    .add-machine {
      text-decoration: none;
      color: #0aab50;
    }
  }
`;
