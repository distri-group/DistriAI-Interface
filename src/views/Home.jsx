import { Button, Stack } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom/dist";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div id="home">
      <Stack
        style={{
          height: 800,
        }}
        justifyContent="center"
        alignItems="center"
        spacing={4}>
        <span className="logo" />
        <h1>Welcome to Distri.AI!</h1>
        <p>👇Click buttons below to navigate to function page👇</p>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Button
            onClick={() => navigate("/market")}
            className="cbtn"
            style={{ width: 160 }}>
            Market
          </Button>
          <Button
            onClick={() => navigate("/dashboard")}
            className="cbtn"
            style={{ width: 160 }}>
            Dashboard
          </Button>
          <Button
            onClick={() => navigate("/model")}
            className="cbtn"
            style={{ width: 160 }}>
            Model
          </Button>
          <Button
            onClick={() => navigate("/device")}
            className="cbtn"
            style={{ width: 160 }}>
            Market
          </Button>
        </Stack>
      </Stack>
    </div>
  );
}
