import styled from "styled-components";
import { useState, useEffect } from "react";
import { getMachineList } from "@/services/machine.js";
import DeviceList from "@/components/DeviceList.jsx";
import Pager from "@/components/pager.jsx";
import { useSnackbar } from "notistack";
import { Modal, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useSolanaMethod from "@/utils/useSolanaMethod.js";

function MyDevice({ className }) {
  document.title = "Market";
  const { wallet, methods } = useSolanaMethod();
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deviceToCancel, setDeviceToCancel] = useState(null);
  const [canceling, setCanceling] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Load Machine List
  async function loadList(curr) {
    setLoading(true);
    try {
      const res = await getMachineList(
        curr,
        10,
        [],
        wallet.publicKey.toString()
      );
      setList(res.List);
      setTotal(res.Total);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setLoading(false);
  }

  // Cancel Offer
  async function handleCancel() {
    setCanceling(true);
    try {
      await methods.cancelOffer(deviceToCancel.Uuid);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setTimeout(() => {
      setDeviceToCancel(null);
      setCanceling(false);
      loadList(current);
    }, 500);
  }

  // Reload List
  useEffect(() => {
    if (current && wallet?.publicKey) {
      loadList(current);
    }
    // eslint-disable-next-line
  }, [current, wallet]);

  return (
    <div className={className}>
      <div className="con">
        <h1 className="title">Share My Device</h1>
        <div className="con-table">
          <DeviceList
            list={list}
            loading={loading}
            onCancel={(device) => setDeviceToCancel(device)}
          />
          {total > 10 && (
            <Pager
              current={current}
              total={total}
              pageSize={10}
              onChange={(page) => setCurrent(page)}
              className="pager"
            />
          )}
        </div>
      </div>
      <Modal
        open={Boolean(deviceToCancel)}
        onClose={() => {
          if (!canceling) {
            setDeviceToCancel(null);
          }
        }}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 1600,
            background: "#20192d",
            boxShadow: 24,
            p: 10,
            borderRadius: "8px",
            color: "#fff",
          }}>
          <h1
            style={{
              fontWeight: 600,
              fontSize: 32,
              lineHeight: "44px",
              textAlign: "center",
              margin: 0,
              marginBottom: 24,
            }}>
            Unlist The Offer
          </h1>
          <div
            style={{
              fontWeight: 400,
              fontSize: 18,
              color: "#959DA5",
              lineHeight: "28px",
              textAlign: "center",
            }}>
            <p style={{ margin: 0 }}>This will cancel your listing.</p>
            <p style={{ margin: "12px 0" }}>
              You will also be asked to confirm this cancelation from your
              wallet.
            </p>
          </div>
          <LoadingButton
            loading={canceling}
            style={{
              width: 160,
              margin: "0 auto",
              display: "block",
              marginTop: "64px",
            }}
            onClick={handleCancel}
            className="cbtn">
            <span
              style={{
                fontWeight: 500,
                fontSize: 18,
                lineHeight: "26px",
              }}>
              {!canceling && <span>Confirm</span>}
            </span>
          </LoadingButton>
        </Box>
      </Modal>
    </div>
  );
}

export default styled(MyDevice)`
  .con {
    .title {
      font-weight: 600;
      font-size: 32px;
      line-height: 44px;
      margin: 0;
    }
    .filter {
      padding: 11px 0;
      display: flex;
      flex-direction: row;
      line-height: 30px;
      .txt {
        font-size: 14px;
        line-height: 30px;
        height: 30px;
        display: block;
      }
      .sel {
        padding: 0px 7px;
      }
      .btn-txt {
        font-weight: 700;
        font-size: 14px;
        text-decoration: underline;
        color: #ffffff;
        cursor: pointer;
      }
    }
  }
  .block {
    display: block;
    overflow: hidden;
  }
`;
