import { Button, Stack, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Table from "@/components/Table.jsx";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Pager from "./Pager";
import {
  getRewardList,
  getRewardTotal,
  getClaimableReward,
} from "@/services/reward.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { LoadingButton } from "@mui/lab";
import useSolanaMethod from "@/utils/useSolanaMethod.js";
import ConnectToWallet from "./ConnectToWallet";

function RewardList({ className }) {
  const { wallet, methods } = useSolanaMethod();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [rewards, setRewards] = useState(null);
  const [connectModal, setConnectModal] = useState(false);
  const claimed = useMemo(() => {
    if (rewards?.totalClaimable) {
      return rewards.totalClaimable <= 0;
    }
  }, [rewards]);

  async function loadList(curr) {
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
  }
  async function getClaimableList() {
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
  }
  async function claimButchRewards() {
    if (!wallet?.publicKey) return setConnectModal(true);
    setClaiming(true);
    const { claimableList, total } = await getClaimableList();
    if (claimableList.length === 0) {
      enqueueSnackbar("No claimable node.", { variant: "info" });
    } else {
      try {
        await methods.claimButchRewards(claimableList);
        enqueueSnackbar(`Claim ${total / LAMPORTS_PER_SOL} DIST success.`, {
          variant: "success",
        });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    }
    setClaiming(false);
  }
  async function getTotal() {
    try {
      const res = await getRewardTotal(null, wallet.publicKey.toString());
      setRewards(res);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  }
  function onPageChange(curr) {
    setCurrent(curr);
    loadList(curr);
  }
  const columns = [
    {
      title: "Period",
      width: "12%",
      key: "Period",
      render: (text) => <span style={{ marginLeft: 25 }}>{text}</span>,
    },
    {
      title: "Start",
      width: "15%",
      key: "StartTime",
      render: (text) => (
        <span className="time">
          {moment(text).format("YYYY.MM.DD")} {moment(text).format("HH:mm:ss")}
        </span>
      ),
    },
    {
      title: "Duration",
      width: "10%",
      key: "Duration",
      render: () => <span style={{ marginLeft: 25 }}>24 h</span>,
    },
    {
      title: "Reward pool",
      width: "15%",
      key: "Pool",
      render: (text) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <span className="dist" />
          <span>{(text / LAMPORTS_PER_SOL).toFixed(2)}</span>
        </Stack>
      ),
    },
    {
      title: "Rewards",
      width: "15%",
      key: "PeriodicRewards",
      render: (text) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <span className="dist" />
          <span>{(text / LAMPORTS_PER_SOL).toFixed(2)}</span>
        </Stack>
      ),
    },
    {
      title: "Controls",
      width: "5%",
      key: "ID",
      render: (text, record) => (
        <Button
          className="cbtn"
          style={{ width: 100, height: 32 }}
          onClick={() => navigate(`/reward/${record.Period}`)}>
          <span
            style={{
              fontWeight: 500,
              fontSize: 16,
              lineHeight: "22px",
            }}>
            Detail
          </span>
        </Button>
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
      {/* <h1>My DAO Rewards</h1>
      <Stack direction="row" spacing={5}>
        <div className="box">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="describe">
            <label>All periodic & task rewards you can currently claim</label>
            <LoadingButton
              loading={claiming}
              disabled={claimed}
              onClick={claimButchRewards}
              className="cbtn"
              style={{ width: 140 }}>
              <span
                style={{
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: "22px",
                }}>
                {claiming ? (
                  <span></span>
                ) : claimed ? (
                  <span>All Claimed</span>
                ) : (
                  <span>Claim Rewards</span>
                )}
              </span>
            </LoadingButton>
          </Stack>
          <Grid container className="rewards">
            <Grid item md={4}>
              <Stack spacing={1}>
                <span className="total">
                  {rewards?.totalClaimable || 0}
                  <span className="union">DIST</span>
                </span>
                <label style={{ color: "white" }}>Received</label>
              </Stack>
            </Grid>
            <Grid item md={3}>
              <Stack spacing={1}>
                <span className="part">
                  {rewards?.ClaimablePeriodicRewards || 0}
                </span>
                <label>Periodic Rewards</label>
              </Stack>
            </Grid>
            <Grid item md={3}>
              <Stack spacing={1}>
                <span className="part">
                  {rewards?.ClaimableTaskRewards || 0}
                </span>
                <label>Task Rewards</label>
              </Stack>
            </Grid>
          </Grid>
        </div>
        <div className="box">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="describe">
            <label>All periodic & task rewards you have already claimed</label>
          </Stack>
          <Grid container className="rewards">
            <Grid item md={4}>
              <Stack spacing={1}>
                <span className="total">
                  {rewards?.totalClaimed || 0}
                  <span className="union">DIST</span>
                </span>
                <label style={{ color: "white" }}>Total Claimed</label>
              </Stack>
            </Grid>
            <Grid item md={3}>
              <Stack spacing={1}>
                <span className="part">
                  {rewards?.ClaimedPeriodicRewards || 0}
                </span>
                <label>Periodic Rewards</label>
              </Stack>
            </Grid>
            <Grid item md={3}>
              <Stack spacing={1}>
                <span className="part">{rewards?.ClaimedTaskRewards || 0}</span>
                <label>Task Rewards</label>
              </Stack>
            </Grid>
          </Grid>
        </div>
      </Stack> */}
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
      <ConnectToWallet
        open={connectModal}
        onClose={() => setConnectModal(false)}
      />
    </div>
  );
}

export default styled(RewardList)`
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
  .container {
    display: flex;
    justify-content: space-between;
  }
  .h {
    color: #aaa;
  }
  .box {
    width: 780px;
    height: 120px;
    padding: 40px;
    background: rgba(149, 157, 165, 0.16);
    border-radius: 12px;
    label {
      font-weight: 400;
      font-size: 18px;
      color: #959da5;
      line-height: 26px;
    }
    .describe {
      height: 48px;
    }
    .rewards {
      label {
        font-weight: 500;
      }
      .total {
        font-weight: 600;
        font-size: 32px;
        line-height: 44px;
        .union {
          font-weight: 400;
          font-size: 18px;
          line-height: 26px;
          padding-left: 8px;
        }
      }
      .part {
        font-size: 20px;
        line-height: 44px;
      }
    }
  }
  .reward-list {
    span {
      font-size: 18px;
      line-height: 26px;
    }
  }
`;
