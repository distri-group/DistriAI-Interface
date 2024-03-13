import React, { useState } from "react";
import styled from "styled-components";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  ListItemButton,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";

function Test({ className }) {
  const [expand, setExpand] = useState("");
  const theme = createTheme({
    components: {
      MuiAccordion: {
        styleOverrides: {
          root: {
            "&.Mui-expanded": {
              margin: 0,
            },
            color: "white",
            background: "transparent",
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          expandIconWrapper: {
            color: "#898989",
            "&.Mui-expanded": {
              transform: "rotate(90deg)",
            },
          },
        },
      },
    },
  });
  const handleExpandChange = (panel) => (event, newExpanded) => {
    setExpand(newExpanded ? panel : false);
  };
  return (
    <div className={className}>
      <ThemeProvider theme={theme}>
        <Accordion
          expanded={expand === "product"}
          onChange={handleExpandChange("product")}>
          <AccordionSummary expandIcon={<ChevronRight />}>
            <Typography>Product</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container direction="column">
              <ListItemButton key={1}>
                <Typography>Need</Typography>
              </ListItemButton>
              <ListItemButton key={2}>
                <Typography>Share</Typography>
              </ListItemButton>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expand === "resources"}
          onChange={handleExpandChange("resources")}>
          <AccordionSummary expandIcon={<ChevronRight />}>
            <Typography>Resources</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container direction="column">
              <ListItemButton key={1}>
                <Typography>Github</Typography>
              </ListItemButton>
              <ListItemButton key={2}>
                <Typography>Blog</Typography>
              </ListItemButton>
              <ListItemButton key={3}>
                <Typography>Roadmap</Typography>
              </ListItemButton>
              <ListItemButton key={4}>
                <Typography>White Paper</Typography>
              </ListItemButton>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expand === "about"}
          onChange={handleExpandChange("about")}>
          <AccordionSummary expandIcon={<ChevronRight />}>
            <Typography>About</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container direction="column">
              <ListItemButton key={1}>
                <Typography>About Us</Typography>
              </ListItemButton>
              <ListItemButton key={2}>
                <Typography>Contact Us</Typography>
              </ListItemButton>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expand === "docs"}
          onChange={handleExpandChange("docs")}>
          <AccordionSummary expandIcon={<ChevronRight />}>
            <Typography>Docs</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container direction="column">
              <ListItemButton key={1}>
                <Typography>Getting Started</Typography>
              </ListItemButton>
              <ListItemButton key={2}>
                <Typography>Demo Video</Typography>
              </ListItemButton>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </ThemeProvider>
    </div>
  );
}
export default styled(Test)`
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(50px);
`;
