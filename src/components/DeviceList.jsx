import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Button, Grid, Stack } from "@mui/material";
import { formatAddress, getProvider } from "@/utils/index.js";
import Table from "./Table.jsx";
import ConnectToWallet from "./ConnectToWallet.jsx";

function DeviceList({
  className,
  list,
  loading,
  onPriceSort,
  onCancel,
  model,
}) {
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const [connectModal, setConnectModal] = useState(false);
  const [priceSort, setPriceSort] = useState(0);

  useEffect(() => {
    if (priceSort) {
      onPriceSort(priceSort);
    }
    // eslint-disable-next-line
  }, [priceSort]);
  let columns = [
    {
      title: onCancel ? "Device" : "Provider",
      width: "14%",
      key: "addr",
      render: (text, record, index) => {
        return (
          <div className="provider">
            <Stack direction="row" alignItems="center">
              {(record?.SecurityLevel || record?.SecurityLevel === 0) && (
                <span className={`level level-${record.SecurityLevel}`}>
                  Level {record.SecurityLevel}
                </span>
              )}
              {onPriceSort ? (
                <span className="from">
                  From <span style={{ color: "white" }}>{record.From}</span>
                </span>
              ) : (
                <span className="from">Personal</span>
              )}
            </Stack>
            <a
              className="addr"
              href={`https://solscan.io/address/${record.Owner}?cluster=devnet`}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}>
              {formatAddress(record.Owner)}
            </a>
            <div className="id"># {record.Uuid.slice(-10)}</div>
            <Stack direction="row" spacing={8} style={{ margin: "16px 0" }}>
              <Stack className="info">
                <span>{record.Reliability}</span>
                <label>Reliability</label>
              </Stack>
              <Stack className="info">
                <span>{record.CPS}</span>
                <label>CPS</label>
              </Stack>
            </Stack>
            <div className="region">
              <img src="/img/market/global.svg" alt="global" />
              <div className="region-info">
                <span>{record.Region}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Configuration",
      width: "23%",
      key: "Algorithm",
      render: (text, record, index) => {
        return (
          <div className="configuration">
            <div className="gpu">
              {record.GpuCount}x <b>{record.Gpu}</b> {record.GPUMemory || ""}
            </div>
            <div className="graphicsCoprocessor">#{record.CPU}</div>
            <Grid container spacing={2} style={{ marginTop: 0 }}>
              <Grid item md={2}>
                <Stack className="info">
                  <span>
                    <b>{record.Tflops || "--"}</b>
                  </span>
                  <label>TFLOPS</label>
                </Stack>
              </Grid>
              <Grid item md={2}>
                <Stack className="info">
                  <span>
                    <b>{record.RAM}</b> GB
                  </span>
                  <label>RAM</label>
                </Stack>
              </Grid>
              <Grid item md={4}>
                <Stack className="info">
                  <span>
                    <b>
                      {record.Disk ||
                        parseInt(record.Metadata.DiskInfo.TotalSpace)}
                    </b>{" "}
                    GB
                  </span>
                  <label>Avail Disk Storage</label>
                </Stack>
              </Grid>
              <Grid item md={4} />
              <Grid item md={4}>
                <span className="duration">
                  Max Duration: {record.MaxDuration}h
                </span>
              </Grid>
              <Grid item md={4}>
                <img
                  style={{ transform: "rotate(180deg)", marginLeft: 4 }}
                  src="/img/market/download.svg"
                  alt=""
                />
                <span className="duration">{record.Speed.Upload}</span>
              </Grid>
              <Grid item md={4}>
                <img
                  style={{ marginRight: 4 }}
                  src="/img/market/download.svg"
                  alt=""
                />
                <span className="duration">{record.Speed.Download}</span>
              </Grid>
            </Grid>
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>DIST / hr</span>
          {onPriceSort && (
            <Stack spacing={0.5} style={{ marginLeft: 11 }}>
              <svg
                width="10"
                height="7"
                onClick={() => setPriceSort(2)}
                style={{ cursor: "pointer" }}>
                <polygon
                  points="5,0 10,7 0,7"
                  fill={priceSort === 2 ? "#898989" : "white"}
                />
              </svg>
              <svg
                width="10"
                height="7"
                onClick={() => setPriceSort(1)}
                style={{ cursor: "pointer" }}>
                <polygon
                  points="0,0 10,0 5,7"
                  fill={priceSort === 1 ? "#898989" : "white"}
                />
              </svg>
            </Stack>
          )}
        </div>
      ),
      width: "15%",
      key: "Price",
      render: (text, record, index) => {
        if (record.Status === 0) {
          return <span className="no-price">- -</span>;
        }
        return (
          <Stack direction="row" spacing={2} alignItems="center">
            <span className="token" />
            <span className="price">{record.Price}</span>
          </Stack>
        );
      },
    },
    {
      title: "",
      width: "5%",
      key: "Id",
      render: (text, record, index) => {
        return (
          <Button
            disabled={record.Status === 2}
            className={
              onCancel
                ? "mini-btn mini-btn" + record.Status
                : record.Status === 1
                ? "mini-btn mini-btn0"
                : "mini-btn mini-btn2"
            }
            onClick={() => {
              if (!getProvider() || !wallet?.publicKey) {
                return setConnectModal(true);
              }
              if (onPriceSort) {
                return navigate(
                  `/device/${record.Uuid}/buy?own=${record.Owner}`,
                  {
                    state: { model },
                  }
                );
              }
              if (record.Status === 0) {
                return navigate("/device/" + record.Uuid + "/list", {
                  state: { Owner: record.Owner },
                });
              }
              if (record.Status === 1) {
                return onCancel(record);
              }
            }}>
            {onCancel
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
      <Table
        columns={columns}
        list={list}
        loading={loading}
        empty={
          onCancel ? (
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
      <ConnectToWallet open={connectModal} />
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
    width: 56px;
    height: 24px;
    border-radius: 6px;
    font-weight: 400;
    font-size: 16px;
    color: #0f1d35;
    line-height: 22px;
    padding: 0 11px;
  }
  .level-0 {
    background: #898989;
  }
  .level-1,
  .level-2 {
    background: #09e98d;
  }
  .from {
    font-size: 18px;
    color: #898989;
    line-height: 26px;
    margin-left: 16px;
  }
  .mini-btn {
    width: 160px;
    height: 48px;
    font-size: 18px;
    line-height: 26px;
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
  .info {
    span {
      font-size: 20px;
      line-height: 28px;
    }
    label {
      font-size: 16px;
      color: #898989;
      line-height: 22px;
    }
  }
  .price {
    font-weight: 600;
    font-size: 24px;
    line-height: 34px;
  }
  .provider {
    .status {
      padding-bottom: 24px;
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
      line-height: 24px;
      margin: 12px 0 8px 0;
    }
    .id {
      font-weight: 400;
      font-size: 16px;
      color: #898989;
      line-height: 22px;
    }
    .region {
      display: flex;
      clear: both;
      flex-direction: row;
      align-items: bottom;
      img {
        width: 24px;
        height: 24px;
      }
      span {
        font-weight: 400;
        font-size: 18px;
        line-height: 26px;
        margin-left: 8px;
      }
    }
    .region-info {
      width: calc(100% - 40px);
      display: flex;
      justify-content: space-between;
    }
  }
  .configuration {
    .gpu {
      font-weight: 400;
      font-size: 24px;
      line-height: 34px;
    }
    .graphicsCoprocessor {
      background-image: url(/img/market/cpu.svg);
      background-size: 16px;
      background-repeat: no-repeat;
      background-position: left;
      font-weight: 400;
      font-size: 18px;
      color: #d7ff65;
      line-height: 26px;
      padding: 16px 0;
      padding-left: 22px;
    }
    .duration {
      font-size: 18px;
      line-height: 26px;
    }
    img {
      width: 16px;
      height: 16px;
    }
  }
  .empty-box {
    .add-machine {
      text-decoration: none;
      color: #0aab50;
    }
  }
`;
