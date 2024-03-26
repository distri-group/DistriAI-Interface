import styled from "styled-components";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import Table from "./Table";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Backdrop, CircularProgress } from "@mui/material";
import { getMachineList } from "../services/machine";
import { signToken } from "../services/order";

function Header({ className, list, loading }) {
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(loading);
  const [signing, setSigning] = useState(false);
  const handleConsole = async (uuid) => {
    setSigning(true);
    const res = await getMachineList(1);
    const machineList = res.list;
    const machine = machineList.find((machine) => machine.UUID === uuid);
    if (machine) {
      try {
        await signToken(machine.IP, machine.Port, wallet.publicKey.toString());
      } catch (e) {
        enqueueSnackbar(e, { variant: "error" });
      }
    }
    setSigning(false);
  };
  useEffect(() => {
    for (let item of list) {
      item.Loading = false;
    }
  }, [list]);
  let columns = [
    {
      title: "Time",
      width: "10%",
      key: "BuyTime",
      render: (text, record, index) => {
        return (
          <div className="time">
            <div className="y">
              {moment(record.OrderTime).format("YYYY.MM.DD")}
            </div>
            <div className="h">
              {moment(record.OrderTime).format("HH:mm:ss")}
            </div>
          </div>
        );
      },
    },
    {
      title: "Task Name",
      width: "14%",
      key: "TaskName",
      render: (text, record, index) => {
        return record.Metadata?.formData?.taskName || "--";
      },
    },
    {
      title: "DIST / hr",
      width: "10%",
      key: "Price",
      render: (text, record, index) => {
        return (
          <div className="price">
            <span className="token" />
            <span>{record.Price}</span>
          </div>
        );
      },
    },
    {
      title: "Remaining Time",
      width: "14%",
      key: "RemainingTime",
      render: (text, record, index) => {
        return <div>{record.RemainingTime}</div>;
      },
    },
    {
      title: "Total",
      width: "10%",
      key: "Total",
      render: (text, record, index) => {
        return (
          <div className="total">
            <label>{text}</label>
          </div>
        );
      },
    },
    {
      title: "Status",
      width: "10%",
      key: "StatusName",
      render: (text, record, index) => {
        return <div className={record.StatusName}>{text}</div>;
      },
    },
    {
      title: "",
      width: "10%",
      key: "Uuid",
      render: (text, record, index) => (
        <div className="btns">
          <span
            onClick={() => {
              handleConsole(record.Metadata.MachineInfo.UUID);
            }}
            className={`mini-btn ${
              record.StatusName !== "Available" && "disabled"
            }`}>
            Console
          </span>
          <span
            onClick={() => navigate("/order/" + text)}
            className={`mini-btn ${
              record.StatusName === "Preparing" && "disabled"
            }`}>
            Detail
          </span>
        </div>
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

export default styled(Header)`
  .order-table {
    tr td {
      padding: 20px 10px !important;
    }
  }
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
      margin-left: 8px;
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
  .status-Available {
    color: #bdff95;
  }
  .status-Completed {
    color: #878787;
  }
  .status-Refunded {
    color: #ffb9b9;
  }
  .btns {
    display: flex;
    justify-content: space-between;
  }
  .key {
    padding: 5px 15px;
    background-image: url("/img/key.png");
    background-position: center;
    background-size: 70%;
    background-repeat: no-repeat;
  }
  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  .disabled:hover {
    opacity: 0.5 !important;
  }
  .mini-btn {
    border-radius: 4px;
    border: none;
    height: 31px;
    line-height: 31px;
    padding: 0 10px;
    font-size: 14px;
    display: block;
    text-align: center;
    overflow: hidden;
    margin-right: 10px;
    float: right;
    :hover {
      border: none;
    }
    background-image: linear-gradient(to right, #20ae98, #0aab50);
    color: white;
    cursor: pointer;
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
`;
