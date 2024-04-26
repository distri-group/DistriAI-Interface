import { Select, Stack, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";

export default function Filter({ data, defaultValue, onFilter }) {
  const [filterValue, setFilterValue] = useState(defaultValue);
  const resetFilter = () => {
    setFilterValue(defaultValue);
  };
  useEffect(() => {
    onFilter(filterValue);
  }, [filterValue]);
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      style={{
        height: 48,
      }}>
      <span
        style={{
          fontWeight: 500,
          fontSize: 20,
          color: "white",
          lineHeight: 28,
        }}>
        Filter
      </span>
      {Object.entries(data).map(([key, value]) => (
        <Select
          key={key}
          value={filterValue[key]}
          onChange={(e) =>
            setFilterValue((prev) => ({ ...prev, [key]: e.target.value }))
          }>
          {value.map((item) => (
            <MenuItem key={item.value} value={item.value}>
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
          lineHeight: 26,
          textDecoration: "underline",
          cursor: "pointer",
        }}
        onClick={resetFilter}>
        Reset
      </span>
    </Stack>
  );
}
