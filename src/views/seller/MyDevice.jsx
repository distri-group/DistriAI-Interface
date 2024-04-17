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
            width: 1000,
            bgcolor: "#00000b",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            color: "#fff",
          }}>
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
          <LoadingButton
            loading={canceling}
            style={{
              width: 100,
              margin: "0 auto",
              display: "block",
              marginTop: "150px",
            }}
            onClick={handleCancel}
            className="cbtn">
            {!canceling && "Confirm"}
          </LoadingButton>
        </Box>
      </Modal>
    </div>
  );
}

export default styled(MyDevice)`
  .con {
    width: 100%;
    .title {
      font-weight: 700;
      font-style: normal;
      font-size: 28px;
      color: #ffffff;
      padding-left: 36px;
      background-image: url(/img/market/seller.png);
      background-repeat: no-repeat;
      background-size: 32px;
      background-position: left;
      margin-top: 25px;
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
