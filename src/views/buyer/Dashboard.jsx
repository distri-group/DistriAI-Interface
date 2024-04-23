import styled from "styled-components";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { Box, Stack, Tab } from "@mui/material";
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
          <Stack direction="row" spacing={2}>
            <TabList
              orientation="vertical"
              onChange={(e, tab) => {
                setBaseTab(tab);
              }}>
              <Tab
                value="order"
                label={<span className="subtitle">My Orders</span>}
              />
              <Tab
                value="creation"
                label={<span className="subtitle">My Creations</span>}
              />
              <Tab
                value="like"
                label={<span className="subtitle">My Likes</span>}
              />
            </TabList>
            <div style={{ width: 1400 }}>
              <TabPanel value="order">
                <Box sx={{ p: 2 }}>
                  <MyOrder />
                </Box>
              </TabPanel>
              <TabPanel value="creation">
                <Box sx={{ p: 2 }}>
                  <MyCreation />
                </Box>
              </TabPanel>
              <TabPanel value="like">
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
  .subtitle {
    color: white;
  }
`;
