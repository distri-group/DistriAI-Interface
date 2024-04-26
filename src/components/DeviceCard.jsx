import styled from "styled-components";
import { formatAddress } from "@/utils/index.js";
import { Stack } from "@mui/material";

function DeviceCard({ className, device }) {
  return (
    <div className={className}>
      <h3># {formatAddress(device.Uuid || device.UUID)}</h3>
      <Stack direction="row" spacing={5} justifyContent="space-between">
        <Stack spacing={5} className="box">
          <Stack spacing={2}>
            <label>Provider</label>
            <span style={{ wordWrap: "break-word" }}>{device.Provider}</span>
          </Stack>
          <Stack spacing={2}>
            <label>Region</label>
            <span>{device.Region || "--"}</span>
          </Stack>
        </Stack>
        <Stack spacing={5} className="box">
          <Stack spacing={2}>
            <label>GPU</label>
            <span>{device.GPU}</span>
          </Stack>
          <Stack spacing={2}>
            <label>CPU</label>
            <span>{device.CPU || "--"}</span>
          </Stack>
        </Stack>
        <Stack spacing={2} className="box">
          <Stack direction="row" justifyContent="space-between">
            <label>TFLOPS</label>
            <span>{device.Tflops}</span>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <label>RAM</label>
            <span>{device.RAM || "--"}</span>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <label>Avail Disk Storage</label>
            <span>{device.Disk || device.AvailDiskStorage} GB</span>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <label>Reliability</label>
            <span>{device.Reliability}</span>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <label>CPS</label>
            <span>{device.CPS}</span>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <label>Internet Speed</label>
            <span>
              <div className="speed">
                <img
                  src="/img/market/download.svg"
                  style={{ transform: "rotate(180deg)" }}
                  alt=""
                />
                {device.Speed?.Upload || "-- Mbps"}
              </div>
              <div className="speed">
                <img src="/img/market/download.svg" alt="" />
                {device.Speed?.Download || "-- Mbps"}
              </div>
            </span>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
}

export default styled(DeviceCard)`
  padding: 24px 40px;
  h3 {
    font-size: 24px;
    color: #ffffff;
    line-height: 34px;
    margin: 0;
    padding-bottom: 16px;
  }
  .box {
    width: 400px;
    height: 240px;
    padding: 40px;
    border-radius: 12px;
    border: 1px solid #898989;
    label {
      font-size: 20px;
      color: #898989;
      line-height: 28px;
    }
    span {
      font-size: 20px;
      line-height: 28px;
    }
  }
`;
