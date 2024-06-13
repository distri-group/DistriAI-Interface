import { Stack } from "@mui/material";
import styled from "styled-components";

const Round = ({ className, left, right }) => (
  <Stack direction="row" alignItems="center" className={className}>
    <Stack direction="row" justifyContent="end" className="my-part">
      <Stack alignItems="center" justifyContent="center" className="content">
        <b>{left.total}</b>
        <label>DIST</label>
        <span>{left.title}</span>
      </Stack>
    </Stack>
    <div className="total-part">
      <Stack>
        <h3>{right.title}</h3>
        <b>{right.total}</b>
        <label>DIST</label>
        <span>{right.desc}</span>
      </Stack>
    </div>
  </Stack>
);

export default styled(Round)`
  width: 280px;
  height: 280px;
  border-radius: 50%;
  border: 1px solid #898989;
  position: relative;
  overflow: hidden;
  .my-part {
    width: 196px;
    height: 196px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -30%;
    background: linear-gradient(270deg, #09e98d 0%, #0aab50 100%);
    .content {
      width: 55%;
      color: #0f1d35;
      b {
        font-size: 32px;
        line-height: 44px;
      }
      span,
      label {
        font-size: 16px;
        color: #0f1d35;
        line-height: 22px;
      }
    }
  }
  .total-part {
    width: 160px;
    position: absolute;
    right: 5%;
    text-align: center;
    h3 {
      margin: 0;
      font-size: 20px;
      line-height: 34px;
    }
    b {
      font-size: 32px;
      line-height: 44px;
    }
    label {
      color: white;
    }
    span {
      font-size: 16px;
      line-height: 24px;
      color: #898989;
    }
  }
`;
