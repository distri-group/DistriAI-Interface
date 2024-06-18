import { Select, Stack, MenuItem, TextField } from "@mui/material";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";

export default function Filter({
  data,
  defaultValue,
  onFilter,
  search,
  loading,
  style,
}) {
  const [filterValue, setFilterValue] = useState(defaultValue);
  const initialRender = useRef(true);
  const resetFilter = () => {
    setFilterValue(defaultValue);
  };
  const handleInput = debounce((key, value) => {
    setFilterValue((prev) => ({ ...prev, [key]: value }));
  }, 500);
  useEffect(() => {
    if (!initialRender.current) {
      onFilter(filterValue);
    } else {
      initialRender.current = false;
    }
    // eslint-disable-next-line
  }, [filterValue]);
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      style={
        style ?? {
          height: 48,
          padding: "24px 40px",
          background: "rgba(149, 157, 165, 0.16)",
          borderTopRightRadius: 12,
        }
      }>
      <span
        style={{
          fontWeight: 500,
          fontSize: 20,
          color: "white",
          lineHeight: "28px",
        }}>
        Filter
      </span>
      {search && (
        <TextField
          name={search.key}
          placeholder={`Search By ${search.key}`}
          onChange={(e) => handleInput(search.key, e.target.value)}
          disabled={loading}
        />
      )}
      {Object.entries(data).map(([key, value]) => (
        <Select
          key={key}
          value={filterValue[key]}
          style={{
            width: 240,
          }}
          onChange={(e) =>
            setFilterValue((prev) => ({ ...prev, [key]: e.target.value }))
          }
          disabled={loading}>
          {value.map((item) => (
            <MenuItem key={item.label} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      ))}
      <span
        style={{
          fontWeight: 400,
          fontSize: 18,
          color: "#09E98D",
          lineHeight: "26px",
          textDecoration: "underline",
          cursor: "pointer",
        }}
        onClick={resetFilter}>
        Reset
      </span>
    </Stack>
  );
}
