import styled from "styled-components";
import { useParams } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import {
  getClaimableReward,
  getPeriodMachine,
  getRewardTotal,
} from "@/services/reward.js";
import { useSnackbar } from "notistack";
import { Button, CircularProgress, Popover, Grid, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import DeviceCard from "@/components/DeviceCard.jsx";
import useSolanaMethod from "@/utils/useSolanaMethod.js";

function RewardDetail({ className }) {
  const { period } = useParams();
  document.title = "Order detail";
  const [periodInfo, setPeriodInfo] = useState({});
  const [machineList, setMachineList] = useState();
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const claimed = useMemo(() => {
    if (total?.totalClaimable) {
      return total.totalClaimable <= 0;
    }
  }, [total]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { wallet, methods } = useSolanaMethod();
  const { enqueueSnackbar } = useSnackbar();
  async function getClaimableList() {
    const res = await getClaimableReward(
      Number(period),
      1,
      10,
      wallet.publicKey.toString()
    );
    if (res) {
      let claimableList = [];
      let total = 0;
      for (let item of res.List) {
        if (item.Period === Number(period)) {
          claimableList.push(item);
          total += item.PeriodicRewards;
        }
      }
      return { claimableList, total };
    }
  }
  async function claimButchRewards() {
    setClaiming(true);
    const { claimableList, total } = await getClaimableList();
    try {
      await methods.claimButchRewards(claimableList);
      enqueueSnackbar(`Claim ${total / LAMPORTS_PER_SOL} DIST success.`, {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setClaiming(false);
  }
  useEffect(() => {
    async function loadDetail() {
      const machines = await getPeriodMachine(
        Number(period),
        1,
        10,
        wallet.publicKey.toString()
      );
      if (machines) {
        setMachineList(machines.List);
        setPeriodInfo({
          StartTime: machines.List[0].StartTime,
          Pool: machines.List[0].Pool,
          ParticipatingNodes: machines.List[0].MachineNum,
        });
      }
      const total = await getRewardTotal(
        Number(period),
        wallet.publicKey.toString()
      );
      if (total) {
        setTotal(total);
      }
      setLoading(false);
    }
    if (wallet?.publicKey) {
      loadDetail();
    }
    // eslint-disable-next-line
  }, [period, wallet]);
  return (
    <div className={className}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <h1>Period {period}</h1>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="total">
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="end">
                <span>{total.totalClaimable}</span>
                <label>DIST</label>
              </Stack>
              <Stack direction="row" spacing={1}>
                <label>Total Rewards</label>
                <span
                  className="tip"
                  aria-owns={open ? "mouse-over-popover" : undefined}
                  aria-haspopup="true"
                  onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
                  onMouseLeave={() => setAnchorEl(null)}></span>
                <Popover
                  id="mouse-over-popover"
                  sx={{
                    pointerEvents: "none",
                    width: "50%",
                  }}
                  open={open}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  slotProps={{
                    paper: {
                      style: {
                        backgroundColor: "#d7d7d7",
                      },
                    },
                  }}
                  onClose={() => setAnchorEl(null)}
                  disableRestoreFocus>
                  <h3 style={{ textAlign: "center", margin: "4px 0" }}>
                    Reward for each computing node :
                  </h3>
                  <p style={{ margin: "8px 0" }}>
                    (Reward Pool * 50%)+(Reward Pool * 50% * Device evaluation
                    ratio) / Participating Nodes
                  </p>
                  <p style={{ margin: "8px 0" }}>
                    Device evaluation ratio (see Docs for detailed evaluation
                    rules) : High(100%)、Medium(75%)、Low(50%)
                  </p>
                </Popover>
              </Stack>
            </Stack>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="end">
                <span>{total.ClaimedPeriodicRewards}</span>
                <label>DIST</label>
              </Stack>
              <label>Claimed</label>
            </Stack>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="end">
                <span>{total.ClaimablePeriodicRewards}</span>
                <label>DIST</label>
              </Stack>
              <label>Claimable</label>
            </Stack>
            <div>
              <LoadingButton
                className="cbtn"
                style={{ width: 140 }}
                loading={claiming}
                onClick={claimButchRewards}>
                {claiming ? "" : claimed ? "All Claimed" : "Claim Rewards"}
              </LoadingButton>
            </div>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            style={{ marginTop: 40 }}>
            <Stack spacing={2} className="info">
              <Stack direction="row" justifyContent="space-between">
                <label>Start time</label>
                <span>{new Date(periodInfo.StartTime).toLocaleString()}</span>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <label>End time</label>
                <span>
                  {new Date(
                    new Date(periodInfo.StartTime).getTime() + 24 * 3600 * 1000
                  ).toLocaleString()}
                </span>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <label>Duration</label>
                <span>24 h</span>
              </Stack>
            </Stack>
            <Stack spacing={2} className="info">
              <Stack direction="row" justifyContent="space-between">
                <label>Reward Pool</label>
                <span>
                  {(periodInfo.Pool / LAMPORTS_PER_SOL).toFixed(2)} DIST
                </span>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <label>Participating Nodes</label>
                <span>{periodInfo.ParticipatingNodes}</span>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <label>My Nodes</label>
                <span>{machineList.length}</span>
              </Stack>
            </Stack>
          </Stack>
          <h2>Nodes Info</h2>
          <hr />
          {machineList.map((device) => (
            <>
              <DeviceCard key={device.Uuid} device={device} />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                className="total"
                style={{ margin: "0 40px 40px 40px" }}>
                <label>Rewards</label>
                <Stack spacing={1}>
                  <span>{device.PeriodicRewards}</span>
                  <label style={{ textAlign: "right" }}>DIST</label>
                </Stack>
              </Stack>
            </>
          ))}
        </>
      )}
    </div>
  );
}

export default styled(RewardDetail)`
  h1 {
    font-weight: 600;
    font-size: 32px;
    line-height: 44px;
  }
  .total {
    padding: 40px;
    background: rgba(149, 157, 165, 0.16);
    border-radius: 12px;
    span {
      font-weight: 600;
      font-size: 32px;
      line-height: 44px;
    }
    label {
      font-size: 18px;
      line-height: 26px;
    }
  }
  .info {
    width: 700px;
    padding: 24px 40px;
    border: 1px solid #898989;
    border-radius: 12px;
    span {
      font-weight: 500;
      font-size: 18px;
      line-height: 26px;
    }
    label {
      font-size: 18px;
      color: #898989;
      line-height: 26px;
    }
  }
`;
