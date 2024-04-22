import { MenuItem, Select, Stack } from "@mui/material";
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

  function onFilter(event) {
    setFilterValue((prevState) => ({
      ...prevState,
      Status: parseInt(event.target.value),
    }));
    setCurrent(1);
  }
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
      width: "10%",
      key: "OrderTime",
      render: (text) => (
        <div className="time-box">
          <div>{moment(text).format("YYYY.MM.DD")}</div>
          <div className="Completed">{moment(text).format("HH:mm:ss")}</div>
        </div>
      ),
    },
    {
      title: "Price",
      width: "10%",
      key: "Price",
      render: (text) => (
        <div className="price">
          <span className="coin" />
          <span style={{ lineHeight: "24px" }}>{text.toFixed(2)}</span>
        </div>
      ),
    },
    {
      title: "Duration",
      width: "10%",
      key: "Duration",
      render: (text) => <span>{text} h</span>,
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
        <span
          className="cbtn"
          onClick={() => navigate("/earning/" + record.Uuid)}>
          Details
        </span>
      ),
    },
  ];
  return (
    <div className={className}>
      <h1>My Order Earnings</h1>
      <div className="container">
        <div className="box">
          <div>
            <p className="describe">
              All order earnings you have already received.
            </p>
            <span className="volume">
              <div>
                <span className="number">{received}</span>
                <span className="Completed">DIST</span>
              </div>
              <p className="Completed">Received</p>
            </span>
          </div>
        </div>
        <div className="box">
          <div>
            <p className="describe">
              All order earnings you can expect to receive after orders are
              completed.
            </p>
            <span className="volume">
              <div>
                <span className="number">{pending}</span>
                <span className="Completed">DIST</span>
              </div>
              <p className="Completed">Pending</p>
            </span>
          </div>
        </div>
      </div>
      <Stack direction="row" spacing={2} className="filter">
        <span>Filter</span>
        {Object.entries(filterData).map(([key, value]) => (
          <span key={key}>
            <Select value={filterValue[key]} onChange={onFilter}>
              {value.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </span>
        ))}
        <span
          className="btn-txt"
          onClick={() => setFilterValue({ Direction: "buy", Status: "all" })}>
          reset
        </span>
      </Stack>
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
    font-weight: 700;
    font-style: normal;
    font-size: 28px;
    padding-left: 36px;
    background-image: url(/img/market/seller.png);
    background-repeat: no-repeat;
    background-size: 32px;
    background-position: left;
    margin-top: 25px;
  }
  .price {
    display: flex;
    .coin {
      margin-right: 5px;
    }
  }
  .container {
    display: flex;
    justify-content: space-between;
    .box {
      width: 45%;
    }
  }
  .box {
    background-color: #222;
    margin-bottom: 8px;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    padding-left: 40px;
    .describe {
      color: #aaa;
      font-size: 12px;
    }
    .volume {
      display: inline-block;
      padding: 8px 20px;
      .number {
        font-weight: bolder;
        font-size: 24px;
        padding: 0 8px;
      }
      p {
        margin: 0;
        text-align: center;
      }
    }
  }
  .claim {
    width: 140px;
    height: 30px;
    background-color: #94d6e2;
    color: black;
    margin-top: 48px;
  }
  .earning-list {
    tr td {
      padding: 10px !important;
    }
    .time-box {
      padding: 10px;
      font-size: 14px;
    }
    .cbtn {
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
    }
  }
  .coin {
    display: block;
    margin: 0;
    border-radius: 100%;
    background-image: url(/img/token.png);
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    width: 24px;
    height: 24px;
  }
  .filter {
    padding: 10px 0;
    .sel {
      margin: 0 12px;
    }
    .btn-txt {
      font-weight: 700;
      font-size: 14px;
      text-decoration: underline;
      color: #ffffff;
      cursor: pointer;
    }
  }
`;