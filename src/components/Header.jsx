import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function Header({ className }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  return (
    <div className={className}>
      <div className="con">
        <img src="/img/logo.png" style={{}} alt="" />
        <div
          style={{
            display: "flex",
            width: "400px",
            justifyContent: "space-between",
          }}>
          <Button
            disableRipple
            onClick={(e) => setAnchorEl(e.currentTarget)}
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            className="dropdown">
            Resources
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            disableScrollLock
            onClose={() => setAnchorEl(null)}>
            <MenuItem
              onClick={() => {
                window.open("https://github.com/distri-group");
                setAnchorEl(null);
              }}>
              Github
            </MenuItem>
            <MenuItem disabled>Whitepaper</MenuItem>
            <MenuItem
              onClick={() => {
                window.open("https://medium.com/@Distri.AI");
                setAnchorEl(null);
              }}>
              Blog
            </MenuItem>
          </Menu>
          <a
            href="https://docs.distri.ai/core/"
            target="_blank"
            rel="noreferrer">
            Docs
          </a>
          <span className="launch" onClick={() => navigate("/market")}>
            Buy CPU
          </span>
          <span className="launch" onClick={() => navigate("/device")}>
            Sell CPU
          </span>
        </div>
      </div>
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
  .con {
    width: 1200px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    overflow: hidden;
    margin: 0 auto;
    height: 56px;
    img {
      margin-left: 20px;
      width: 120px;
      height: 28px;
      margin-top: 14px;
      cursor: pointer;
    }
    .launch {
      margin-top: 9px;
      color: white;
      line-height: 38px;
      height: 38px;
      text-align: center;
      display: block;
      overflow: hidden;
      border-radius: 20px;
      background-image: linear-gradient(to right, #20ae98, #0aab50);
      padding: 0px 14px;
      cursor: pointer;
    }
  }
  .dropdown {
    text-transform: none;
    color: white;
    font-size: 16px;
  }
`;
