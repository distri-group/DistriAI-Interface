import styled from "styled-components";
import { useEffect, useState, useCallback } from "react";
import { enqueueSnackbar } from "notistack";
import { getLikeList } from "@/services/model.js";
import {
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import ItemCard from "@/views/model&dataset/ItemCard";
import Pager from "@/components/pager.jsx";

function MyLike({ className }) {
  const wallet = useAnchorWallet();
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("model");
  const loadList = useCallback(async () => {
    setLoading(true);
    setList([]);
    setTotal(0);
    try {
      const res = await getLikeList(
        type,
        current,
        10,
        wallet?.publicKey.toString()
      );
      setList(res.List);
      setTotal(res.Total);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setLoading(false);
  }, [current, type, wallet]);
  useEffect(() => {
    if (wallet?.publicKey) {
      loadList();
    } else {
      setList([]);
      setTotal(0);
    }
  }, [wallet, loadList]);
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
      {/* <Filter
        data={filterData}
        defaultValue={{
          Name: "",
          OrderBy: "",
          Owner: wallet?.publicKey.toString(),
        }}
        onFilter={(value) => {
          setFilterValue(value);
          setCurrent(1);
        }}
        loading={loading}
      /> */}
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
