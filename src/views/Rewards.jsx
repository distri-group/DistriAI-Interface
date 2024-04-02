import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Table from "../components/Table";
import moment from "moment";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Pager from "../components/pager";
import {
  getRewardList,
  getRewardTotal,
  getClaimableReward,
} from "../services/reward";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import SolanaAction from "../components/SolanaAction";
import { LoadingButton } from "@mui/lab";

function Rewards({ className }) {
  document.title = "My Rewards";
  const wallet = useAnchorWallet();
  const childRef = useRef();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [rewards, setRewards] = useState(null);
  const loadList = async (curr) => {
    setLoading(true);
    try {
      const res = await getRewardList(curr, 10, wallet.publicKey.toString());
      setLoading(false);
      if (!res) {
        return enqueueSnackbar("Reward List Not Found", { variant: "error" });
      }
      setList(res.List);
      setTotal(res.Total);
    } catch (e) {
      return enqueueSnackbar(e.message, { variant: "error" });
    }
  };
  const getClaimableList = async () => {
    const res = await getClaimableReward(
      null,
      1,
      10,
      wallet.publicKey.toString()
    );
    if (res) {
      let claimableList = [];
      let total = 0;
      for (let item of res.List) {
        if (item.Period) {
          claimableList.push(item);
          total += item.PeriodicRewards;
        }
      }
      return { claimableList, total };
    }
  };
  const claimButchRewards = async () => {
    setClaiming(true);
    const { rewards, total } = await getClaimableList();
    const res = await childRef.current.claimRewards(rewards);
    setTimeout(() => {
      if (res?.msg === "ok") {
        enqueueSnackbar(
          `Successfully claimed ${(total / LAMPORTS_PER_SOL).toFixed(2)} DIST`,
          {
            variant: "success",
          }
        );
      } else {
        enqueueSnackbar(res.msg, { variant: "error" });
      }
      setClaiming(false);
    }, 300);
  };
  const getTotal = async () => {
    try {
      const res = await getRewardTotal(0, wallet.publicKey.toString());
      if (res) {
        setRewards(res);
        return null;
      }
      return enqueueSnackbar("Failed fetching total rewards", {
        variant: "error",
      });
    } catch (e) {
      return enqueueSnackbar(e.message, { variant: "error" });
    }
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
      render: (text) => (
        <span style={{ display: "block", width: "80%", textAlign: "center" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Start",
      width: "10%",
      key: "StartTime",
      render: (text) => {
        return (
          <div className="time">
            <div className="y">{moment(text).format("YYYY.MM.DD")}</div>
            <div className="h">{moment(text).format("HH:mm:ss")}</div>
          </div>
        );
      },
    },
    {
      title: "End",
      width: "10%",
      key: "EndTime",
      render: (text, record) => {
        return (
          <div className="time">
            <div className="y">
              {moment(
                new Date(record.StartTime).getTime() + 24 * 3600 * 1000
              ).format("YYYY.MM.DD")}
            </div>
            <div className="h">
              {moment(
                new Date(record.StartTime).getTime() + 24 * 3600 * 1000
              ).format("HH:mm:ss")}
            </div>
          </div>
        );
      },
    },
    {
      title: "Duration",
      width: "10%",
      key: "Duration",
      render: () => (
        <span style={{ display: "block", textAlign: "center" }}>24 h</span>
      ),
    },
    {
      title: "Reward pool",
      width: "10%",
      key: "Pool",
      render: (text) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span className="coin" />
          <span style={{ lineHeight: "24px" }}>
            {(text / LAMPORTS_PER_SOL).toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      title: "Rewards",
      width: "10%",
      key: "PeriodicRewards",
      render: (text) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span className="coin" />
          <span style={{ lineHeight: "24px" }}>
            {(text / LAMPORTS_PER_SOL).toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      title: "",
      width: "10%",
      key: "ID",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <span
            className="cbtn"
            onClick={() => navigate("/reward/" + record.Period)}>
            Details
          </span>
        </div>
      ),
    },
  ];
  useEffect(() => {
    if (wallet?.publicKey) {
      loadList(1);
      getTotal();
    }
    // eslint-disable-next-line
  }, [wallet?.publicKey]);
  return (
    <div className={className}>
      <SolanaAction ref={childRef} />
      <h1>My DAO Rewards</h1>
      {rewards ? (
        <>
          <div className="box">
            <div style={{ width: "400px" }}>
              <p className="describe">
                All periodic & task rewards you can currently claim.
              </p>
              <div className="volume">
                <div style={{ width: "160px" }}>
                  <span className="number">
                    {(
                      (rewards.ClaimablePeriodicRewards +
                        rewards.ClaimableTaskRewards) /
                      LAMPORTS_PER_SOL
                    ).toFixed(2)}
                  </span>
                  <span>DIST</span>
                  <p>Total Claimable</p>
                </div>
                <div className="vertical">
                  <span>
                    {(
                      rewards.ClaimablePeriodicRewards / LAMPORTS_PER_SOL
                    ).toFixed(2)}
                  </span>
                  <label>Periodic Rewards</label>
                </div>
                <div className="vertical">
                  <span>
                    {(rewards.ClaimableTaskRewards / LAMPORTS_PER_SOL).toFixed(
                      2
                    )}
                  </span>
                  <label>Task Rewards</label>
                </div>
              </div>
            </div>
            {rewards.ClaimablePeriodicRewards ||
            rewards.ClaimableTaskRewards ? (
              <LoadingButton
                onClick={claimButchRewards}
                loading={claiming}
                className="claim">
                {claiming ? "" : "Claim Rewards"}
              </LoadingButton>
            ) : (
              <Button className="claimed" disabled>
                All Claimed
              </Button>
            )}
          </div>
          <div className="box">
            <div style={{ width: "400px" }}>
              <p className="describe">
                All periodic & task rewards you have already claimed.
              </p>
              <div className="volume">
                <div style={{ width: "160px" }}>
                  <span className="number Completed">
                    {(
                      (rewards.ClaimedPeriodicRewards +
                        rewards.ClaimedTaskRewards) /
                      LAMPORTS_PER_SOL
                    ).toFixed(2)}
                  </span>
                  <span className="Completed">DIST</span>
                  <p>Total Claimed</p>
                </div>
                <div className="vertical">
                  <span>
                    {(
                      rewards.ClaimedPeriodicRewards / LAMPORTS_PER_SOL
                    ).toFixed(2)}
                  </span>
                  <label>Periodic Rewards</label>
                </div>
                <div className="vertical">
                  <span>
                    {(rewards.ClaimedTaskRewards / LAMPORTS_PER_SOL).toFixed(2)}
                  </span>
                  <label>Task Rewards</label>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="box">
            <div style={{ width: "400px" }}>
              <p className="describe">
                All periodic & task rewards you can currently claim.
              </p>
              <div className="volume">
                <div style={{ width: "160px" }}>
                  <span className="number">0</span>
                  <span>DIST</span>
                  <p>Total Claimable</p>
                </div>
                <div className="vertical">
                  <span>0</span>
                  <label>Periodic Rewards</label>
                </div>
                <div className="vertical">
                  <span>0</span>
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
                  <span className="number Completed">0</span>
                  <span className="Completed">DIST</span>
                  <p>Total Claimed</p>
                </div>
                <div className="vertical">
                  <span>0</span>
                  <label>Periodic Rewards</label>
                </div>
                <div className="vertical">
                  <span>0</span>
                  <label>Task Rewards</label>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <Table
        className="reward-list"
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
  min-height: calc(100% - 162px);
  padding: 0 20px;
  h1 {
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
  .h {
    color: #aaa;
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
  .claim,
  .claimed {
    width: 140px;
    height: 30px;
    margin-top: 48px;
  }
  .claim {
    background-color: #94d6e2;
    color: black;
  }
  .claimed {
    background-color: #333;
  }
  .reward-list {
    margin-top: 20px;
    th {
      text-align: center;
    }
    tr td {
      padding: 10px !important;
    }
    .time-box {
      padding: 10px;
      font-size: 14px;
    }
    .time {
      width: 60%;
      margin: 0 auto;
    }
    .cbtn {
      padding: 4px 16px;
      border-radius: 4px;
      cursor: pointer;
      height: 32px;
      line-height: 32px;
    }
  }
  .coin {
    display: block;
    margin-right: 5px;
    border-radius: 100%;
    background-color: white;
    background-image: url(/img/token.png);
    background-size: 70%;
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
