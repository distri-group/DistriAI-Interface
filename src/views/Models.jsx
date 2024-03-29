import {
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import types from "../services/types.json";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ModelCard from "../components/ModelCard";
import { getModelList } from "../services/model";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import ConnectToWallet from "../components/ConnectToWallet";

function Models({ className }) {
  document.title = "Models";
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState({
    Name: "",
    OrderBy: "Updated Time",
  });
  const [filterType, setType] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectModal, setConnectModal] = useState(false);
  const wallet = useAnchorWallet();
  let inputTimer;
  const onFilter = (e) => {
    const { name, value } = e.target;
    setFilterValue({ ...filterValue, [name]: value });
  };
  const clearFilter = () => {
    setFilterValue({ Name: "", OrderBy: "Updated Time" });
    setType("");
  };
  const onTypeFilter = (e) => {
    setType(e.target.value);
    setFilterValue({ ...filterValue, Type1: e.target.value });
  };
  const loadList = async () => {
    setLoading(true);
    const res = await getModelList(1, filterValue);
    setList(res.list);
    setLoading(false);
  };
  useEffect(() => {
    loadList();
  }, [filterValue]);
  return (
    <div className={className}>
      <h1>Models</h1>
      <div className="container">
        <div className="left">
          <Select
            sx={{
              width: "100%",
            }}
            value={filterType}
            onChange={onTypeFilter}>
            {types.map((type, index) => (
              <MenuItem key={type.title} value={index + 1}>
                {type.title}
              </MenuItem>
            ))}
          </Select>
          {filterType ? (
            <div>
              <h2>{types[filterType - 1].title}</h2>
              <div>
                {types[filterType - 1].items.map((item, index) => (
                  <Chip
                    sx={{
                      margin: "2px",
                    }}
                    color="success"
                    label={item}
                    key={item}
                    onClick={() =>
                      setFilterValue((prevState) => ({
                        ...prevState,
                        Type2: index + 1,
                      }))
                    }
                  />
                ))}
              </div>
            </div>
          ) : (
            types.map((type, index) => (
              <div key={type.title}>
                <h2>{type.title}</h2>
                <div>
                  {type.items.map((item, itemIndex) => (
                    <Chip
                      key={item}
                      sx={{
                        margin: "2px",
                      }}
                      color="success"
                      label={item}
                      onClick={() => {
                        setType(index + 1);
                        setFilterValue((prevState) => ({
                          ...prevState,
                          Type1: index + 1,
                          Type2: itemIndex + 1,
                        }));
                      }}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="right">
          <div className="container">
            <Stack direction="row" alignItems="end" spacing={2}>
              <span>Filter</span>
              <TextField
                onChange={(e) => {
                  clearTimeout(inputTimer);
                  inputTimer = setTimeout(() => {
                    onFilter(e);
                  }, 1000);
                }}
                name="Name"
                size="small"
                placeholder="Search By Name"
                style={{ width: 200 }}
              />
              <Select
                defaultValue="Updated Time"
                value={filterValue.sort}
                onChange={onFilter}
                name="sort"
                style={{
                  height: 40,
                }}>
                {sorts.map((sort) => (
                  <MenuItem key={sort} value={sort}>
                    {sort}
                  </MenuItem>
                ))}
              </Select>
              <span className="reset" onClick={clearFilter}>
                reset
              </span>
            </Stack>
            <Button
              onClick={() => {
                if (wallet?.publicKey) navigate("/models/create");
                else setConnectModal(true);
              }}
              className="cbtn">
              Create Model
            </Button>
          </div>
          <div className="list">
            {loading ? (
              <div className="empty">
                <CircularProgress />
              </div>
            ) : list.length > 0 ? (
              list.map((model) => <ModelCard model={model} key={model.Id} />)
            ) : (
              <div className="empty">
                <p>No model found</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ConnectToWallet
        modal={connectModal}
        onClose={() => setConnectModal(false)}
      />
    </div>
  );
}

export default styled(Models)`
  width: 1200px;
  margin: 0 auto;
  h1 {
    padding-left: 40px;
    background-image: url(/img/market/model.svg);
    background-size: 28px;
    background-position: left;
    background-repeat: no-repeat;
  }
  .container {
    display: flex;
    justify-content: space-between;
    .left {
      width: 250px;
      h2 {
        font-size: 20px;
      }
    }
    .right {
      width: 800px;
    }
  }
  .reset {
    text-decoration: underline;
    font-size: 18px;
    cursor: pointer;
  }
  .empty {
    width: 100%;
    margin: 12px 0;
    padding: 36px 0;
    background-color: #1a1a1a;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      text-align: center;
      color: #aaa;
    }
  }
`;
const sorts = ["Updated Time", "Likes", "Downloads"];
