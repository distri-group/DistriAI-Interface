import {
  AccessTimeFilled,
  AccountBalance,
  ArrowDownward,
  Favorite,
} from "@mui/icons-material";
import { Chip, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function ItemCard({ item, className, type }) {
  const navigate = useNavigate();
  return (
    <div
      className={className}
      onClick={() => {
        navigate(`/${type}/${item.Owner}/${item.Name}`);
      }}>
      <h3>{item.Name}</h3>
      <div style={{ padding: 24 }}>
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
        <Stack
          direction="row"
          spacing={2}
          justifyContent="end"
          style={{ padding: 10, color: "#898989" }}>
          <Stack direction="row" alignItems="end" spacing={1}>
            <AccessTimeFilled />
            <span>{new Date(item.CreatedAt).toLocaleString()}</span>
          </Stack>
          <Stack direction="row" alignItems="end" spacing={1}>
            <Favorite sx={{ width: 20, height: 20 }} />
            <span>{item.likes}</span>
          </Stack>
          <Stack direction="row" alignItems="end" spacing={1}>
            <ArrowDownward sx={{ width: 20, height: 20 }} />
            <span>{item.downloads}</span>
          </Stack>
        </Stack>
      </div>
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
  cursor: pointer;
  h3 {
    background: rgba(149, 157, 165, 0.16);
    margin: 0;
    padding: 0 24px;
    height: 64px;
    font-weight: 500;
    font-size: 20px;
    color: #ffffff;
    line-height: 64px;
  }
`;
