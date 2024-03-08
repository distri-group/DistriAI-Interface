import { Modal, Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import DropdownMenu from "./DropdownMenu";

function Header({ className }) {
  const navigate = useNavigate();
  const [videoModal, setVideoModal] = useState(false);
  return (
    <div className={className}>
      <div className="container">
        <img src="/img/logo.png" alt="" />
        <div
          style={{
            display: "flex",
            width: "60%",
            alignItems: "center",
            justifyContent: "right",
          }}>
          <div className="nav">
            <DropdownMenu title="Product">
              <span className="menu-item" onClick={() => navigate("/market")}>
                <img
                  src="/img/navbar/Icon_Need.png"
                  className="icon"
                  alt="Need"
                />
                <span className="subtitle">Need</span>
              </span>
              <span className="menu-item" onClick={() => navigate("/device")}>
                <img
                  src="/img/navbar/Icon_Share.png"
                  className="icon"
                  alt="Share"
                />
                <span className="subtitle">Share</span>
              </span>
            </DropdownMenu>
            <DropdownMenu title="Resources">
              <a
                className="menu-item"
                href="https://github.com/distri-group"
                target="_blank"
                rel="noreferrer">
                <img
                  src="/img/navbar/Icon_Github.png"
                  className="icon"
                  alt="Github"
                />
                <span className="subtitle">Github</span>
              </a>
              <a
                className="menu-item"
                href="https://medium.com/@Distri.AI"
                target="_blank"
                rel="noreferrer">
                <img
                  src="/img/navbar/Icon_Blog.png"
                  className="icon"
                  alt="Blog"
                />
                <span className="subtitle">Blog</span>
              </a>
              <span className="menu-item">
                <img
                  src="/img/navbar/Icon_Roadmap.png"
                  className="icon"
                  alt="Roadmap"
                />
                <span className="subtitle">Roadmap</span>
              </span>
              <a className="menu-item" href="distri.ai-whitepaper.pdf">
                <img
                  src="/img/navbar/Icon_White Paper.png"
                  className="icon"
                  alt="White Paper"
                />
                <span className="subtitle">White Paper</span>
              </a>
            </DropdownMenu>
            <DropdownMenu title="About">
              <a href="#about-us" className="menu-item">
                <img
                  src="/img/navbar/Icon_About Us.png"
                  className="icon"
                  alt="About Us"
                />
                <span className="subtitle">About Us</span>
              </a>
              <span className="menu-item">
                <img
                  src="/img/navbar/Icon_Contact Us.png"
                  className="icon"
                  alt="Contact Us"
                />
                <span className="subtitle">Contact Us</span>
              </span>
            </DropdownMenu>
            <DropdownMenu title="Docs">
              <a
                className="menu-item"
                href="https://docs.distri.ai/core/"
                target="_blank"
                rel="noreferrer">
                <img
                  src="/img/navbar/Icon_Getting Started.png"
                  className="icon"
                  alt="Getting Started"
                />
                <span className="subtitle">Getting Started</span>
              </a>
              <span
                className="menu-item"
                onClick={() => {
                  setVideoModal(true);
                }}>
                <img
                  src="/img/navbar/Icon_Demo Video.png"
                  className="icon"
                  alt="Demo Video"
                />
                <span className="subtitle">Demo Video</span>
              </span>
            </DropdownMenu>
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
