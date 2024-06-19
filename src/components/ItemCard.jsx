import { AccountBalance } from "@mui/icons-material";
import { Button, Chip, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { itemPublish } from "../services/model";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useSnackbar } from "notistack";
import { useState } from "react";

function ItemCard({ item, className, type, onReload }) {
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  const isExaming = item.Status === 1;
  const isPublished = item.Status === 2;
  const [loading, setLoading] = useState(false);
  const handlePublish = async () => {
    setLoading(true);
    try {
      await itemPublish(type, item.Name, !isPublished, wallet);
      enqueueSnackbar(`${isPublished ? "Unlist" : "Publish"} ${type} success`, {
        variant: "success",
      });
      onReload();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setLoading(false);
  };
  return (
    <div className={className}>
      <h3>
        <span
          onClick={() => {
            navigate(`/${type}/${item.Owner}/${item.Name}`);
          }}>
          {item.Name}
        </span>
      </h3>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        style={{ padding: 24 }}>
        <Stack spacing={2} style={{ width: "30%" }}>
          <Stack direction="row" spacing={2}>
            <Chip color="warning" label={item.framework || item.scale} />
            <Chip color="success" label={item.type1} />
            {item.type1 !== "Others" && (
              <Chip variant="outlined" color="success" label={item.type2} />
            )}
            {item.Tags &&
              item.Tags.map((tag) => (
                <Chip
                  color="primary"
                  label={tag}
                  key={tag}
                  style={{ minWidth: 50 }}
                />
              ))}
            <Chip
              avatar={
                <AccountBalance
                  style={{ background: "transparent", color: "white" }}
                />
              }
              color="info"
              label={item.license}
            />
          </Stack>
          <Stack direction="row" spacing={2} style={{ color: "#898989" }}>
            <span>Created at {new Date(item.CreateTime).toLocaleString()}</span>
          </Stack>
        </Stack>
        {onReload && (
          <>
            {isPublished ? (
              <>
                <span className="item-status Publish">On sale</span>
                <LoadingButton
                  loading={loading}
                  onClick={handlePublish}
                  className="unlist"
                  style={{ width: 100 }}>
                  {!loading && "Unlist"}
                </LoadingButton>
              </>
            ) : (
              <>
                <span className="item-status Private">In draft</span>
                {isExaming ? (
                  <Button className="disabled" style={{ width: 100 }} disabled>
                    Examing
                  </Button>
                ) : (
                  <>
                    {item.Reason && (
                      <span className="failed">{item.Reason}</span>
                    )}
                    <LoadingButton
                      loading={loading}
                      onClick={handlePublish}
                      className="cbtn"
                      style={{ width: 100 }}>
                      {!loading && "Publish"}
                    </LoadingButton>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Stack>
    </div>
  );
}

export default styled(ItemCard)`
  width: 100%;
  background: transparent;
  margin: 24px 0;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #898989;
  overflow: hidden;
  h3 {
    background: rgba(149, 157, 165, 0.16);
    margin: 0;
    padding: 0 24px;
    height: 64px;
    font-weight: 500;
    font-size: 20px;
    color: #ffffff;
    line-height: 64px;
    span {
      cursor: pointer;
    }
  }
  .item-status {
    display: block;
    padding: 6px 0;
    width: 120px;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid #898989;
  }
  .Publish {
    border-color: #1bce58;
    color: #1bce58;
  }
  .Private {
    border-color: #ce1ba1;
    color: #ce1ba4;
  }
  .unlist {
    height: 48px;
    background: #ff6073;
    color: white;
  }
  .disabled {
    height: 48px;
    background-color: rgba(70, 70, 70, 1);
  }
  .failed {
    color: #ff6073;
  }
`;
