import styled from "styled-components";
import {
  ToggleButton,
  ToggleButtonGroup,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";

function DurationToggle({ className, duration, setDuration, max }) {
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
      <div className="row-txt">Duration</div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "40px",
          paddingBottom: "16px",
        }}>
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

export default styled(DurationToggle)``;
