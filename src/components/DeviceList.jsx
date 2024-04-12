import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Button, Chip, Stack } from "@mui/material";
import { formatAddress, getProvider } from "@/utils/index.js";
import Table from "./Table.jsx";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
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
            <Stack direction="row" alignItems="end">
              <Chip
                style={{
                  height: 20,
                }}
                size="small"
                label={`level ${record?.SecurityLevel}`}
                color={
                  record.SecurityLevel === 0
                    ? "primary"
                    : record.SecurityLevel === 1
                    ? "success"
                    : record.SecurityLevel === 2 && "info"
                }
              />
              {onPriceSort ? (
                <span style={{ marginLeft: 5, lineHeight: "20px" }}>
                  From{" "}
                  <span style={{ fontWeight: 600, fontSize: 20 }}>
                    {record.From}
                  </span>
                </span>
              ) : (
                <span style={{ marginLeft: 5, fontWeight: 600, fontSize: 20 }}>
                  Personal
                </span>
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
            <div className="reliability">
              <span className="l">
                <label>{record.Reliability}</label>
                <span>Reliability</span>
              </span>
              <span className="r">
                <label>{record.CPS}</label>
                <span>CPS</span>
              </span>
            </div>
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
      width: "15%",
      key: "Algorithm",
      render: (text, record, index) => {
        return (
          <div className="configuration">
            <div className="gpu">
              {record.GPU} {record.GPUMemory || ""}
            </div>
            <div className="graphicsCoprocessor">#{record.CPU}</div>
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
                {record.Speed.Upload}
              </span>
              <font>
                <img src="/img/market/download.svg" alt="" />{" "}
                {record.Speed.Download}
              </font>
            </div>
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ display: "flex" }}>
          <span>DIST / hr</span>
          {onPriceSort && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}>
              <ArrowDropUp
                onClick={() => setPriceSort(1)}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  color: priceSort === 1 ? "#898989" : "white",
                }}
              />
              <ArrowDropDown
                onClick={() => setPriceSort(2)}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  color: priceSort === 2 ? "#898989" : "white",
                }}
              />
            </div>
          )}
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
                return navigate("/device/" + record.Uuid + "/buy", {
                  state: { model, Owner: record.Owner },
                });
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
      line-height: 24px;
      margin-top: 4px;
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
