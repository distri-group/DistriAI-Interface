import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Spin, Empty, Button, Modal } from "antd";
import { useState, useRef } from "react";
import * as util from "../utils";
import SolanaAction from "../components/SolanaAction";

function Header({ className, list, setList, isMyDevice, loading, reloadFunc }) {
  let navigate = useNavigate();
  const [deviceToCancel, setDeviceToCancel] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const childRef = useRef();
  const cancelOffer = async (row) => {
    setBtnLoading(true);
    let id = row.Uuid;
    if (!id) {
      return util.showError("id not found");
    }
    let ret = await childRef.current.cancelOffer(id);
    if (ret?.msg !== "ok") {
      setList([...list]);
      return util.showError(ret.msg);
    }
    setBtnLoading(false);
    setDeviceToCancel(null);
    util.showOK("Cancel Offer Success.");
    reloadFunc();
  };
  let columns = [
    {
      title: isMyDevice ? "Device" : "Provider",
      width: "14%",
      key: "addr",
      render: (text, record, index) => {
        return (
          <div className="provider">
            <div style={{ display: "flex" }}>
              <span
                style={{
                  marginBottom: "5px",
                  borderRadius: "5px",
                  lineHeight: "20px",
                  height: "20px",
                  fontSize: "12px",
                  padding: "0 15px",
                  color: "rgb(51, 51, 51)",
                  backgroundColor:
                    record?.SecurityLevel === 0
                      ? "#f89898"
                      : record.SecurityLevel === 1
                      ? "#eebe77"
                      : record.SecurityLevel === 2
                      ? "#95d475"
                      : "#79bbff",
                }}>
                level {record?.SecurityLevel}
              </span>
            </div>
            <div className="addr">{record.Addr}</div>
            <div className="id"># {record.UuidShort}</div>
            <div className="reliability">
              <span className="l">
                <label>{record.Reliability}</label>
                <span>Reliability</span>
              </span>
              <span className="r">
                <label>{record.Score}</label>
                <span>CPS</span>
              </span>
            </div>
            <div className="region">
              <img src="/img/market/global.svg" alt="global" />
              <div className="region-info">
                <span>{record.Region}</span>
                <span>{record.Metadata.LocationInfo.query || ""}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Configuration",
      width: "15%",
      key: "Algorithm",
      render: (text, record, index) => {
        return (
          <div className="configuration">
            <div className="gpu">{record.GpuCount + "x " + record.Gpu}</div>
            <div className="graphicsCoprocessor">#{record.Cpu}</div>
            <div className="more">
              <span className="l">
                <label>{record.Tflops || "--"}</label>
                <span>TFLOPS</span>
              </span>
              <span className="l">
                <label>{record.RAM}</label>
                <span>RAM</span>
              </span>
              <span className="l">
                <label>
                  {record.Disk || parseInt(record.Metadata.DiskInfo.TotalSpace)}{" "}
                  GB
                </label>
                <span>Avail Disk Storage</span>
              </span>
            </div>
            <div className="dura">
              <label>Max Duration: {record.MaxDuration}h</label>
              <span>
                <img className="t180" src="/img/market/download.svg" alt="" />{" "}
                {record.UploadSpeed}
              </span>
              <font>
                <img src="/img/market/download.svg" alt="" />{" "}
                {record.DownloadSpeed}
              </font>
            </div>
          </div>
        );
      },
    },
    {
      title: "Price (h)",
      width: "12%",
      key: "Price",
      render: (text, record, index) => {
        if (record.Status === 0) {
          return <span className="no-price">- -</span>;
        }
        return (
          <div className="price">
            <span
              style={{
                margin: 0,
                borderRadius: "100%",
                backgroundColor: "white",
                backgroundImage: "url('/img/token.png')",
                backgroundSize: "70%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "24px",
                height: "24px",
              }}
            />
            <span>{record.Price}</span>
          </div>
        );
      },
    },
    {
      title: "",
      width: "13%",
      key: "Id",
      render: (text, record, index) => {
        return (
          <Button
            disabled={!isMyDevice && record.Status !== 1}
            className={
              isMyDevice
                ? "mini-btn mini-btn" + record.Status
                : record.Status === 1
                ? "mini-btn mini-btn0"
                : "mini-btn mini-btn2"
            }
            onClick={() => {
              if (!isMyDevice) {
                return navigate("/buy/" + record.Uuid);
              }
              if (record.Status === 0) {
                return navigate("/makeoffer/" + record.Uuid);
              }
              if (record.Status === 1) {
                return setDeviceToCancel(record);
              }
              return util.alert("Is training status.");
            }}>
            {isMyDevice
              ? record.Status === 0
                ? "Make Offer"
                : "Unlist"
              : record.Status === 1
              ? "Select"
              : "Rented"}
          </Button>
        );
      },
    },
  ];
  return (
    <div className={className}>
      <SolanaAction ref={childRef}></SolanaAction>
      <table className="mytable">
        <thead className="table-thead">
          <tr>
            {columns.map((c) => {
              return (
                <th key={c.title} style={{ width: c.width }}>
                  {c.title}
                </th>
              );
            })}
          </tr>
        </thead>
        {(list && list.length === 0) || loading ? (
          <tbody>
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                {loading ? (
                  <div className="spin-box">
                    <Spin size="large" />
                  </div>
                ) : isMyDevice ? (
                  <div className="empty-box">
                    <span>Please add your machine in the client</span>
                  </div>
                ) : (
                  <Empty
                    description={"No item yet"}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {list &&
              list.map((d, index) => {
                return (
                  <tr key={index}>
                    {columns.map((c, i) => {
                      if (c.render) {
                        return (
                          <td style={{ width: c.width }} key={i}>
                            {c.render(d[c.key], d, i)}
                          </td>
                        );
                      } else {
                        return (
                          <td key={i} style={{ width: c.width }}>
                            {d[c.key]}
                          </td>
                        );
                      }
                    })}
                  </tr>
                );
              })}
          </tbody>
        )}
      </table>
      {deviceToCancel && (
        <Modal
          open={deviceToCancel}
          onCancel={() => {
            setDeviceToCancel(null);
          }}
          className="cancel"
          width={1000}
          footer={null}>
          <h1 style={{ fontSize: "72px", textAlign: "center" }}>
            Unlist The Offer
          </h1>
          <div style={{ fontSize: "16px", textAlign: "center" }}>
            <p style={{ margin: 0, lineHeight: "19px" }}>
              This will cancel your listing.
            </p>
            <p style={{ margin: 0, lineHeight: "19px" }}>
              You will also be asked to confirm this cancelation from your
              wallet.
            </p>
          </div>
          <Button
            style={{ margin: "0 auto", display: "block", marginTop: "150px" }}
            className="cbtn"
            loading={btnLoading}
            disabled={btnLoading}
            onClick={() => {
              cancelOffer(deviceToCancel);
            }}>
            <span style={{ padding: "0 40px" }}>Confirm</span>
          </Button>
        </Modal>
      )}
    </div>
  );
}

export default styled(Header)`
  .spin-box {
    width: 100%;
    height: 50px;
    padding: 100px 0;
    display: block;
    overflow: hidden;
    text-align: center;
  }
  .no-price {
    font-weight: 700;
    font-style: normal;
    font-size: 20px;
    color: #ffffff;
  }
  .mini-btn {
    border-radius: 4px;
    border: none;
    height: 31px;
    font-size: 14px;
    display: block;
    text-align: center;
    overflow: hidden;
    margin-right: 10px;
    width: 102px;
    float: right;
    :hover {
      border: none;
    }
    color: black;
  }
  .mini-btn0 {
    background-image: linear-gradient(to right, #20ae98, #0aab50);
    color: white;
  }
  .mini-btn0:hover {
    color: white !important;
  }
  .mini-btn1 {
    background-color: rgba(255, 185, 185, 1);
  }
  .mini-btn2 {
    background-color: rgba(70, 70, 70, 1);
  }
  .mini-btn1:hover {
    background-color: rgba(255, 214, 214, 1);
    color: black !important;
  }
  .t180 {
    transform: rotate(180deg);
  }
  .price {
    display: flex;
    clear: both;
    flex-direction: row;
    align-items: center;
    img {
      width: 24px;
    }
    span {
      font-size: 20px;
      color: #ffffff;
      line-height: 20px;
      margin-left: 5px;
      font-weight: bold;
    }
  }
  .mytable {
    display: table;
    background-color: #222;
    border-radius: 10px;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    overflow: hidden;
    .link {
      color: #fff;
      cursor: pointer;
    }
    .btn-link {
      color: #fff;
      cursor: pointer;
      text-decoration: underline;
    }
    th {
      background-color: #151515;
      color: #fff;
      height: 40px;
      line-height: 40px;
      text-align: left;
      padding: 0 10px;
      font-weight: normal;
    }
    tr td {
      border-bottom: 1px solid #1a1a1a;
      border-collapse: collapse;
      padding: 0 10px;
      overflow: hidden;
    }
    tr:last-children {
      td {
        border-bottom: none;
      }
    }
  }
  .provider {
    width: 237px;
    padding: 20px 0 15px;
    .status {
      width: 77px;
      height: 19px;
      line-height: 19px;
      color: #333;
      border-radius: 4px;
      display: block;
      overflow: hidden;
      text-align: center;
      font-size: 12px;
      margin-bottom: 10px;
    }
    .status0 {
      display: none;
    }
    .status1 {
      background-color: #f7ffad;
    }
    .status2 {
      background-color: #b6ff9e;
    }
    .addr {
      display: block;
      font-size: 16px;
      color: #94d6e2;
      line-height: 20px;
    }
    .id {
      font-size: 13px;
      color: #797979;
      line-height: 15px;
    }
    .reliability {
      display: flex;
      clear: both;
      flex-direction: row;
      padding: 13px 0;
      .l {
        width: 50%;
        display: flex;
        flex-direction: column;
        label {
          font-size: 16px;
          color: #e0c4bd;
          font-weight: bold;
          line-height: 20px;
        }
        span {
          color: #797979;
          font-size: 13px;
          line-height: 15px;
        }
      }
      .r {
        width: 50%;
        display: flex;
        flex-direction: column;
        label {
          font-size: 16px;
          color: #efc6ff;
          font-weight: bold;
          line-height: 20px;
        }
        span {
          color: #797979;
          font-size: 13px;
          line-height: 15px;
        }
      }
    }
    .region {
      display: flex;
      clear: both;
      flex-direction: row;
      align-items: center;
      img {
        width: 14px;
      }
      span {
        font-size: 14px;
        color: #ffffff;
        line-height: 20px;
        margin-left: 5px;
      }
    }
    .region-info {
      width: calc(100% - 40px);
      display: flex;
      justify-content: space-between;
    }
  }
  .configuration {
    width: 573px;
    padding: 10px 0 0px;
    .gpu {
      font-size: 24px;
      color: #ffffff;
      line-height: 20px;
    }
    .graphicsCoprocessor {
      font-size: 14px;
      color: #d7ff65;
      background-image: url(/img/market/cpu.svg);
      background-size: 16px;
      background-repeat: no-repeat;
      background-position: left;
      text-indent: 20px;
      line-height: 40px;
    }
    .more {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      margin-top: 11px;
      .l {
        margin-right: 69px;
        label {
          display: block;
          font-size: 16px;
          line-height: 26px;
          color: #ffffff;
        }
        span {
          display: block;
          color: #797979;
          font-size: 13px;
          line-height: 13px;
        }
      }
    }
    .dura {
      color: #ffffff;
      font-size: 13px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      height: 40px;
      line-height: 40px;
      label {
        width: 200px;
      }
      span {
        width: 200px;
        text-indent: 20px;
        img {
          width: 11px;
        }
      }
      font {
        background-size: 10px;
        background-position: left;
        background-repeat: no-repeat;
        width: 200px;
        text-indent: 20px;
        position: relative;
        top: 0;
        img {
          width: 11px;
        }
      }
    }
  }
  .empty-box {
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      color: #6e6e6e;
      font-size: 14px;
    }
  }
`;
