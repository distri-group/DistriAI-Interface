import { AccountBalance, ArrowDownward, Favorite } from "@mui/icons-material";
import { Chip, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function ModelCard({ model, className }) {
  const navigate = useNavigate();
  return (
    <div
      className={className}
      onClick={() => {
        navigate(`/models/${model.Id}`);
      }}>
      <h3>{model.Name}</h3>
      <Stack direction="row" spacing={1} style={{ padding: 10 }}>
        <Chip color="success" size="small" label={model.type1} />
        {model.type1 !== "Others" && (
          <Chip
            size="small"
            variant="outlined"
            color="success"
            label={model.type2}
          />
        )}
        {model.Tags.map((tag) => (
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
          label={model.license}
        />
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="end"
        style={{ padding: 10 }}>
        <span>{new Date(model.CreatedAt).toLocaleString()}</span>
        <span>Distri.AI</span>
        <Stack direction="row" alignItems="end">
          <Favorite sx={{ width: 20, height: 20 }} />
          <span>1.2k</span>
        </Stack>
        <Stack direction="row" alignItems="end">
          <ArrowDownward sx={{ width: 20, height: 20 }} />
          <span>19k</span>
        </Stack>
      </Stack>
    </div>
  );
}

export default styled(ModelCard)`
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
