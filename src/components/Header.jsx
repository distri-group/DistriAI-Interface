import { Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function Header({ className }) {
  let navigate = useNavigate();
  const items = [
    {
      label: (
        <a
          href="https://github.com/distri-group"
          style={{ fontSize: "16px" }}
          target="_blank"
          rel="noreferrer">
          Github
        </a>
      ),
    },
    {
      label: (
        <span style={{ fontSize: "16px", cursor: "default" }}>Whitepaper</span>
      ),
      disabled: true,
    },
    {
      label: (
        <a
          href="https://medium.com/@Distri.AI"
          style={{ fontSize: "16px" }}
          target="_blank"
          rel="noreferrer">
          Blog
        </a>
      ),
    },
  ];
  return (
    <div className={className}>
      <div className="con">
        <img
          src="/img/logo.png"
          style={{
            width: "120px",
            height: "28px",
            marginTop: "14px",
          }}
          alt=""
        />
        <div
          style={{
            display: "flex",
            width: "400px",
            justifyContent: "space-between",
          }}>
          <Dropdown
            menu={{ items }}
            placement="bottom"
            overlayClassName="dropdown">
            <span style={{ color: "white" }}>Resources</span>
          </Dropdown>
          <a
            href="https://docs.distri.ai/core/"
            target="_blank"
            rel="noreferrer">
            Docs
          </a>
          <span className="launch" onClick={() => navigate("/market/")}>
            Launch APP
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
      cursor: pointer;
    }
    .launch {
      margin-right: 20px;
      margin-top: 9px;
      color: white;
      line-height: 38px;
      height: 38px;
      text-align: center;
      display: block;
      overflow: hidden;
      border-radius: 20px;
      background-image: linear-gradient(to right, #20ae98, #0aab50);
      padding: 0px 39px;
      cursor: pointer;
    }
  }
`;
