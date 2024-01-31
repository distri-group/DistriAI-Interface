import { Box, LinearProgress, Typography } from "@mui/material";
import React from "react";

export default function ProgressWithLabel({ value, label }) {
  return (
    <Box>
      <Box>
        <LinearProgress
          variant="determinate"
          color="white"
          value={value}
          sx={{
            height: 8,
            borderRadius: "4px",
            ["& .MuiLinearProgress-bar"]: {
              backgroundColor: "#bdff95",
            },
          }}
        />
      </Box>
      <Box
        style={{
          color: "#bdff95",
          position: "relative",
          left: `${value}%`,
          marginTop: "8px",
          marginLeft: "-20px",
        }}>
        <span style={{ display: "block" }}>{`${Math.round(value)}%`}</span>
        <span style={{ marginLeft: "-30px" }}>{label}</span>
      </Box>
    </Box>
  );
}
