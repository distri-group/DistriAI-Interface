import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function Header({ className }) {
  let navigate = useNavigate();
  return (
    <div className={className}>
      <div className="con">
        <img
          src="/img/logo.png"
          style={{
            width: "120px",
          }}
          alt=""
        />
        <span onClick={() => navigate("/market/")}>Launch APP</span>
      </div>
    </div>
  );
}

export default styled(Header)`
  width: 100%;
  height: 56px;
  line-height: 56px;
  display: block;
  .con {
    width: 1200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    overflow: hidden;
    margin: 0 auto;
    height: 56px;
    img {
      margin-left: 20px;
      cursor: pointer;
    }
    span {
      margin-right: 20px;
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
