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
  const failed = !refundTime || !new Date(startTime).getTime();
  const refunded = !!refundTime;
  useEffect(() => {
    if (!duration) {
      setProgress(0);
      return setUsed(0);
    }
    const start = new Date(startTime);
    if (!start.getTime() > 0) {
      return () => {
        setProgress(0);
        setUsed(0);
      };
    }
    const hour = 1000 * 60 * 60;
    let interval;
    const updateProgress = () => {
      if (!refundTime && endTime) {
        setProgress(100);
        setUsed(duration);
        clearInterval(interval);
      } else {
        if (refundTime) {
          const difference = Math.abs(new Date(refundTime) - start);
          const result = difference / hour / duration;
          setProgress((result * 100).toFixed(2));
          setUsed(Math.ceil(difference / hour));
          clearInterval(interval);
        } else {
          const difference = Math.abs(Date.now() - start);
          const result = difference / hour / duration;
          if (result > 1) {
            setProgress(100);
            setUsed(duration);
            clearInterval(interval);
          } else {
            setProgress((result * 100).toFixed(2));
            setUsed(Math.ceil(difference / hour));
          }
        }
      }
    };
    updateProgress();
    interval = setInterval(updateProgress, 1000);
  }, [startTime, endTime, duration, refundTime]);
  return (
    <Box>
      <Box>
        <LinearProgress
          variant="determinate"
          color="white"
          value={parseFloat(progress)}
          sx={{
            margin: "16px 0",
            height: 16,
            borderRadius: 4,
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#D7FF65",
            },
            backgroundColor: (refundTime || duration === 0) && "#ff6073",
          }}
        />
      </Box>
      <Box
        style={{
          display: "inline-block",
          color: refunded || failed ? "#ff6073" : "#D7FF65",
          position: "relative",
          left: `${progress > 4 ? progress : 4}%`,
          marginTop: "8px",
          marginBottom: 24,
          marginLeft: "-20px",
        }}>
        <span>{`${parseFloat(progress).toFixed(2)}%`}</span>
        <br />
        <span style={{ marginLeft: "-30px" }}>
          {"Duration: " + used + " h"}
        </span>
      </Box>
    </Box>
  );
}
