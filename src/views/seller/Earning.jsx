import { Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import {
  getOrderList,
  filterData,
  getTotalEarnings,
} from "@/services/order.js";
import styled from "styled-components";
import Table from "@/components/Table.jsx";
import moment from "moment";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import Pager from "@/components/pager.jsx";
import { formatBalance } from "@/utils/index.js";
import Filter from "@/components/Filter";

function Earning({ className }) {
  document.title = "My Earnings";
  const wallet = useAnchorWallet();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [filterValue, setFilterValue] = useState({
    Direction: "sell",
    Status: "all",
  });
  const [received, setReceived] = useState(0);
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadList(curr) {
      setLoading(true);
      try {
        const res = await getOrderList(
          curr,
          10,
          filterValue,
          wallet.publicKey.toString()
        );
        setTotal(res.Total);
        setList(res.List);
        const { pending, received } = await getTotalEarnings(
          res.Total,
          wallet.publicKey.toString()
        );
        setPending(formatBalance(pending));
        setReceived(formatBalance(received));
      } catch (error) {}
      setLoading(false);
    }
    if (wallet?.publicKey) {
      loadList(current);
    }
  }, [wallet, filterValue, current]);
  const columns = [
    {
      title: "Time",
      width: "13%",
      key: "OrderTime",
      render: (text) => (
        <span>
          {moment(text).format("YYYY.MM.DD")} {moment(text).format("HH:mm:ss")}
        </span>
      ),
    },
    {
      title: "Price",
      width: "10%",
      key: "Price",
      render: (text) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <span className="dist" />
          <span>{text}</span>
        </Stack>
      ),
    },
    {
      title: "Duration",
      width: "10%",
      key: "Duration",
      render: (text) => (
        <span>
          <b>{text}</b> h
        </span>
      ),
    },
    {
      title: "Earnings",
      width: "10%",
      key: "Uuid",
      render: (text, record, index) => (
        <span>
          <b>
            {(record.Duration - (record.RefundDuration || 0)) * record.Price}
          </b>
        </span>
      ),
    },
    {
      title: "Status",
      width: "10%",
      key: "StatusName",
      render: (text) => <span className={text}>{text}</span>,
    },
    {
      title: "",
      width: "10%",
      key: "id",
      render: (text, record, index) => (
        <Button
          className="cbtn"
          style={{
            width: 100,
            height: 32,
          }}
          onClick={() => navigate("/earning/" + record.Uuid)}>
          <span
            style={{
              fontSize: 16,
              lineHeight: "22px",
            }}>
            Details
          </span>
        </Button>
      ),
    },
  ];
  return (
    <div className={className}>
      <h1>My Order Earnings</h1>
      <Stack
        direction="row"
        justifyContent="space-between"
        style={{ marginTop: 24 }}>
        <Stack spacing={2} className="box">
          <label>All order earnings you have already received.</label>
          <Stack direction="row" spacing={1} alignItems="center">
            <span className="number">{received}</span>
            <label style={{ color: "white" }}>DIST</label>
          </Stack>
          <span>Received</span>
        </Stack>
        <Stack spacing={2} className="box">
          <label>
            All order earnings you can expect to receive after orders are
            completed.
          </label>
          <Stack direction="row" spacing={1} alignItems="center">
            <span className="number">{pending}</span>
            <label style={{ color: "white" }}>DIST</label>
          </Stack>
          <span>Pending</span>
        </Stack>
      </Stack>
      <Filter
        data={filterData}
        defaultValue={{
          Direction: "buy",
          Status: "all",
        }}
        onFilter={(value) => {
          setCurrent(1);
          setFilterValue(value);
        }}
      />
      <Table
        className="earning-list"
        columns={columns}
        list={list}
        empty={<span>No Item yet</span>}
        loading={loading}
      />
      {total > 10 && (
        <Pager
          current={current}
          total={total}
          pageSize={10}
          onChange={(curr) => {
            setCurrent(curr);
          }}
        />
      )}
    </div>
  );
}

export default styled(Earning)`
  h1 {
    font-size: 32px;
    line-height: 44px;
    margin: 0;
  }
  .box {
    width: 700px;
    height: 140px;
    background: rgba(149, 157, 165, 0.16);
    border-radius: 12px;
    padding: 40px;
    label {
      font-size: 18px;
      color: #959da5;
      line-height: 26px;
    }
    span {
      font-weight: 500;
      font-size: 18px;
      line-height: 26px;
    }
    .number {
      font-weight: 600;
      font-size: 32px;
      line-height: 44px;
    }
  }
  .earning-list {
    span {
      font-size: 18px;
      line-height: 26px;
    }
  }
`;
