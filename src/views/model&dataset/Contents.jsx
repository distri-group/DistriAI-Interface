import {
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import types from "@/services/types.json";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ItemCard from "./ItemCard.jsx";
import { getItemList, filterData } from "@/services/model.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import ConnectToWallet from "@/components/ConnectToWallet.jsx";
import Pager from "@/components/pager.jsx";
import { capitalize } from "lodash";
import Filter from "@/components/Filter.jsx";
import { useClearCache } from "@/components/ClearCacheProvider.jsx";
import { useSnackbar } from "notistack";

function Contents({ className, type }) {
  document.title = capitalize(`${type}s`);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState({
    Name: "",
    OrderBy: "Updated Time",
  });
  const [filterType, setType] = useState(0);
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [connectModal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const wallet = useAnchorWallet();
  const inputTimer = useRef(null);
  const { clearCache } = useClearCache();
  const { enqueueSnackbar } = useSnackbar();
  const chipStyle = {
    borderRadius: "8px",
    margin: "6px",
    background: "rgba(39,206,181,0.16)",
    border: "1px solid #09E98D",
    color: "#fff",
  };
  function onTypeFilter(e) {
    setType(e.target.value);
    setFilterValue({ ...filterValue, Type1: e.target.value });
  }
  async function loadList() {
    setLoading(true);
    setList([]);
    setTotal(0);
    try {
      const res = await getItemList(type, current, 10, filterValue);
      setList(res.List);
      setTotal(res.Total);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setLoading(false);
  }
  useEffect(() => {
    const currentName = filterValue.Name;
    if (search !== currentName) {
      clearTimeout(inputTimer.current);
      inputTimer.current = setTimeout(() => {
        loadList();
        setSearch(currentName);
      }, 1000);
    } else {
      loadList();
    }

    return () => clearTimeout(inputTimer.current);
    // eslint-disable-next-line
  }, [current, type, filterValue]);
  return (
    <div className={className}>
      <h1>{capitalize(`${type}s`)}</h1>
      <div className="container">
        <div className="left">
          <Select
            sx={{
              width: "100%",
            }}
            defaultValue={0}
            value={filterType}
            onChange={onTypeFilter}>
            <MenuItem value={0}>Any type</MenuItem>
            {types.map((type, index) => (
              <MenuItem key={type.title} value={index + 1}>
                {type.title}
              </MenuItem>
            ))}
          </Select>
          {filterType ? (
            <div className="types">
              <h2>{types[filterType - 1].title}</h2>
              <div>
                {types[filterType - 1].items.map((item, index) => (
                  <Chip
                    variant="outlined"
                    sx={chipStyle}
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
              <div className="types" key={type.title}>
                <h2>{type.title}</h2>
                <div>
                  {type.items.map((item, itemIndex) => (
                    <Chip
                      key={item}
                      sx={chipStyle}
                      variant="outlined"
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
            <Filter
              data={filterData}
              defaultValue={{
                Name: "",
                OrderBy: "all",
              }}
              onFilter={(value) => {
                setFilterValue(value);
                setCurrent(1);
              }}
              search={{ key: "Name" }}
              loading={loading}
              style={{
                marginBottom: 24,
              }}
            />
            <Button
              onClick={() => {
                if (wallet?.publicKey) {
                  clearCache();
                  navigate(`/${type}/add`);
                } else setModal(true);
              }}
              style={{ width: 160 }}
              className="cbtn">
              <span>Create {capitalize(type)}</span>
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
                  <ItemCard
                    item={item}
                    key={`${item.Owner}/${item.Name}`}
                    type={type}
                  />
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
      <ConnectToWallet open={connectModal} onClose={() => setModal(false)} />
    </div>
  );
}

export default styled(Contents)`
  h1 {
    font-weight: 600;
    font-size: 32px;
    line-height: 44px;
  }
  .container {
    display: flex;
    justify-content: space-between;
    .left {
      width: 340px;
      h2 {
        font-size: 20px;
      }
    }
    .right {
      width: 1200px;
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
  .types {
    h2 {
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
      margin: 24px 0 16px 0;
    }
  }
`;
