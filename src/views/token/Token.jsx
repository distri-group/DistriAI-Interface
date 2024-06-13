import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import EarningList from "@/components/EarningList.jsx";
import RewardList from "@/components/RewardList.jsx";
import Round from "@/components/Round";

function Token({ className }) {
  const [type, setType] = useState("reward");
  const list = [
    {
      addr: "cXfg2SYcq85nyZ1U4ccx6…hXY",
      token: 1000.23,
    },
    {
      addr: "cXfg2SYcq85nyZ1U4ccx6…hXY",
      token: 1000.23,
    },
    {
      addr: "cXfg2SYcq85nyZ1U4ccx6…hXY",
      token: 1000.23,
    },
    {
      addr: "cXfg2SYcq85nyZ1U4ccx6…hXY",
      token: 1000.23,
    },
    {
      addr: "cXfg2SYcq85nyZ1U4ccx6…hXY",
      token: 1000.23,
    },
    {
      addr: "cXfg2SYcq85nyZ1U4ccx6…hXY",
      token: 1000.23,
    },
    {
      addr: "cXfg2SYcq85nyZ1U4ccx6…hXY",
      token: 1000.23,
    },
    {
      addr: "cXfg2SYcq85nyZ1U4ccx6…hXY",
      token: 1000.23,
    },
    {
      addr: "cXfg2SYcq85nyZ1U4ccx6…hXY",
      token: 1000.23,
    },
    {
      addr: "cXfg2SYcq85nyZ1U4ccx6…hXY",
      token: 1000.23,
    },
  ];
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
                <span>50000</span>
                <label>DIST</label>
              </Stack>
              <label style={{ color: "white" }}>Total output</label>
            </Stack>
            <Stack justifyContent="end">
              <span>499.44</span>
              <label>My rewards</label>
            </Stack>
            <Stack justifyContent="end">
              <span>499.4</span>
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
                <span>499.44</span>
                <label>DIST</label>
              </Stack>
              <label style={{ color: "white" }}>Total circulation</label>
            </Stack>
            <Stack justifyContent="end">
              <span>499.44</span>
              <label>My earnings</label>
            </Stack>
            <Stack justifyContent="end">
              <span>342</span>
              <label>My locked earnings</label>
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
          <h2>The 3rd period</h2>
          <label>2024/06/06</label>
          <Stack direction="row" spacing={8} style={{ marginTop: 40 }}>
            <Round
              left={{
                total: 400,
                title: "My rewards",
              }}
              right={{
                title: "My Ranking",
                total: 40000,
                desc: "Contribution reward pool",
              }}
            />
            <Stack justifyContent="space-around">
              <span>
                <b>300</b>resources were shared
              </span>
              <span>
                <b>40000</b>DIST were found
              </span>
              <span>
                My rewards<b style={{ marginLeft: 12 }}>400</b>DIST
              </span>
            </Stack>
          </Stack>
          <Stack direction="row" style={{ marginTop: 64 }} spacing={8}>
            <Round
              left={{
                total: 100,
                title: "My earnings",
              }}
              right={{
                title: "Earnings",
                total: 40000,
                desc: "Contribution of tokens",
              }}
            />
            <Stack justifyContent="space-around">
              <span>
                <b>300</b>deals closed
              </span>
              <span>
                <b>1000</b>DIST were circulated
              </span>
              <span>
                My earnings<b style={{ marginLeft: 12 }}>400</b>DIST
              </span>
            </Stack>
          </Stack>
        </div>
        <div className="border-box">
          <h2>Top 100 tokens acquired</h2>
          <label>
            Show the top 100 people with the most tokens, and the data is
            updated daily
          </label>
          <TableContainer>
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
                    <TableCell style={{ width: 187, boxSizing: "border-box" }}>
                      NO.{index + 1}
                    </TableCell>
                    <TableCell>{item.addr}</TableCell>
                    <TableCell>{item.token}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <h2 style={{ marginTop: 56 }}>My Ranking</h2>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: 187, boxSizing: "border-box" }}>
                    Unranked
                  </TableCell>
                  <TableCell>cXfg2SYcq85nyZ1U4ccx6…hXY</TableCell>
                  <TableCell>1000.23</TableCell>
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
              <RewardList />
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
