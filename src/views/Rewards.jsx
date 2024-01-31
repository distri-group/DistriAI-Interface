import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { getFilterData, getOrderList } from "../services/order";
import styled from "styled-components";
import Table from "../components/Table";
import moment from "moment";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Pager from "../components/pager";

function Rewards({ className }) {
  let filter = { Direction: "sell" };
  document.title = "My Rewards";
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
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
      setTotal(res.total);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };
  const onPageChange = (curr) => {
    setCurrent(curr);
    loadList(curr);
  };
  const columns = [
    {
      title: "Period",
      width: "10%",
      key: "Period",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Start",
      width: "10%",
      key: "StartTime",
    },
    {
      title: "End",
      width: "10%",
      key: "EndTime",
    },
    {
      title: "Duration",
      width: "10%",
      key: "Duration",
    },
    {
      title: "Reward pool",
      width: "10%",
      key: "Pool",
      render: (text) => (
        <div>
          <span className="coin" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Rewards",
      width: "10%",
      key: "Rewards",
      render: (text) => <span>{text.toFixed(2)}</span>,
    },
    {
      title: "",
      width: "10%",
      key: "ID",
      render: (text) => <span className="cbtn">Details</span>,
    },
  ];
  useEffect(() => {
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
        <Button className="claim">Claim Rewards</Button>
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
      <Table
        className="reward-list"
        columns={columns}
        list={[]}
        empty={<span>No Item yet</span>}
        loading={loading}
      />
      {total > 10 && (
        <Pager
          current={current}
          total={total}
          pageSize={10}
          onChange={onPageChange}
        />
      )}
    </div>
  );
}

export default styled(Rewards)`
  color: white;
  width: 1200px;
  margin: 10px auto;
  min-height: calc(100vh - 162px);
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
  .reward-list {
    margin-top: 20px;
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
