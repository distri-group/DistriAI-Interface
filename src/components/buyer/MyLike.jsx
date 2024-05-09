import styled from "styled-components";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { getLikeList, filterData } from "@/services/model.js";
import {
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import ItemCard from "@/views/model&dataset/ItemCard";
import Pager from "@/components/pager.jsx";
import Filter from "../Filter";

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
  async function loadList(current) {
    setLoading(true);
    setList([]);
    setTotal(0);
    try {
      const res = await getLikeList(type, wallet?.publicKey.toString());
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
  }, [current, filterValue, type]);
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
      <Filter
        data={filterData}
        defaultValue={{
          Name: "",
          OrderBy: "Updated Time",
          Owner: wallet?.publicKey.toString(),
        }}
        onFilter={(value) => {
          setFilterValue(value);
          setCurrent(1);
        }}
        loading={loading}
      />
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

export default styled(MyLike)`
  .empty {
    width: 100%;
    height: 480px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
