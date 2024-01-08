import styled from "styled-components";

function Header({ className }) {
  return (
    <div className={className}>
      <div className="container">
        <div className="copyright">
          Copyright © DistriAI 2024 All Rights Reserved
        </div>
        <div className="pater">
          <a
            className="l1"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/distri-group">
            {" "}
          </a>
          <a
            className="l3"
            target="_blank"
            rel="noreferrer"
            href="https://twitter.com/DistriAI_web3">
            {" "}
          </a>
          <a
            className="l4"
            target="_blank"
            rel="noreferrer"
            href="https://discord.gg/CgQZGcSb9V">
            {" "}
          </a>
        </div>
      </div>
    </div>
  );
}

export default styled(Header)`
  display: block;
  overflow: hidden;
  clear: both;
  .container {
    display: flex;
    justify-content: space-between;
    width: 80%;
    padding: 20px 0;
    margin: 0 auto;
  }
  .pater {
    display: flex;
    flex-direction: row;
    width: 300px;
    a {
      width: 25%;
      background-repeat: no-repeat;
      background-position: center;
      height: 30px;
      display: block;
      overflow: hidden;
      background-size: 40%;
    }
    .l1 {
      background-image: url(/img/home/github.svg);
    }
    .l3 {
      background-image: url(/img/home/twitter.svg);
    }
    .l4 {
      background-image: url(/img/home/discord.svg);
    }
  }
  .copyright {
    color: #666666;
    text-align: center;
    display: block;
    line-height: 20px;
    font-size: 13px;
  }
`;
