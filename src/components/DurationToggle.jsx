import styled from "styled-components";
import {
  ToggleButton,
  ToggleButtonGroup,
  Button,
  TextField,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { useEffect, useState } from "react";

function DurationToggle({ className, duration, setDuration, max, title }) {
  const [type, setType] = useState("hour");
  const [num, setNum] = useState(0);
  const [count, setCount] = useState(1);
  const onSelect = (e, value) => {
    if (value !== null) {
      setType(value);
    }
  };
  const onCountInput = (e) => {
    const value = parseFloat(e.target.value) || 0;
    if (value * num > max) {
      setCount(Math.floor(max / num));
    } else if (value < 1) {
      setCount(1);
    } else {
      setCount(value);
    }
  };
  const onDurationInput = (e) => {
    const value = parseFloat(e.target.value) || 0;
    if (value > max) {
      setDuration(max);
    } else if (value < 1) {
      setDuration(1);
    } else {
      setDuration(value);
    }
  };
  useEffect(() => {
    if (duration === max) {
      setType("max");
    }
  }, [duration, max]);
  useEffect(() => {
    setDuration(count * num);
  }, [count, num, setDuration]);
  useEffect(() => {
    switch (type) {
      case "hour": {
        setNum(1);
        break;
      }
      case "day": {
        setNum(24);
        break;
      }
      case "max": {
        setNum(max || 0);
        setCount(1);
        break;
      }
      default: {
        setNum(1);
      }
    }
  }, [type, max]);
  return (
    <div className={className}>
      <div className="row-txt">{title}</div>
      <div className="toggle-box">
        <ToggleButtonGroup value={type} exclusive onChange={onSelect}>
          <ToggleButton value="hour" className="duration-btn">
            Hourly
          </ToggleButton>
          <ToggleButton
            value="day"
            disabled={max < 24}
            className="duration-btn"
            style={{ margin: "0 20px" }}>
            Daily
          </ToggleButton>
          <ToggleButton value="max" className="duration-btn">
            MAX
          </ToggleButton>
        </ToggleButtonGroup>
        <div className="count">
          <Button
            disabled={type === "max" || count - 1 === 0}
            className="count-btn"
            onClick={() => {
              setCount(count - 1);
            }}>
            -
          </Button>
          <TextField
            size="small"
            style={{
              width: "100px",
            }}
            sx={{}}
            disabled={type === "max"}
            value={count}
            type="number"
            onChange={onCountInput}
          />
          <Button
            disabled={type === "max" || num * count >= max}
            className="count-btn"
            onClick={() => {
              setCount(count + 1);
            }}>
            +
          </Button>
        </div>
      </div>
      <OutlinedInput
        data-name="duration"
        value={duration}
        placeholder="Hour"
        onChange={onDurationInput}
        fullWidth
        endAdornment={
          <InputAdornment position="end">
            <span style={{ color: "white" }}>Hour</span>
          </InputAdornment>
        }
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
    border-radius: 4px;
    border: 1px solid white !important;
    width: 86px;
  }
  .toggle-box {
    display: flex;
    justify-content: space-between;
    height: 40px;
    padding-bottom: 16px;
  }
`;
