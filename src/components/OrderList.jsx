import styled from "styled-components";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Table from "./Table.jsx";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Backdrop, Button, CircularProgress, Stack } from "@mui/material";
import { getMachineDetail } from "@/services/machine.js";
import { signToken } from "@/services/order.js";
import Countdown from "./Countdown.jsx";
import { useSnackbar } from "notistack";
import { useClearCache } from "./ClearCacheProvider.jsx";
import { checkIfPrepared } from "@/services/order.js";

function OrderList({ className, list, loading, reloadFunc }) {
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  const { clearCache } = useClearCache();
  const [isLoading, setIsLoading] = useState(loading);
  const [signing, setSigning] = useState(false);
  const handleConsole = async (order, deploy) => {
    let machine;
    try {
      if (order?.Metadata?.MachineInfo) {
        machine = order.Metadata.MachineInfo;
      } else {
        machine = await getMachineDetail(
          order.Metadata.MachineInfo.Provider,
          order.Metadata.MachineInfo.Uuid || order.Metadata.MachineInfo.UUID
        );
      }
      setSigning(true);
      const href = await signToken(
        machine.IP,
        machine.Port,
        wallet.publicKey.toString(),
        deploy
      );
      console.log(href);
      window.open(href);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setSigning(false);
  };
  const checkIfDone = async (order) => {
    const timer = setInterval(async () => {
      const completed = await checkIfPrepared(order, true);
      if (completed) {
        clearInterval(timer);
        reloadFunc();
      }
    }, 2000);
  };
  let columns = [
    {
      title: "Time",
      width: "14%",
      key: "BuyTime",
      render: (text, record, index) =>
        `${moment(record.OrderTime).format("YYYY.MM.DD")} ${moment(
          record.OrderTime
        ).format("HH:mm:ss")}`,
    },
    {
      title: "Task Name",
      width: "14%",
      key: "TaskName",
      render: (text, record, index) =>
        record.Metadata?.formData?.taskName || "--",
    },
    {
      title: "DIST / hr",
      width: "10%",
      key: "Price",
      render: (text, record, index) => (
        <div className="price">
          <span>{record.Price}</span>
        </div>
      ),
    },
    {
      title: "Total",
      width: "10%",
      key: "Total",
      render: (text, record, index) => (
        <div className="price">
          <span className="dist" />
          <label>{text}</label>
        </div>
      ),
    },
    {
      title: "Remaining Time",
      width: "14%",
      key: "StartTime",
      render: (text, record, index) => {
        if (record.StatusName === "Available") {
          return (
            <Countdown
              deadlineTime={new Date(record.EndTime).getTime()}
              onEnd={(record) => checkIfDone(record)}
            />
          );
        } else if (record.StatusName !== "Preparing") {
          return <span>00:00:00</span>;
        } else {
          return "";
        }
      },
    },
    {
      title: "Status",
      width: "10%",
      key: "StatusName",
      render: (text, record, index) => {
        if (text === "Preparing") {
          return <CircularProgress sx={{ color: "#ffffff" }} />;
        }
        return <div className={text}>{text}</div>;
      },
    },
    {
      title: "",
      width: "5%",
      key: "Uuid",
      render: (text, record, index) => (
        <Stack direction="row" spacing={2}>
          <Button
            onClick={() => {
              handleConsole(
                record,
                record.Metadata.OrderInfo.Intent === "deploy"
              );
            }}
            disabled={record.StatusName !== "Available"}
            className={
              record.StatusName === "Available" ? "cbtn" : "disabled-btn"
            }
            style={{ width: 64, height: 32 }}>
            Console
          </Button>
          {record.StatusName === "Preparing" ? (
            Date.now() - new Date(record.OrderTime).getTime() > 300000 ? (
              <Button
                onClick={() => {
                  clearCache();
                  navigate(`/order/${text}/end`);
                }}
                className="white-btn"
                style={{ width: 64, height: 32 }}>
                Refund
              </Button>
            ) : (
              <Button
                disabled
                className="disabled-btn"
                style={{ width: 64, height: 32 }}>
                Detail
              </Button>
            )
          ) : (
            <Button
              onClick={() => navigate("/order/" + text)}
              disabled={record.StatusName === "Preparing"}
              className="white-btn"
              style={{ width: 64, height: 32 }}>
              Detail
            </Button>
          )}
        </Stack>
      ),
    },
  ];
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);
  return (
    <div className={className}>
      <Table
        className="order-table"
        columns={columns}
        list={list}
        empty={<span>No item yet</span>}
        loading={isLoading}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={signing}>
        <CircularProgress />
      </Backdrop>
    </div>
  );
}

export default styled(OrderList)`
  .spin-box {
    width: 100%;
    height: 50px;
    padding: 100px 0;
    display: block;
    overflow: hidden;
    text-align: center;
  }
  .price {
    display: flex;
    clear: both;
    flex-direction: row;
    align-items: center;
    img {
      width: 20px;
    }
    span {
      color: #ffffff;
      line-height: 20px;
      margin-right: 8px;
    }
  }
  .total {
    display: flex;
    flex-direction: column;
    span {
      padding: 1px;
      background-color: #000;
      color: #797979;
      font-size: 12px;
      border-radius: 6px;
      width: 31px;
      text-align: center;
    }
  }
  .white-btn,
  .disabled-btn {
    height: 32px;
  }
  .Mui-disabled {
    background: rgba(255, 255, 255, 0.24);
    color: #0f1d35 !important;
  }
`;
