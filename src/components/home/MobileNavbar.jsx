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
import { useNavigate } from "react-router-dom";

function MobileNavbar({ className, onClose, onVideoOpen }) {
  const [expand, setExpand] = useState("");
  const navigate = useNavigate();
  const handleClose = () => {
    onClose();
    setExpand(null);
  };
  const theme = createTheme({
    components: {
      MuiAccordion: {
        styleOverrides: {
          root: {
            "&:before": {
              display: "none",
            },
            "&.Mui-expanded": {
              margin: 0,
            },
            color: "white",
            background: "transparent",
            boxShadow: "none",
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            padding: "12pt",
          },
          content: {
            margin: 0,
            "&.Mui-expanded": {
              margin: 0,
            },
          },
          expandIconWrapper: {
            color: "#898989",
            "&.Mui-expanded": {
              transform: "rotate(90deg)",
            },
          },
        },
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: {
            padding: "0",
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            padding: "12pt",
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
      <div className="header">
        <img src="/img/logo.png" alt="Distri.AI" />
        <span className="navbtn" onClick={handleClose} />
      </div>
      <div className="navbar">
        <ThemeProvider theme={theme}>
          <Accordion
            expanded={expand === "product"}
            onChange={handleExpandChange("product")}>
            <AccordionSummary expandIcon={<ChevronRight />}>
              <Typography className="title">Product</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <ListItemButton onClick={() => navigate("/market")} key={1}>
                  <img
                    src="/img/navbar/Icon_Need.png"
                    className="icon"
                    alt="Need"
                  />
                  <Typography className="item">Need</Typography>
                </ListItemButton>
                <ListItemButton onClick={() => navigate("/market")} key={2}>
                  <img
                    src="/img/navbar/Icon_Share.png"
                    className="icon"
                    alt="Share"
                  />
                  <Typography className="item">Share</Typography>
                </ListItemButton>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expand === "resources"}
            onChange={handleExpandChange("resources")}>
            <AccordionSummary expandIcon={<ChevronRight />}>
              <Typography className="title">Resources</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <ListItemButton
                  LinkComponent="a"
                  href="https://github.com/distri-group"
                  target="_blank"
                  rel="noreferrer"
                  key={1}>
                  <img
                    src="/img/navbar/Icon_Github.png"
                    className="icon"
                    alt="Github"
                  />
                  <Typography className="item">Github</Typography>
                </ListItemButton>
                <ListItemButton
                  LinkComponent="a"
                  href="https://medium.com/@Distri.AI"
                  target="_blank"
                  rel="noreferrer"
                  key={2}>
                  <img
                    src="/img/navbar/Icon_Blog.png"
                    className="icon"
                    alt="Blog"
                  />
                  <Typography className="item">Blog</Typography>
                </ListItemButton>
                <ListItemButton
                  LinkComponent="a"
                  href="#roadmap"
                  onClick={handleClose}
                  key={3}>
                  <img
                    src="/img/navbar/Icon_Roadmap.png"
                    className="icon"
                    alt="Roadmap"
                  />
                  <Typography className="item">Roadmap</Typography>
                </ListItemButton>
                <ListItemButton
                  LinkComponent="a"
                  href="distri.ai-whitepaper.pdf"
                  onClick={handleClose}
                  key={4}>
                  <img
                    src="/img/navbar/Icon_White Paper.png"
                    className="icon"
                    alt="Whitepaper"
                  />
                  <Typography className="item">Whitepaper</Typography>
                </ListItemButton>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expand === "about"}
            onChange={handleExpandChange("about")}>
            <AccordionSummary expandIcon={<ChevronRight />}>
              <Typography className="title">About</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <ListItemButton
                  LinkComponent="a"
                  href="#about-us"
                  onClick={handleClose}
                  key={1}>
                  <img
                    src="/img/navbar/Icon_About Us.png"
                    className="icon"
                    alt="About Us"
                  />
                  <Typography className="item">About Us</Typography>
                </ListItemButton>
                <ListItemButton
                  LinkComponent="a"
                  href="#contact-us"
                  onClick={handleClose}
                  key={2}>
                  <img
                    src="/img/navbar/Icon_Contact Us.png"
                    className="icon"
                    alt="Contact Us"
                  />
                  <Typography className="item">Contact Us</Typography>
                </ListItemButton>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expand === "docs"}
            onChange={handleExpandChange("docs")}>
            <AccordionSummary expandIcon={<ChevronRight />}>
              <Typography className="title">Docs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <ListItemButton
                  LinkComponent="a"
                  href="https://docs.distri.ai/core/"
                  target="_blank"
                  rel="noreferrer"
                  key={1}>
                  <img
                    src="/img/navbar/Icon_Getting Started.png"
                    className="icon"
                    alt="Getting Started"
                  />
                  <Typography className="item">Getting Started</Typography>
                </ListItemButton>
                <ListItemButton
                  LinkComponent="a"
                  href="https://www.youtube.com/watch?v=SKa_HxFgHp8"
                  target="_blank"
                  rel="noreferrer"
                  key={2}>
                  <img
                    src="/img/navbar/Icon_Demo Video.png"
                    className="icon"
                    alt="Demo Video"
                  />
                  <Typography className="item">Demo Video</Typography>
                </ListItemButton>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </ThemeProvider>
      </div>
    </div>
  );
}
export default styled(MobileNavbar)`
  width: 100%;
  height: 100%;
  .header {
    padding: 20pt 24pt;
    display: flex;
    justify-content: space-between;
    img {
      width: 100pt;
      height: 24pt;
    }
  }
  .navbar {
    padding: 24pt;
  }
  .navbtn {
    background-image: url(/img/home/icon_gb.svg) !important;
  }
  .title {
    font-size: 16pt;
    line-height: 22pt;
  }
  .item {
    font-size: 14pt;
    height: 20pt;
    color: #898989;
  }
  .icon {
    width: 16pt;
    height: 16pt;
    margin: 4pt;
    margin-right: 12pt;
  }
`;
