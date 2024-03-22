import styled from "styled-components";

function DeviceCard({ className, device }) {
  return (
    <div className={className}>
      <h3># {device.UUID.slice(-10)}</h3>
      <div className="card-container">
        <div className="info-box vertical">
          <div className="box-item">
            <label>Provider</label>
            <span>{device.Provider}</span>
          </div>
          <div className="box-item">
            <label>Region</label>
            <span>{device.Region || "--"}</span>
          </div>
        </div>
        <div className="info-box vertical">
          <div className="box-item">
            <label>GPU</label>
            <span>{device.GPU}</span>
          </div>
          <div className="box-item">
            <label>CPU</label>
            <span>{device.CPU || "--"}</span>
          </div>
        </div>
        <div className="info-box horizontal">
          <div className="box-item">
            <label>TFLOPS</label>
            <span>{device.Tflops}</span>
          </div>
          <div className="box-item">
            <label>RAM</label>
            <span>{device.RAM || "--"}</span>
          </div>
          <div className="box-item">
            <label>Avail Disk Storage</label>
            <span>{device.Disk || device.AvailDiskStorage}GB</span>
          </div>
          <div className="box-item">
            <label>Reliability</label>
            <span>{device.Reliability}</span>
          </div>
          <div className="box-item">
            <label>CPS</label>
            <span>{device.CPS}</span>
          </div>
          <div className="box-item">
            <label>Internet Speed</label>
            <span>
              <div className="speed">
                <img
                  src="/img/market/download.svg"
                  style={{ transform: "rotate(180deg)" }}
                  alt=""
                />
                {device.Speed.Upload || "-- Mbps"}
              </div>
              <div className="speed">
                <img src="/img/market/download.svg" alt="" />
                {device.Speed.Download || "-- Mbps"}
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default styled(DeviceCard)`
  h3 {
    font-size: 16px;
  }
  .card-container {
    display: flex;
    justify-content: space-between;
    height: 180px;
    .info-box {
      width: 30%;
      padding: 14px;
      background-color: black;
      border: 1px solid rgba(170, 170, 170, 1);
      border-radius: 8px;
    }
    .vertical {
      span,
      label {
        display: block;
      }
      span {
        word-wrap: break-word;
      }
      label {
        margin: 8px 0;
      }
    }
    .horizontal {
      .box-item {
        display: flex;
        justify-content: space-between;
      }
    }
  }
`;
