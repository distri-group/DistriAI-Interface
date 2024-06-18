import {
  Button,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { getItemList, itemSize } from "../services/model";

export default function Test() {
  const [type, setType] = useState("model");
  const [itemList, setList] = useState([]);
  const [selectedItem, setItem] = useState("");
  const [size, setSize] = useState(0);
  const wallet = useAnchorWallet();
  const getList = async () => {
    try {
      const res = await getItemList(type, 1, 10, {
        Owner: wallet.publicKey.toString(),
      });
      setList(res.List);
    } catch (error) {
      console.error(error);
    }
  };
  const updateItemSize = async () => {
    try {
      const res = await itemSize(type, selectedItem, size, wallet);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getList();
  }, [type]);
  return (
    <Stack spacing={2}>
      <label>Update model & dataset size</label>
      <ToggleButtonGroup value={type} exclusive onChange={(e, v) => setType(v)}>
        <ToggleButton value="model">Model</ToggleButton>
        <ToggleButton value="dataset">Dataset</ToggleButton>
      </ToggleButtonGroup>
      <Select value={selectedItem} onChange={(e) => setItem(e.target.value)}>
        {itemList.map((item) => (
          <MenuItem key={item.Name} value={item.Name}>
            {item.Name}
          </MenuItem>
        ))}
      </Select>
      <OutlinedInput
        value={size}
        onChange={(e) => setSize(e.target.value)}
        type="number"
        placeholder="Size"
      />
      <Button onClick={updateItemSize}>Update</Button>
    </Stack>
  );
}
