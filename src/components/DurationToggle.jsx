import styled from "styled-components";
import {
  ToggleButton,
  ToggleButtonGroup,
  Button,
  TextField,
  InputAdornment,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Add, Remove } from "@mui/icons-material";

function DurationToggle({ className, duration, setDuration, max, title }) {
  const [type, setType] = useState("hour");
  const [num, setNum] = useState(0);
  const [count, setCount] = useState(1);
  const onSelect = (e, value) => {
    if (value !== null) {
      setType(value);
      setCount(1);
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
    const calcDuration = count * num;
    if (calcDuration > max) {
      setDuration(max);
    } else {
      setDuration(calcDuration);
    }
    // eslint-disable-next-line
  }, [count, num, max]);
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
      <h3>{title}</h3>
      <Stack direction="row" justifyContent="space-between">
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
        <Stack direction="row" spacing={2} className="count">
          <Button
            disabled={type === "max" || count - 1 === 0}
            className="count-btn"
            onClick={() => {
              setCount(count - 1);
            }}>
            <Remove />
          </Button>
          <TextField
            style={{
              width: 160,
              height: 56,
            }}
            disabled={type === "max"}
            value={count}
            type="number"
            inputProps={{ min: 0, style: { textAlign: "center" } }}
            onChange={onCountInput}
          />
          <Button
            disabled={type === "max" || num * count >= max}
            className="count-btn"
            onClick={() => {
              setCount(count + 1);
            }}>
            <Add />
          </Button>
        </Stack>
      </Stack>
      <TextField
        data-name="duration"
        value={duration}
        placeholder="Hour"
        onChange={onDurationInput}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <span style={{ color: "white" }}>Hour</span>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}

export default styled(DurationToggle)`
  h3 {
    font-size: 24px;
    line-height: 34px;
    margin: 16px 0;
  }
  .count {
    height: 56px;
    .count-btn {
      background-color: white;
      border: 1px solid black;
      color: black;
    }
  }
  .duration-btn {
    width: 160px;
    height: 48px;
    border: 1px solid white;
    border-radius: 6px;
  }
  .MuiToggleButtonGroup-middleButton.Mui-disabled {
    border-left: 1px solid white;
  }
`;
