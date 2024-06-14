import styled from "styled-components";
import { useEffect, useState, useCallback } from "react";
import { enqueueSnackbar } from "notistack";
import { getItemList, filterData } from "@/services/model.js";
import { CircularProgress } from "@mui/material";
import ItemCard from "./ItemCard";
import Pager from "./Pager";
import Filter from "./Filter";

function ItemList({ className, type }) {
  const [list, setList] = useState([]);
  const [filterValue, setFilterValue] = useState({
    Name: "",
    OrderBy: "Updated Time",
  });
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getItemList(type, current, 10, filterValue);
      setList(res.List);
      setTotal(res.Total);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setLoading(false);
  }, [current, filterValue, type]);
  useEffect(() => {
    loadList();
  }, [current, filterValue, type, loadList]);
  return (
    <div className={className}>
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
              <ItemCard
                item={item}
                className="item"
                key={item.Id}
                type={type}
              />
            ))}
            {total > 10 && (
              <Pager
                current={current}
                total={total}
                pageSize={10}
                onChange={(page) => setCurrent(page)}
                className="Pager"
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
export default styled(ItemList)`
  .empty {
    width: 100%;
    height: 480px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .item:first-child {
    margin: 0 0 24px 0;
    border-radius: 0;
  }
`;
