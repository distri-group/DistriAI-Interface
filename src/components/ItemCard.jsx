import { AccountBalance } from "@mui/icons-material";
import { Chip, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { itemPublish } from "../services/model";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useSnackbar } from "notistack";

function ItemCard({ item, className, type, onReload }) {
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  const handlePublish = async () => {
    try {
      await itemPublish(type, item.Name, !item.Public, wallet);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
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
            <span className="item-status">In draft</span>
            <LoadingButton
              onClick={handlePublish}
              className="cbtn"
              style={{ width: 100 }}>
              Publish
            </LoadingButton>
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
    padding: 6px 36px;
    box-sizing: border-box;
    border: 1px solid #898989;
  }
`;
