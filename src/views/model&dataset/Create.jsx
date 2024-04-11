import {
  Select,
  TextField,
  Button,
  Grid,
  MenuItem,
  Stack,
} from "@mui/material";
import styled from "styled-components";
import types from "@/services/types.json";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MuiChipsInput } from "mui-chips-input";
import { licenses, frameworks, createModel } from "@/services/model.js";
import { useSnackbar } from "notistack";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { LoadingButton } from "@mui/lab";
import { CloudUpload } from "@mui/icons-material";
import { capitalize } from "lodash";
import { sizes } from "@/services/dataset.js";
import prettyBytes from "pretty-bytes";

function Create({ className, type }) {
  document.title = `Create ${capitalize(type)}`;
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const { enqueueSnackbar } = useSnackbar();
  const [formValue, setFormValue] = useState({
    Name: "",
    Framework: "",
    License: "",
    Type1: "",
    Type2: "",
    Tags: [],
  });
  const [chips, setChips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  function handleChange(e) {
    const { name, value } = e.target;
    setFormValue((prevState) => ({ ...prevState, [name]: value }));
  }
  function handleChipsChange(newChips) {
    const uniqueArr = Array.from(new Set(newChips));
    setChips(uniqueArr);
    setFormValue((prevState) => ({ ...prevState, Tags: newChips }));
  }
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createModel(
        {
          ...formValue,
          Tags: formValue.Tags.toString(),
        },
        wallet.publicKey.toString()
      );
      if (res.Msg === "success") {
        enqueueSnackbar(`Create ${type} success.`, { variant: "success" });
        setTimeout(() => {
          navigate(`/${type}`);
        }, 300);
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }
  return (
    <div className={className}>
      <h1>Create a new {type}</h1>
      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <label>{capitalize(type)} name</label>
          </Grid>
          <Grid item md={12}>
            <TextField
              required
              name="Name"
              placeholder="Maximum 50 characters"
              onChange={handleChange}
            />
          </Grid>
          <Grid item md={6}>
            <label>{type === "model" ? "Frameworks" : "Dataset size"}</label>
          </Grid>
          <Grid item md={6}>
            <label>License</label>
          </Grid>
          <Grid item md={6}>
            {type === "model" ? (
              <Select
                name="Framework"
                defaultValue=""
                onChange={handleChange}
                fullWidth>
                {frameworks.map((framework, index) => (
                  <MenuItem key={framework} value={index + 1}>
                    {framework}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <Select
                name="Size"
                defaultValue=""
                onChange={handleChange}
                fullWidth>
                {sizes.map((size, index) => (
                  <MenuItem key={size} value={index + 1}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Grid>
          <Grid item md={6}>
            <Select
              name="License"
              defaultValue=""
              onChange={handleChange}
              fullWidth>
              {licenses.map((license, index) => (
                <MenuItem key={license} value={index + 1}>
                  {license}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item md={12}>
            <label>{capitalize(type)} tag</label>
          </Grid>
          <Grid item md={6}>
            <Select
              name="Type1"
              defaultValue=""
              onChange={handleChange}
              fullWidth>
              {types.map((type, index) => (
                <MenuItem key={type.title} value={index + 1}>
                  {type.title}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item md={6}>
            <Select
              name="Type2"
              defaultValue=""
              disabled={!formValue.Type1}
              onChange={handleChange}
              fullWidth>
              {formValue.Type1 &&
                types[formValue.Type1 - 1].items.map((item, index) => (
                  <MenuItem key={item} value={index + 1}>
                    {item}
                  </MenuItem>
                ))}
            </Select>
          </Grid>
          <Grid item md={12}>
            <label>Other Tags</label>
          </Grid>
          <Grid item md={12}>
            <MuiChipsInput
              renderChip={(Component, key, props) => (
                <Component {...props} key={key} color="success" />
              )}
              value={chips}
              onChange={handleChipsChange}
            />
          </Grid>
          <Grid item md={12}>
            <label>Readme</label>
          </Grid>
          <Grid item md={12}>
            <Button
              className="default-btn"
              style={{ display: "inline-flex" }}
              component="label"
              role={undefined}
              tabIndex={-1}
              startIcon={<CloudUpload />}>
              Select file
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </Button>
            {selectedFile && (
              <Stack
                direction="row"
                justifyContent="space-between"
                style={{ margin: "10px 0" }}>
                <span>
                  {selectedFile.name === "README.md" ? (
                    <>
                      <span>README.md</span>
                      <span style={{ marginLeft: 20 }}>
                        {prettyBytes(selectedFile.size)}
                      </span>
                    </>
                  ) : (
                    "Not README.md.Please upload again."
                  )}
                </span>
                <Button
                  className="default-btn"
                  onClick={() => setSelectedFile(null)}>
                  Clear
                </Button>
              </Stack>
            )}
          </Grid>
          <Grid item md={8} />
          <Grid item md={4}>
            <Stack spacing={2} direction="row">
              <LoadingButton
                loading={loading}
                style={{ width: 100 }}
                className="cbtn"
                type="submit">
                {!loading && "Submit"}
              </LoadingButton>
              <Button
                disabled={loading}
                style={{ width: 100 }}
                className="cbtn"
                onClick={() => {
                  setFormValue({});
                  navigate(`/${type}`);
                }}>
                Cancel
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default styled(Create)`
  width: 1200px;
  margin: 0 auto;
  form {
    width: 50%;
  }
  label {
    display: block;
  }
  .right {
    display: flex;
    justify-content: right;
  }
`;
