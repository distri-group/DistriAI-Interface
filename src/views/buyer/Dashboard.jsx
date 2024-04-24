import styled from "styled-components";
import { TabPanel, TabContext } from "@mui/lab";
import { Box, Stack, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import MyOrder from "./MyOrder";
import MyCreation from "@/components/buyer/MyCreation";
import MyLike from "@/components/buyer/MyLike";

function Dashboard({ className }) {
  const [baseTab, setBaseTab] = useState("order");

  return (
    <div className={className}>
      <div className="left">
        <TabContext value={baseTab}>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Tabs
              value={baseTab}
              TabIndicatorProps={{ style: { display: "none" } }}
              orientation="vertical"
              onChange={(e, tab) => {
                setBaseTab(tab);
              }}>
              <Tab
                className="tab-btn"
                value="order"
                label={
                  <Stack className="tab-container" direction="row">
                    <span className="order" />
                    <span>My Orders</span>
                  </Stack>
                }
              />
              <Tab
                className="tab-btn"
                value="creation"
                label={
                  <Stack className="tab-container" direction="row">
                    <span className="creation" />
                    <span>My Creations</span>
                  </Stack>
                }
              />
              <Tab
                className="tab-btn"
                value="like"
                label={
                  <Stack className="tab-container" direction="row">
                    <span className="like" />
                    <span>My Likes</span>
                  </Stack>
                }
              />
            </Tabs>
            <div style={{ width: 1296 }}>
              <TabPanel sx={{ borderRadius: "15px" }} value="order">
                <Box sx={{ p: 2 }}>
                  <MyOrder />
                </Box>
              </TabPanel>
              <TabPanel sx={{ borderRadius: "15px" }} value="creation">
                <Box sx={{ p: 2 }}>
                  <MyCreation />
                </Box>
              </TabPanel>
              <TabPanel sx={{ borderRadius: "15px" }} value="like">
                <Box sx={{ p: 2 }}>
                  <MyLike />
                </Box>
              </TabPanel>
            </div>
          </Stack>
        </TabContext>
      </div>
    </div>
  );
}

export default styled(Dashboard)`
  .tab-btn {
    width: 240px;
    height: 48px;
    color: white;
    background: linear-gradient(270deg, #09e98d 0%, #0aab50 100%);
    border-radius: 8px;
    font-weight: 500;
    font-size: 18px;
    line-height: 26px;
    &:nth-child(2) {
      margin: 32px 0;
    }
    &.Mui-selected {
      color: #0f1d35;
      background: white;
      .order {
        background-image: url(/img/dashboard/or-sl.png);
      }
      .creation {
        background-image: url(/img/dashboard/cr-sl.png);
      }
      .like {
        background-image: url(/img/dashboard/li-sl.png);
      }
    }
    text-transform: none;
    .order,
    .creation,
    .like {
      width: 24px;
      height: 24px;
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: center;
      margin-right: 8px;
    }
    .order {
      background-image: url(/img/dashboard/or.png);
    }
    .creation {
      background-image: url(/img/dashboard/cr.png);
    }
    .like {
      background-image: url(/img/dashboard/li.png);
    }
    .tab-container {
      width: 100%;
      padding-left: 32px;
    }
  }
  .subtitle {
    color: white;
  }
`;
