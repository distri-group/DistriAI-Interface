import { Box, LinearProgress } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function DurationProgress({
  startTime,
  endTime,
  duration,
  refundTime,
}) {
  const [used, setUsed] = useState(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!duration) {
      setProgress(0);
      return setUsed(0);
    }
    const start = new Date(startTime);
    let end;
    if (refundTime) {
      end = new Date(refundTime);
    } else {
      end = endTime ? new Date(endTime) : new Date();
    }
    const difference = Math.abs(end - start);
    const hour = 1000 * 60 * 60;
    const result = difference / hour / duration;
    if (result <= 1) {
      setProgress((result * 100).toFixed(2));
      setUsed(Math.ceil(difference / hour));
    } else {
      setProgress(100);
      setUsed(duration);
    }
  }, [startTime, endTime, duration, refundTime]);
  return (
    <Box>
      <Box>
        <LinearProgress
          variant="determinate"
          color="white"
          value={parseFloat(progress)}
          sx={{
            height: 8,
            borderRadius: "4px",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#bdff95",
            },
            backgroundColor: (refundTime || duration === 0) && "#ffb9b9",
          }}
        />
      </Box>
      <Box
        style={{
          color: refundTime
            ? "#ffb9b9"
            : duration === 0
            ? "#878787"
            : "#bdff95",
          position: "relative",
          left: `${progress > 4 ? progress : 4}%`,
          marginTop: "8px",
          marginLeft: "-20px",
        }}>
        <span style={{ display: "block" }}>{`${parseFloat(progress).toFixed(
          2
        )}%`}</span>
        <span style={{ marginLeft: "-30px" }}>
          {"Duration: " + used + " h"}
        </span>
      </Box>
    </Box>
  );
}
