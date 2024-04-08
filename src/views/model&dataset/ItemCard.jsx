import { AccountBalance, ArrowDownward, Favorite } from "@mui/icons-material";
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
      <Stack direction="row" spacing={1} style={{ padding: 10 }}>
        <Chip
          color="warning"
          size="small"
          label={item.framework || item.size}
        />
        <Chip color="success" size="small" label={item.type1} />
        {item.type1 !== "Others" && (
          <Chip
            size="small"
            variant="outlined"
            color="success"
            label={item.type2}
          />
        )}
        {item.Tags &&
          item.Tags.map((tag) => (
            <Chip
              color="primary"
              size="small"
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
          size="small"
          label={item.license}
        />
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="end"
        style={{ padding: 10 }}>
        <span>{new Date(item.CreatedAt).toLocaleString()}</span>
        <span>Distri.AI</span>
        <Stack direction="row" alignItems="end">
          <Favorite sx={{ width: 20, height: 20 }} />
          <span>{item.likes}</span>
        </Stack>
        <Stack direction="row" alignItems="end">
          <ArrowDownward sx={{ width: 20, height: 20 }} />
          <span>{item.downloads}</span>
        </Stack>
      </Stack>
    </div>
  );
}

export default styled(ItemCard)`
  width: 100%;
  background-color: #1a1a1a;
  margin: 6px 0;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  h3 {
    background-color: #121212;
    margin: 0;
    line-height: 56px;
    padding: 0 20px;
  }
`;
