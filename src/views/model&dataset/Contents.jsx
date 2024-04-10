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
import types from "../../services/types.json";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ItemCard from "./ItemCard";
import { getModelList } from "../../services/model";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import ConnectToWallet from "../../components/ConnectToWallet";
import Pager from "../../components/pager";
import { capitalize } from "lodash";
import { getDatasetList } from "../../services/dataset";

function Contents({ className, type }) {
  document.title = capitalize(type + "s");
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState({
    Name: "",
    OrderBy: "Updated Time",
  });
  const [filterType, setType] = useState("");
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [connectModal, setModal] = useState(false);
  const wallet = useAnchorWallet();
  let inputTimer;
  function onFilter(e) {
    const { name, value } = e.target;
    setFilterValue({ ...filterValue, [name]: value });
  }
  function clearFilter() {
    setFilterValue({ Name: "", OrderBy: "Updated Time" });
    setType("");
  }
  function onTypeFilter(e) {
    setType(e.target.value);
    setFilterValue({ ...filterValue, Type1: e.target.value });
  }
  async function loadList(current) {
    setLoading(true);
    let res;
    try {
      if (type === "model") {
        res = await getModelList(current, 10, filterValue);
      } else if (type === "dataset") {
        res = await getDatasetList(current, 10, filterValue);
      }
      setList(res.List);
      setTotal(res.Total);
    } catch (error) {}
    setLoading(false);
  }
  useEffect(() => {
    loadList(current);
    // eslint-disable-next-line
  }, [filterValue, current, type]);
  return (
    <div className={className}>
      <h1>{capitalize(type + "s")}</h1>
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
                if (wallet?.publicKey) navigate(`/${type}/add`);
                else setModal(true);
              }}
              className="cbtn">
              Create {capitalize(type)}
            </Button>
          </div>
          <div className="list">
            {loading ? (
              <div className="empty">
                <CircularProgress />
              </div>
            ) : list.length > 0 ? (
              <>
                {list.map((item) => (
                  <ItemCard item={item} key={item.Id} type={type} />
                ))}
                {total > 10 && (
                  <Pager
                    current={current}
                    total={total}
                    pageSize={10}
                    onChange={(page) => setCurrent(page)}
                    className="pager"
                  />
                )}
              </>
            ) : (
              <div className="empty">
                <p>No {type} found</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ConnectToWallet open={connectModal} />
    </div>
  );
}

export default styled(Contents)`
  width: 1200px;
  margin: 0 auto;
  h1 {
    padding-left: 40px;
    background-image: ${(props) => `url(/img/market/${props.type}.svg)`};
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
