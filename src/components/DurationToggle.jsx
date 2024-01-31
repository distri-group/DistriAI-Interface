import styled from "styled-components";
import {
  ToggleButton,
  ToggleButtonGroup,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";

function DurationToggle({ className, duration, setDuration, max, title }) {
  const [type, setType] = useState(1);
  const [count, setCount] = useState(1);
  const onSelect = (e, value) => {
    if (value !== null) {
      setType(value);
    }
  };
  const onInput = (e) => {
    const value = parseFloat(e.target.value);
    if (!value) {
      return setDuration(0);
    }
    setDuration(value);
  };
  return (
    <div className={className}>
      <div className="row-txt">{title}</div>
      <div className="toggle-box">
        <ToggleButtonGroup value={type} exclusive onChange={onSelect}>
          <ToggleButton value={1} className="duration-btn">
            Hourly
          </ToggleButton>
          <ToggleButton value={24} className="duration-btn">
            Daily
          </ToggleButton>
          <ToggleButton value={max || 0} className="duration-btn">
            MAX
          </ToggleButton>
        </ToggleButtonGroup>
        <div className="count">
          <Button
            className="count-btn"
            onClick={() => {
              setCount(count - 1);
            }}>
            -
          </Button>
          <TextField
            size="small"
            value={count}
            type="number"
            onChange={onInput}
          />
          <Button
            className="count-btn"
            onClick={() => {
              setCount(count + 1);
            }}>
            +
          </Button>
        </div>
      </div>
      <TextField
        data-name="duration"
        value={duration * parseInt(type) * parseInt(count)}
        placeholder="Hour"
        onChange={onInput}
      />
    </div>
  );
}

export default styled(DurationToggle)`
  .row-txt {
    font-size: 16px;
    font-weight: bold;
    line-height: 51px;
  }
  .count {
    display: flex;
    justify-content: space-between;
    .count-btn {
      background-color: white;
      border: 1px solid black;
      color: black;
      font-size: 20px;
      font-weight: bolder;
    }
  }
  .duration-btn {
    width: 86px;
  }
  .toggle-box {
    display: flex;
    justify-content: space-between;
    height: 40px;
    padding-bottom: 16px;
  }
`;
