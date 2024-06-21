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
    TxHash: "",
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
      const { PeriodicReward, TxHash } = list.find(
        (item) => item.Owner === wallet.publicKey.toString()
      );
      setMyInfo({ Owner: wallet.publicKey.toString(), PeriodicReward, TxHash });
    }
  }, [wallet?.publicKey, list]);
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
    {
      title: "TxHash",
      width: "30%",
      key: "TxHash",
      render: (text) => (
        <a
          className="addr"
          href={`https://explorer.solana.com/tx/${text}?cluster=devnet`}
          target="_blank"
          rel="noreferrer">
          {formatAddress(text)}
        </a>
      ),
    },
  ];
  useEffect(() => {
    loadPeriodList();
  }, [current, loadPeriodList]);
  return (
    <Stack spacing={3} className={className}>
      <h2>Reward Info</h2>
      <Stack direction="row" spacing={30} className="trans-box">
        <Stack>
          <span>24h {new Date(periodInfo.StartTime).toLocaleDateString()}</span>
          <label>Duration</label>
        </Stack>
        <Stack>
          <span>{periodInfo.TotalResource}</span>
          <label>Total resources</label>
        </Stack>
        <Stack>
          <span>{formatBalance(periodInfo.Pool)}</span>
          <label>Total Reward</label>
        </Stack>
        <Stack>
          <span>{total}</span>
          <label>Total Provider</label>
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
  .trans-box {
    span {
      font-size: 24px;
      line-height: 34px;
      font-weight: 600;
    }
    label {
      color: #898989;
    }
  }
  .reward-table {
    td {
      font-size: 18px;
      line-height: 28px;
    }
    .addr {
      display: block;
      font-size: 16px;
      color: #94d6e2;
      line-height: 24px;
      margin: 12px 0 8px 0;
      text-decoration: none;
    }
  }
`;
