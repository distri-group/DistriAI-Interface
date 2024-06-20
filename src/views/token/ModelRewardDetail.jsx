import { Stack } from "@mui/material";
import Table from "@/components/Table";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  getModelRewardList,
  getModelRewardPeriodDetail,
} from "@/services/model-reward";
import { useEffect, useState, useCallback } from "react";
import Pager from "@/components/Pager";
import { formatBalance, formatAddress } from "@/utils";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

function ModelRewardDetail({ className }) {
  const { period } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const wallet = useAnchorWallet();
  const [periodInfo, setInfo] = useState({
    StartTime: 0,
    TotalResource: 0,
    Pool: 0,
  });
  const [myInfo, setMyInfo] = useState({
    Owner: "",
    PeriodicReward: 0,
  });
  const [current, setCurrent] = useState(1);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const loadPeriodList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getModelRewardList(current, 10, null, period);
      setList(res.List);
      setTotal(res.Total);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setLoading(false);
    // eslint-disable-next-line
  }, [current]);
  const getPeriodDetail = async () => {
    try {
      const res = await getModelRewardPeriodDetail(parseInt(period));
      setInfo({
        ...res,
        TotalResource: res.AiModelTotalNum + res.DatasetTotalNum,
      });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };
  useEffect(() => {
    getPeriodDetail();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (wallet?.publicKey && list.length > 0) {
      const { PeriodicReward } = list.find(
        (item) => item.Owner === wallet.publicKey.toString()
      );
      setMyInfo({ Owner: wallet.publicKey.toString(), PeriodicReward });
    }
  }, [wallet?.publicKey]);
  const columns = [
    {
      title: "Provider",
      width: "34%",
      key: "Owner",
      render: (text) => formatAddress(text),
    },
    {
      title: "Rewards",
      width: "34%",
      key: "PeriodicReward",
      render: (text) => formatBalance(text),
    },
  ];
  useEffect(() => {
    loadPeriodList();
  }, [current, loadPeriodList]);
  return (
    <Stack spacing={3} className={className}>
      <h2>Reward Info</h2>
      <Stack spacing={1}>
        <Stack direction="row">
          <label>Duration</label>
          <span>24h {new Date(periodInfo.StartTime).toLocaleDateString()}</span>
        </Stack>
        <Stack direction="row">
          <label>Total resources</label>
          <span>{periodInfo.TotalResource}</span>
        </Stack>
        <Stack direction="row">
          <label>Total Reward</label>
          <span>{formatBalance(periodInfo.Pool)}</span>
        </Stack>
        <Stack direction="row">
          <label>Total Provider</label>
          <span>{total}</span>
        </Stack>
      </Stack>
      <h2>My Reward Info</h2>
      <Table
        className="reward-table"
        columns={columns}
        list={[myInfo]}
        empty={<span>No Item yet</span>}
        loading={loading}
      />
      <h2>All Rewards Info</h2>
      <Table
        className="reward-table"
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
    </Stack>
  );
}
export default styled(ModelRewardDetail)`
  label {
    display: block;
    width: 320px;
    color: #898989;
  }
  .reward-table {
    td {
      font-size: 18px;
      line-height: 28px;
    }
  }
`;
