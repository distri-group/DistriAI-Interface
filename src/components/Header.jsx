import { Modal, Box, Backdrop } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import DropdownMenu from "./DropdownMenu";
import { Context } from "../views/Home";
import MobileNavbar from "./home/MobileNavbar";

function Header({ className }) {
  const { width } = useContext(Context);
  const navigate = useNavigate();
  const [videoModal, setVideoModal] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  return (
    <div className={className}>
      <div className="container">
        <a href="#banner">
          <img src="/img/logo.png" alt="Distri.AI" />
        </a>
        {width > 500 ? (
          <div className="navs">
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
                <a href="#roadmap" className="menu-item">
                  <img
                    src="/img/navbar/Icon_Roadmap.png"
                    className="icon"
                    alt="Roadmap"
                  />
                  <span className="subtitle">Roadmap</span>
                </a>
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
                <a href="#contact-us" className="menu-item">
                  <img
                    src="/img/navbar/Icon_Contact Us.png"
                    className="icon"
                    alt="Contact Us"
                  />
                  <span className="subtitle">Contact Us</span>
                </a>
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
        ) : (
          <span className="navbtn" onClick={() => setNavbarOpen(true)} />
        )}
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
      <Backdrop
        open={navbarOpen}
        sx={{
          height: 1080,
          zIndex: 1000,
          background: "rgba(0, 0, 0, 0.12)",
          backdropFilter: "blur(50px)",
        }}>
        <MobileNavbar
          onClose={() => setNavbarOpen(false)}
          onVideoOpen={() => setVideoModal(true)}
        />
      </Backdrop>
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
  .navs {
    display: flex;
    width: 60%;
    align-items: center;
    justify-content: right;
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
    height: 56px;
    padding: 0 160px;
    img {
      width: 120px;
      height: 28px;
      margin-top: 14px;
      cursor: pointer;
    }
    background-color: rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(12px);
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
  .navbtn {
    display: block;
    width: 24pt;
    height: 24pt;
    background-image: url(/img/home/icon_cd.svg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
  }
  @media (max-width: 500px) {
    width: calc(100% - 48pt);
    height: 24pt;
    .container {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 20pt 24pt;
      img {
        width: 100pt;
        height: 24pt;
        margin-top: 0;
      }
    }
  }
`;
