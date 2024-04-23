import styled from "styled-components";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { getModelList } from "@/services/model.js";
import { getDatasetList } from "@/services/dataset.js";
import {
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import ItemCard from "@/views/model&dataset/ItemCard";
import Pager from "@/components/pager.jsx";

function MyLike({ className }) {
  const wallet = useAnchorWallet();
  const [list, setList] = useState([]);
  const [filterValue, setFilterValue] = useState({
    Name: "",
    OrderBy: "Updated Time",
    Owner: wallet?.publicKey.toString(),
  });
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("model");
  function onFilter(e) {
    const { name, value } = e.target;
    setFilterValue({ ...filterValue, [name]: value });
  }
  function clearFilter() {
    setFilterValue({
      Name: "",
      OrderBy: "Updated Time",
      Owner: wallet?.publicKey.toString(),
    });
  }
  async function loadList(current) {
    setLoading(true);
    setList([]);
    setTotal(0);
    let res;
    try {
      if (type === "model") {
        res = await getModelList(current, 10, filterValue);
      } else {
        res = await getDatasetList(current, 10, filterValue);
      }
      setList(res.List);
      setTotal(res.Total);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setLoading(false);
  }
  useEffect(() => {
    loadList(current);
    // eslint-disable-next-line
  }, [current, filterValue]);
  useEffect(() => {
    if (current !== 1) {
      setCurrent(1);
    } else {
      loadList(current);
    }
    // eslint-disable-next-line
  }, [type]);
  return (
    <div className={className}>
      <ToggleButtonGroup
        sx={{ paddingBottom: 2 }}
        disabled={loading}
        exclusive
        value={type}
        onChange={(e, type) => setType(type)}>
        <Stack direction="row" spacing={2}>
          <ToggleButton value="model" sx={{ width: 100, padding: "4px" }}>
            Model
          </ToggleButton>
          <ToggleButton value="dataset" sx={{ width: 100, padding: "4px" }}>
            Dataset
          </ToggleButton>
        </Stack>
      </ToggleButtonGroup>
      <Stack direction="row" alignItems="end" spacing={2}>
        <span>Filter</span>
        <TextField
          onChange={onFilter}
          value={filterValue.Name}
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
  );
}

export default styled(MyLike)``;
const sorts = ["Updated Time", "Likes", "Downloads"];
