import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { getFilterData, getOrderList } from "../services/order";
import styled from "styled-components";
import Table from "../components/Table";
import moment from "moment";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

function Earning({ className }) {
  let filter = { Direction: "sell" };
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterValue, setFilterValue] = useState();
  const [loading, setLoading] = useState(false);
  const loadList = async (curr) => {
    setLoading(true);
    try {
      const res = await getOrderList(curr, filter, wallet.publicKey.toString());
      console.log("Order List", res);
      if (!res) {
        return enqueueSnackbar("Order List Not Found", { variant: "error" });
      }
      setList(res.list);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };
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
          <span>{text.toFixed(2)}</span>
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
          <b>{record.Duration * record.Price}</b>
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
      render: (text, record, index) => <span className="cbtn">Details</span>,
    },
  ];
  useEffect(() => {
    const loadFilterData = () => {
      const res = getFilterData();
      setFilterData(res);
      res.forEach((t) => {
        filter[t.name] = "all";
      });
      setFilterValue(filter);
    };
    loadFilterData();
    if (wallet?.publicKey) {
      loadList(1);
    }
  }, [wallet?.publicKey]);
  return (
    <div className={className}>
      <h1>My DAO Rewards</h1>
      <div className="box">
        <div style={{ width: "400px" }}>
          <p className="describe">
            All periodic & task rewards you can currently claim.
          </p>
          <div className="volume">
            <div style={{ width: "160px" }}>
              <span className="number">300.8</span>
              <span>DIST</span>
              <p>Total Claimable</p>
            </div>
            <div className="vertical">
              <span>155.04</span>
              <label>Periodic Rewards</label>
            </div>
            <div className="vertical">
              <span>220.00</span>
              <label>Task Rewards</label>
            </div>
          </div>
        </div>
        <Button className="claim">Claim Earning</Button>
      </div>
      <div className="box">
        <div style={{ width: "400px" }}>
          <p className="describe">
            All periodic & task rewards you have already claimed.
          </p>
          <div className="volume">
            <div style={{ width: "160px" }}>
              <span className="number Completed">1230.25</span>
              <span className="Completed">DIST</span>
              <p>Total Claimed</p>
            </div>
            <div className="vertical">
              <span>155.04</span>
              <label>Periodic Rewards</label>
            </div>
            <div className="vertical">
              <span>220.00</span>
              <label>Task Rewards</label>
            </div>
          </div>
        </div>
      </div>
      {/* <Table
        className="earning-list"
        columns={columns}
        list={list}
        empty={<span>No Item yet</span>}
        loading={loading}
      /> */}
    </div>
  );
}

export default styled(Earning)`
  color: white;
  width: 1200px;
  margin: 10px auto;
  padding: 0 20px;
  h1 {
    font-family: Montserrat Bold, Montserrat, sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 28px;
    padding-left: 36px;
    background-image: url(/img/market/2.png);
    background-repeat: no-repeat;
    background-size: 32px;
    background-position: left;
    margin-top: 25px;
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
      display: flex;
      justify-content: space-between;
      .number {
        font-weight: bolder;
        font-size: 24px;
        padding: 0 8px;
      }
      p {
        width: 130px;
        text-align: center;
      }
      .vertical {
        color: #aaa;
        label {
          font-size: 12px;
        }
        span {
          display: block;
          font-size: 18px;
          font-weight: bolder;
          margin-top: 16px;
        }
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
