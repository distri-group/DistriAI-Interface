import styled from "styled-components";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  getClaimableReward,
  getPeriodMachine,
  getRewardTotal,
} from "@/services/reward.js";
import { useSnackbar } from "notistack";
import { Button, CircularProgress, Popover } from "@mui/material";
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
      <div className="con">
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <h1>Period {period}</h1>
            <div className="box">
              <div className="box-item" style={{ width: "150px" }}>
                <div className="price">
                  <span className="number">
                    {(
                      (total.ClaimablePeriodicRewards +
                        total.ClaimedPeriodicRewards) /
                      LAMPORTS_PER_SOL
                    ).toFixed(2)}
                  </span>
                  <span className="dist">DIST</span>
                </div>
                <div className="title">
                  Total Rewards{" "}
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
                </div>
              </div>
              <div className="box-item" style={{ width: "150px" }}>
                <div className="price">
                  <span className="number">
                    {(total.ClaimedPeriodicRewards / LAMPORTS_PER_SOL).toFixed(
                      2
                    )}
                  </span>
                  <span className="dist">DIST</span>
                </div>
                <div className="title">Claimed</div>
              </div>
              <div className="box-item" style={{ width: "150px" }}>
                <div className="price">
                  <span className="number">
                    {(
                      total.ClaimablePeriodicRewards / LAMPORTS_PER_SOL
                    ).toFixed(2)}
                  </span>
                  <span className="dist">DIST</span>
                </div>
                <div className="title">Claimable</div>
              </div>
              <div className="box-item">
                {total.ClaimablePeriodicRewards ? (
                  <LoadingButton
                    loading={claiming}
                    onClick={claimButchRewards}
                    className="btn">
                    {claiming ? "" : "Claim Rewards"}
                  </LoadingButton>
                ) : (
                  <Button disabled className="btn disabled">
                    All Claimed
                  </Button>
                )}
              </div>
            </div>
            <div className="space-between">
              <div className="info-box horizontal" style={{ width: "45%" }}>
                <div className="info-box-item">
                  <label>Start time</label>
                  <span>{new Date(periodInfo.StartTime).toLocaleString()}</span>
                </div>
                <div className="info-box-item">
                  <label>End time</label>
                  <span>
                    {new Date(
                      new Date(periodInfo.StartTime).getTime() +
                        24 * 3600 * 1000
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="info-box-item">
                  <label>Duration</label>
                  <span>24 h</span>
                </div>
              </div>
              <div className="info-box horizontal" style={{ width: "45%" }}>
                <div className="info-box-item">
                  <label>Reward Pool</label>
                  <span>
                    {(periodInfo.Pool / LAMPORTS_PER_SOL).toFixed(2)} DIST
                  </span>
                </div>
                <div className="info-box-item">
                  <label>Participating Nodes</label>
                  <span>{periodInfo.ParticipatingNodes}</span>
                </div>
                <div className="info-box-item">
                  <label>My Nodes</label>
                  <span>{machineList.length}</span>
                </div>
              </div>
            </div>
            <h2>Nodes Info</h2>
            <hr />
            {machineList.map((device) => (
              <DeviceCard device={device} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default styled(RewardDetail)`
  min-height: calc(100% - 160px);
  .con {
    width: 1160px;
    margin: 10px auto;
    padding: 0 20px;
    display: block;
    overflow: hidden;
    h1 {
      font-weight: 700;
      font-style: normal;
      color: #ffffff;
      margin: 0;
      line-height: 70px;
    }
    h2 {
      margin: 12px 0;
      font-size: 16px;
    }
    .space-between {
      display: flex;
      justify-content: space-between;
    }
    .dist {
      font-size: 10px;
    }
    .tip {
      display: block;
      width: 12px;
      height: 12px;
      margin-left: 4px;
      background-image: url(/img/market/tip.svg);
      background-position: center;
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .box {
      margin: 10px 0;
      width: calc(100% - 40px);
      padding: 20px;
      background-color: rgba(34, 34, 34, 1);
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      .box-item {
        b {
          font-size: 20px;
          margin-right: 8px;
        }
        .price {
          display: flex;
          justify-content: center;
          .number {
            font-size: 16px;
            font-weight: 700;
            margin-right: 8px;
          }
        }
        .title {
          display: flex;
          justify-content: center;
          font-size: 14px;
          color: #aaa;
        }
        .btn {
          width: 140px;
          height: 30px;
          background-color: rgba(148, 214, 226, 1);
          border-radius: 5px;
          color: black;
        }
      }
    }
    .info-box {
      padding: 14px;
      background-color: black;
      border: 1px solid rgba(170, 170, 170, 1);
      border-radius: 8px;
      span,
      label {
        color: #aaa;
      }
    }
    .horizontal {
      .info-box-item {
        display: flex;
        justify-content: space-between;
      }
    }
  }
`;