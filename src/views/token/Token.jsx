import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  CircularProgress,
  Skeleton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import EarningList from "@/components/EarningList.jsx";
import RewardList from "@/components/RewardList.jsx";
import Round from "@/components/Round";
import { useProgram } from "@/KeepAliveLayout";
import { formatAddress, getOrdinal, formatBalance } from "@/utils";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useSnackbar } from "notistack";
import { getModelRewardDetail } from "@/services/model-reward";
import { getModelRewardPeriodDetail } from "../../services/model-reward";

function Token({ className }) {
  const [type, setType] = useState("reward");
  const [list, setList] = useState([]);
  const program = useProgram();
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  const [rankLoading, setRankLoading] = useState(false);
  const [boardLoading, setBoardLoading] = useState(true);
  const [myRank, setMyRank] = useState({
    rank: 0,
    owner: "",
    total: 0,
  });
  const [rewardTotal, setRewardTotal] = useState({
    mine: 0,
    total: 0,
    unclaimed: 0,
  });
  const [earningTotal, setEarningTotal] = useState({
    mine: 0,
    total: 0,
  });
  const [machineReward, setMachineReward] = useState({
    Period: 0,
    PeriodicRewards: 0,
    Pool: 0,
    StartTime: new Date(),
  });
  const [modelReward, setModelReward] = useState({
    Period: 0,
    PeriodicRewards: 0,
    Pool: 0,
    StartTime: 0,
    ResourceNum: 0,
  });
  const handleMachineRewardChange = (info) => setMachineReward(info);
  const getStaticUserList = async () => {
    setRankLoading(true);
    try {
      const res = await program.account.statistics.all();
      let list = res.map((item) => {
        const {
          aiModelDatasetEarning,
          aiModelDatasetRewardClaimable,
          aiModelDatasetRewardClaimed,
          machineEarning,
          machineRewardClaimable,
          machineRewardClaimed,
        } = item.account;
        const claimableReward = formatBalance(
          aiModelDatasetRewardClaimable.toNumber() +
            machineRewardClaimable.toNumber()
        );
        const rewardTotal =
          claimableReward +
          formatBalance(
            aiModelDatasetRewardClaimed.toNumber() +
              machineRewardClaimed.toNumber()
          );
        const earningTotal = formatBalance(
          aiModelDatasetEarning.toNumber() + machineEarning.toNumber()
        );
        return {
          owner: formatAddress(item.account.owner.toString()),
          claimableReward,
          rewardTotal,
          earningTotal,
          total: rewardTotal + earningTotal,
        };
      });
      list = list.sort((a, b) => b.total - a.total);
      setRewardTotal((prev) => ({
        ...prev,
        total: list.reduce((acc, cur) => acc + cur.rewardTotal, 0),
      }));
      setEarningTotal((prev) => ({
        ...prev,
        total: list.reduce((acc, cur) => acc + cur.earningTotal, 0),
      }));
      setList(list);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setRankLoading(false);
  };
  const getModelPeriodicReward = async () => {
    setBoardLoading(true);
    try {
      const res = await getModelRewardPeriodDetail();
      const myModelReward = await getModelRewardDetail(
        res.Period,
        wallet.publicKey.toString()
      );
      setModelReward((prev) => ({
        ...res,
        PeriodicRewards: formatBalance(myModelReward.PeriodicReward),
        Pool: formatBalance(myModelReward.Pool),
        ResourceNum:
          myModelReward.AiModelTotalNum + myModelReward.DatasetTotalNum,
      }));
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setBoardLoading(false);
  };
  useEffect(() => {
    if (wallet?.publicKey && list.length > 0) {
      let myRankInfo = {
        rank: 0,
        owner: wallet.publicKey.toString(),
        total: 0,
      };
      for (let i = 0; i < list.length; i++) {
        if (list[i].owner === formatAddress(wallet.publicKey.toString())) {
          myRankInfo.rank = i <= 9 ? i + 1 : 0;
          myRankInfo.total = list[i].total;
          setRewardTotal((prev) => ({
            ...prev,
            mine: list[i].rewardTotal,
            unclaimed: list[i].claimableReward,
          }));
          setEarningTotal((prev) => ({ ...prev, mine: list[i].earningTotal }));
          break;
        }
      }
      setMyRank(myRankInfo);
    }
  }, [list, wallet?.publicKey]);
  useEffect(() => {
    if (program) {
      getStaticUserList();
      getModelPeriodicReward();
    }
    // eslint-disable-next-line
  }, [program]);
  return (
    <Stack className={className}>
      <h1>Token</h1>
      <Stack className="trans-box">
        <h2>Tokenomics</h2>
        <label>
          Tokens are the key to a circular economy. Contributing resources is
          rewarded with tokens that developers can use to purchase the desired
          resources to
          <br />
          train their models. Of course, you also earn tokens when the resources
          you contribute are used by others.
        </label>
        <Stack
          direction="row"
          justifyContent="space-between"
          style={{ marginTop: 32 }}>
          <Stack direction="row" spacing={10}>
            <Stack>
              <Stack
                className="union"
                direction="row"
                spacing={1}
                alignItems="end">
                <span>{rewardTotal.total.toFixed(2)}</span>
                <label>DIST</label>
              </Stack>
              <label style={{ color: "white" }}>Total output</label>
            </Stack>
            <Stack justifyContent="end">
              <span>{rewardTotal.mine}</span>
              <label>My rewards</label>
            </Stack>
            <Stack justifyContent="end">
              <span>{rewardTotal.unclaimed}</span>
              <label>My unclaimed rewards</label>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={10}>
            <Stack>
              <Stack
                className="union"
                direction="row"
                spacing={1}
                alignItems="end">
                <span>{earningTotal.total}</span>
                <label>DIST</label>
              </Stack>
              <label style={{ color: "white" }}>Total circulation</label>
            </Stack>
            <Stack justifyContent="end">
              <span>{earningTotal.mine}</span>
              <label>My earnings</label>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        style={{
          marginTop: 40,
        }}>
        <div className="border-box">
          {boardLoading ? (
            <>
              <Skeleton
                variant="text"
                sx={{ fontSize: "28px", lineHeight: "38px" }}
              />
              <Skeleton
                variant="rectangular"
                sx={{
                  width: 100,
                  height: 28,
                  margin: "16px 0",
                }}
              />
              <Stack spacing={2}>
                <Skeleton
                  variant="rounded"
                  sx={{ width: "100%", height: 320 }}
                />
                <Skeleton
                  variant="rounded"
                  sx={{ width: "100%", height: 320 }}
                />
              </Stack>
            </>
          ) : (
            <>
              <h2>The {getOrdinal(modelReward.Period)} period</h2>
              <label>
                {new Date(modelReward.StartTime).toLocaleDateString()}
              </label>
              <h3>Machine Rewards</h3>
              <Stack direction="row" spacing={8} style={{ marginTop: 24 }}>
                <Round
                  left={{
                    total: machineReward.PeriodicRewards,
                    title: "My rewards",
                  }}
                  right={{
                    title: "My Ranking",
                    total: machineReward.Pool,
                    desc: "Contribution reward pool",
                  }}
                />
                <Stack justifyContent="space-around">
                  <span>
                    <b>{0}</b>nodes were shared
                  </span>
                  <span>
                    <b>{machineReward.Pool}</b>DIST were found
                  </span>
                  <span>
                    My rewards
                    <b style={{ marginLeft: 12 }}>
                      {machineReward.PeriodicRewards}
                    </b>
                    DIST
                  </span>
                </Stack>
              </Stack>
              <h3 style={{ margin: "24px 0" }}>Model & Dataset Rewards</h3>
              <Stack direction="row" spacing={8}>
                <Round
                  left={{
                    total: modelReward.PeriodicRewards,
                    title: "My rewards",
                  }}
                  right={{
                    title: "My Ranking",
                    total: modelReward.Pool,
                    desc: "Contribution reward pool",
                  }}
                />
                <Stack justifyContent="space-around">
                  <span>
                    <b>{modelReward.ResourceNum}</b>resources were shared
                  </span>
                  <span>
                    <b>{modelReward.Pool}</b>DIST were found
                  </span>
                  <span>
                    My rewards
                    <b style={{ marginLeft: 12 }}>
                      {modelReward.PeriodicRewards}
                    </b>
                    DIST
                  </span>
                </Stack>
              </Stack>
            </>
          )}
        </div>
        <div className="border-box">
          <h2>Top 10 tokens acquired</h2>
          <label>
            Show the top 10 people with the most tokens, and the data is updated
            daily
          </label>
          <TableContainer style={{ height: 550 }}>
            {rankLoading ? (
              <Stack
                style={{ width: "100%", height: "100%" }}
                justifyContent="center"
                alignItems="center">
                <CircularProgress />
              </Stack>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: 187, boxSizing: "border-box" }}>
                      Ranking
                    </TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Tokens</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell
                        style={{ width: 187, boxSizing: "border-box" }}>
                        NO.{index + 1}
                      </TableCell>
                      <TableCell
                        style={{ width: 370, boxSizing: "border-box" }}>
                        {item.owner}
                      </TableCell>
                      <TableCell>{item.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
          <h2 style={{ marginTop: 56 }}>My Ranking</h2>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: 187, boxSizing: "border-box" }}>
                    {myRank.rank === 0 ? "Unranked" : `NO.${myRank.rank}`}
                  </TableCell>
                  <TableCell style={{ width: 370, boxSizing: "border-box" }}>
                    {formatAddress(myRank.owner)}
                  </TableCell>
                  <TableCell>{myRank.total}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Stack>
      <div style={{ marginTop: 40 }}>
        <TabContext value={type}>
          <TabList
            onChange={(e, value) => setType(value)}
            TabIndicatorProps={{
              style: { display: "none" },
            }}>
            <Tab className="tab-item" label="Rewards" value="reward" />
            <Tab className="tab-item" label="Earnings" value="earning" />
          </TabList>
          <div>
            <TabPanel value="reward">
              <RewardList onMachineRewardChange={handleMachineRewardChange} />
            </TabPanel>
            <TabPanel value="earning">
              <EarningList />
            </TabPanel>
          </div>
        </TabContext>
      </div>
    </Stack>
  );
}
export default styled(Token)`
  h2 {
    margin: 0;
    margin-bottom: 16px;
    font-size: 28px;
    line-height: 38px;
  }
  h3 {
    text-align: center;
    font-size: 24px;
    line-height: 32px;
  }
  label {
    color: #959d9a;
    font-size: 18px;
    line-height: 32px;
  }
  .trans-box {
    height: 325px;
    span {
      font-weight: 600;
      font-size: 20px;
      line-height: 28px;
    }
    .union {
      span {
        font-weight: 600;
        font-size: 32px;
        line-height: 44px;
      }
      label {
        color: white;
      }
    }
  }
  .border-box {
    width: 780px;
    height: 850px;
    box-sizing: border-box;
    padding: 40px;
    border: 1px solid #898989;
    border-radius: 12px;
    th {
      font-size: 18px;
      color: #898989;
      line-height: 26px;
      padding: 12px;
      border-bottom: none;
    }
    td {
      font-weight: 500;
      font-size: 18px;
      color: white;
      line-height: 26px;
      padding: 12px;
      border-bottom: none;
    }
    span {
      font-size: 18px;
      line-height: 26px;
      b {
        font-size: 32px;
        line-height: 44px;
        margin-right: 12px;
      }
    }
    .round {
      width: 280px;
      height: 280px;
      border: 1px solid white;
      border-radius: 50%;
    }
  }
  .tab-item {
    width: 240px;
    height: 64px;
    border-radius: 12px 12px 0px 0px;
    color: white;
  }
  .Mui-selected {
    &.tab-item {
      background: rgba(149, 157, 165, 0.16);
    }
  }
`;
