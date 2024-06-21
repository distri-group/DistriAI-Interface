import { Button, Stack, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Table from "@/components/Table.jsx";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Pager from "./Pager";
import { getRewardList, getClaimableReward } from "@/services/reward.js";
import { LoadingButton } from "@mui/lab";
import useSolanaMethod from "@/utils/useSolanaMethod.js";
import ConnectToWallet from "./ConnectToWallet";
import { formatBalance } from "@/utils";
import { getModelRewardList } from "../services/model-reward";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getRewardDetail } from "../services/reward";

function RewardList({
  className,
  onMachineRewardChange,
  modelRewardClaimable,
}) {
  const { wallet, methods } = useSolanaMethod();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [type, setType] = useState("machine");
  const [machineRewardList, setMachineRewardList] = useState([]);
  const [modelRewardList, setModelRewardList] = useState([]);
  const list = useMemo(
    () => (type === "model" ? modelRewardList : machineRewardList),
    [type, modelRewardList, machineRewardList]
  );
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [connectModal, setConnectModal] = useState(false);
  const unclaimable = useMemo(
    () => (type === "model" && !modelRewardClaimable) || !wallet?.publicKey,
    [type, wallet, modelRewardClaimable]
  );
  const machineRewardInfo = useMemo(() => {
    if (
      machineRewardList.length > 0 &&
      modelRewardList.length > 0 &&
      machineRewardList[0].Period === modelRewardList[0].Period
    ) {
      return {
        ...machineRewardList[0],
      };
    }
    return {
      Period: 0,
      PeriodicRewards: 0,
      Pool: 0,
      StartTime: new Date(),
      MachineNum: 0,
    };
  }, [machineRewardList, modelRewardList]);
  useEffect(() => {
    const handleNewInfo = async () => {
      let newInfo = { ...machineRewardInfo };
      if (machineRewardInfo.Period > 0) {
        try {
          const res = await getRewardDetail(machineRewardInfo.Period);
          newInfo.MachineNum = res.MachineNum;
        } catch (error) {
          enqueueSnackbar(error.message, { variant: "error" });
        }
      }
      onMachineRewardChange(newInfo);
    };
    handleNewInfo();
    // eslint-disable-next-line
  }, [machineRewardInfo]);
  async function loadList() {
    setLoading(true);
    try {
      const res = await getRewardList(current, 10, wallet.publicKey.toString());
      setMachineRewardList(res.List);
      setTotal(res.Total);
    } catch (e) {
      enqueueSnackbar(e.message, { variant: "error" });
    }
    setLoading(false);
  }
  async function loadModelRewardList() {
    setLoading(true);
    try {
      const res = await getModelRewardList(
        current,
        10,
        wallet.publicKey.toString()
      );
      setModelRewardList(res.List);
      setTotal(res.Total);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setLoading(false);
  }
  async function getClaimableList() {
    const res = await getClaimableReward(
      null,
      1,
      5,
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
  const claimModelRewards = async () => {
    if (!wallet?.publicKey) return setConnectModal(true);
    setClaiming(true);
    try {
      await methods.claimModelDatasetRewards(wallet.publicKey);
      enqueueSnackbar("Claim model rewards success.", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };
  const handleNavigate = (period) => {
    if (type === "model") navigate(`/reward/model/${period}`);
    else navigate(`/reward/${period}`);
  };
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
          <span>{formatBalance(text)}</span>
        </Stack>
      ),
    },
    {
      title: "Rewards",
      width: "15%",
      key: "PeriodicRewards",
      render: (text, record) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <span className="dist" />
          <span>
            {type === "machine"
              ? formatBalance(text)
              : formatBalance(record.PeriodicReward)}
          </span>
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
          onClick={() => handleNavigate(record.Period)}>
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
      if (type === "model") {
        loadModelRewardList();
      } else {
        loadList();
      }
    }
    // eslint-disable-next-line
  }, [wallet?.publicKey, current, type]);
  useEffect(() => {
    if (current !== 1) {
      setCurrent(1);
    }
    // eslint-disable-next-line
  }, [type]);
  useEffect(() => {
    if (wallet?.publicKey) {
      loadModelRewardList();
      loadList();
    }
    // eslint-disable-next-line
  }, [wallet?.publicKey]);
  return (
    <div className={className}>
      <Stack
        direction="row"
        justifyContent="space-between"
        className="type-toggle">
        <ToggleButtonGroup
          disabled={loading}
          value={type}
          exclusive
          onChange={(e, value) => setType(value)}>
          <ToggleButton value="machine">Machine</ToggleButton>
          <ToggleButton value="model">Model & Dataset</ToggleButton>
        </ToggleButtonGroup>
        <LoadingButton
          loading={claiming}
          disabled={unclaimable}
          onClick={() =>
            type === "model" ? claimModelRewards() : claimButchRewards()
          }
          className={`cbtn${unclaimable ? " disabled" : ""}`}
          style={{ width: 100 }}>
          {!claiming && <span>Claim All</span>}
        </LoadingButton>
      </Stack>
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
          onChange={(page) => setCurrent(page)}
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
  .type-toggle {
    background: rgba(149, 157, 165, 0.16);
    padding: 24px 40px;
    border-top-right-radius: 12px;
  }
  .disabled {
    background: rgba(70, 70, 70, 1);
  }
`;
