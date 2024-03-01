import { Button, Menu, MenuItem, Modal, Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function Header({ className }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [anchorEl3, setAnchorEl3] = useState(null);
  const [anchorEl4, setAnchorEl4] = useState(null);
  const [videoModal, setVideoModal] = useState(false);
  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);
  const open3 = Boolean(anchorEl3);
  const open4 = Boolean(anchorEl4);
  const transparent = {
    paper: { style: { background: "transparent", boxShadow: "none" } },
  };
  const scrollToAboutUs = () => {
    const aboutUs = document.getElementById("about-us");
    aboutUs.scrollIntoView({ behavior: "smooth" });
    setAnchorEl3(null);
  };
  return (
    <div className={className}>
      <div className="container">
        <img src="/img/logo.png" alt="" />
        <div
          style={{
            display: "flex",
            width: "60%",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <div className="nav">
            <Button
              disableRipple
              onClick={(e) => setAnchorEl(e.currentTarget)}
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              className={open ? "dropdown" : "disabled"}>
              Product
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              disableScrollLock
              slotProps={transparent}
              onClose={() => setAnchorEl(null)}>
              <MenuItem
                className="menu-item"
                onClick={() => navigate("/market")}>
                <img
                  src="/img/navbar/Icon_Need.png"
                  className="icon"
                  alt="Need"
                />
                <span className="subtitle">Need</span>
              </MenuItem>
              <MenuItem
                className="menu-item"
                onClick={() => navigate("/device")}>
                <img
                  src="/img/navbar/Icon_Share.png"
                  className="icon"
                  alt="Share"
                />
                <span className="subtitle">Share</span>
              </MenuItem>
            </Menu>
            <Button
              disableRipple
              onClick={(e) => setAnchorEl2(e.currentTarget)}
              aria-controls={open2 ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open2 ? "true" : undefined}
              className={open2 ? "dropdown" : "disabled"}>
              Resources
            </Button>
            <Menu
              anchorEl={anchorEl2}
              open={open2}
              disableScrollLock
              slotProps={transparent}
              onClose={() => setAnchorEl2(null)}>
              <MenuItem
                className="menu-item"
                onClick={() => {
                  window.open("https://github.com/distri-group");
                  setAnchorEl2(null);
                }}>
                <img
                  src="/img/navbar/Icon_Github.png"
                  className="icon"
                  alt="Github"
                />
                <span className="subtitle">Github</span>
              </MenuItem>
              <MenuItem
                className="menu-item"
                onClick={() => {
                  window.open("https://medium.com/@Distri.AI");
                  setAnchorEl2(null);
                }}>
                <img
                  src="/img/navbar/Icon_Blog.png"
                  className="icon"
                  alt="Blog"
                />
                <span className="subtitle">Blog</span>
              </MenuItem>
              <MenuItem className="menu-item">
                <img
                  src="/img/navbar/Icon_Roadmap.png"
                  className="icon"
                  alt="Roadmap"
                />
                <span className="subtitle">Roadmap</span>
              </MenuItem>
              <MenuItem className="menu-item">
                <img
                  src="/img/navbar/Icon_About Us.png"
                  className="icon"
                  alt="About Us"
                />
                <a
                  className="subtitle"
                  style={{ textDecoration: "none" }}
                  href="distri.ai-whitepaper.pdf">
                  White Paper
                </a>
              </MenuItem>
            </Menu>
            <Button
              disableRipple
              onClick={(e) => setAnchorEl3(e.currentTarget)}
              aria-controls={open3 ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open3 ? "true" : undefined}
              className={open3 ? "dropdown" : "disabled"}>
              About
            </Button>
            <Menu
              anchorEl={anchorEl3}
              open={open3}
              disableScrollLock
              slotProps={transparent}
              onClose={() => setAnchorEl3(null)}>
              <MenuItem onClick={scrollToAboutUs} className="menu-item">
                <img
                  src="/img/navbar/Icon_About Us.png"
                  className="icon"
                  alt="About Us"
                />
                <span className="subtitle">About Us</span>
              </MenuItem>
              <MenuItem className="menu-item">
                <img
                  src="/img/navbar/Icon_Contact Us.png"
                  className="icon"
                  alt="Contact Us"
                />
                <span className="subtitle">Contact Us</span>
              </MenuItem>
            </Menu>
            <Button
              disableRipple
              onClick={(e) => setAnchorEl4(e.currentTarget)}
              aria-controls={open4 ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open4 ? "true" : undefined}
              className={open4 ? "dropdown" : "disabled"}>
              Docs
            </Button>
            <Menu
              anchorEl={anchorEl4}
              open={open4}
              disableScrollLock
              slotProps={transparent}
              onClose={() => setAnchorEl4(null)}>
              <MenuItem
                className="menu-item"
                onClick={() => {
                  window.open("https://docs.distri.ai/core/");
                  setAnchorEl4(false);
                }}>
                <img
                  src="/img/navbar/Icon_Getting Started.png"
                  className="icon"
                  alt="Getting Started"
                />
                <span className="subtitle">Getting Started</span>
              </MenuItem>
              <MenuItem
                className="menu-item"
                onClick={() => {
                  setVideoModal(true);
                  setAnchorEl4(false);
                }}>
                <img
                  src="/img/navbar/Icon_Demo Video.png"
                  className="icon"
                  alt="Demo Video"
                />
                <span className="subtitle">Demo Video</span>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
      <Modal open={videoModal} onClose={() => setVideoModal(false)}>
        <Box sx={{ width: "1236px", margin: "0 auto", marginTop: "100px" }}>
          <iframe
            width="1236"
            height="695"
            src="https://www.youtube.com/embed/SKa_HxFgHp8"
            title="Distri.AI Video of User Guide"
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen></iframe>
        </Box>
      </Modal>
    </div>
  );
}

export default styled(Header)`
  width: 100%;
  height: 56px;
  line-height: 56px;
  display: block;
  a {
    text-decoration: none;
    color: white;
  }
  .nav {
    width: 60%;
    display: flex;
    justify-content: space-between;
  }
  .container {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    overflow: hidden;
    width: calc(100% - 320px);
    max-width: 100%;
    margin: 0 160px;
    height: 56px;
    padding: 0;
    img {
      width: 120px;
      height: 28px;
      margin-top: 14px;
      cursor: pointer;
    }
  }
  .dropdown {
    text-transform: none;
    color: white;
    font-size: 16px;
  }
  .disabled {
    text-transform: none;
    color: #898989;
    font-size: 16px;
  }
`;
