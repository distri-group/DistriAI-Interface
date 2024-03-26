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
    console.log(res.list);
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
            types.map((type) => (
              <div key={type.title}>
                <h2>{type.title}</h2>
                <div>
                  {type.items.map((item) => (
                    <Chip
                      key={item}
                      sx={{
                        margin: "2px",
                      }}
                      color="success"
                      label={item}
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
                value={filterValue.Name}
                onChange={onFilter}
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
            <Button onClick={() => navigate("/models/create")} className="cbtn">
              Create Model
            </Button>
          </div>
          <div className="list">
            {loading ? (
              <CircularProgress />
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
  .empty {
    width: 100%;
    margin: 12px 0;
    padding: 36px 0;
    background-color: #1a1a1a;
    border-radius: 15px;
    p {
      text-align: center;
      color: #aaa;
    }
  }
`;
const sorts = ["Updated Time", "Likes", "Downloads"];
// const models = [
//   {
//     id: 1,
//     name: "google/gemma-7b",
//     tags: ["Text Generation", "JAX", "gemma-terms-of-use", "transformers"],
//     time: "2024.3.12",
//     like: "1.9k",
//     download: "12k",
//   },
//   {
//     id: 2,
//     name: "mistralai/Mixtral-8x7B-Instruct-v0.1",
//     tags: [
//       "Text Generation",
//       "PyTorch",
//       "apache-2.0",
//       "5 languages",
//       "conversational",
//     ],
//     time: "2024.3.12",
//     like: "2.9k",
//     download: "25k",
//   },
//   {
//     id: 3,
//     name: "ByteDance/SDXL-Lightning",
//     tags: [
//       "Text-to-Image",
//       "PyTorch",
//       "openrail++",
//       "Diffusers",
//       "stable-diffusion",
//     ],
//     time: "2024.2.29",
//     like: "2.0k",
//     download: "22k",
//   },
//   {
//     id: 4,
//     name: "meta-llama/Llama-2-7b-chat-hf",
//     tags: [
//       "Text Generation",
//       "PyTorch",
//       "other",
//       "llama",
//       "facebook",
//       "llama-2",
//       "English",
//     ],
//     time: "2024.2.28",
//     like: "2.3k",
//     download: "20k",
//   },
//   {
//     id: 5,
//     name: "stabilityai/stable-diffusion-xl-base-1.0",
//     tags: [
//       "Text-to-Image",
//       "PyTorch",
//       "openrail++",
//       "Diffusers",
//       "ONNX",
//       "stable-diffusion",
//     ],
//     time: "2024.2.12",
//     like: "1.6k",
//     download: "10k",
//   },
// ];
