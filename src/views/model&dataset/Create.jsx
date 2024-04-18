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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MuiChipsInput } from "mui-chips-input";
import { licenses, frameworks, createModel } from "@/services/model.js";
import { useSnackbar } from "notistack";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { LoadingButton } from "@mui/lab";
import { CloudUpload } from "@mui/icons-material";
import { capitalize } from "lodash";
import { scales } from "@/services/dataset.js";
import prettyBytes from "pretty-bytes";
import { createDataset } from "@/services/dataset.js";
import useIpfs from "@/utils/useIpfs.js";

function Create({ className, type }) {
  document.title = `Create ${capitalize(type)}`;
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const { methods } = useIpfs();
  const { enqueueSnackbar } = useSnackbar();
  const [formValue, setFormValue] = useState({
    Name: "",
    License: "",
    Type1: "",
    Type2: "",
    Tags: [],
  });
  const [chips, setChips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [deployFile, setDeployFile] = useState(null);
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
      if (type === "model") {
        await createModel(
          {
            ...formValue,
            Tags: formValue.Tags.toString(),
          },
          wallet.publicKey.toString()
        );
      } else {
        await createDataset(
          {
            ...formValue,
            Tags: formValue.Tags.toString(),
          },
          wallet.publicKey.toString()
        );
      }
      if (selectedFile) {
        await methods.fileUpload(
          `/distri.ai/${type}/${wallet.publicKey.toString()}/${formValue.Name}`,
          selectedFile
        );
      } else {
        await methods.createFolder(
          `/distri.ai/${type}`,
          `${wallet.publicKey.toString()}/${formValue.Name}`
        );
      }
      if (deployFile) {
        await methods.fileUpload(
          `/distri.ai/${type}/${wallet.publicKey.toString()}/${
            formValue.Name
          }/deployment`,
          deployFile
        );
      }
      enqueueSnackbar(`Create ${type} success.`, { variant: "success" });
      setTimeout(() => {
        navigate(`/${type}`);
      }, 300);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setLoading(false);
  }
  useEffect(() => {
    if (type === "model") {
      setFormValue((prevState) => ({ ...prevState, Framework: "" }));
    } else {
      setFormValue((prevState) => ({ ...prevState, Scale: "" }));
    }
  }, [type]);
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
                name="Scale"
                defaultValue=""
                onChange={handleChange}
                fullWidth>
                {scales.map((scale, index) => (
                  <MenuItem key={scale} value={index + 1}>
                    {scale}
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
                onClick={(e) => (e.target.value = null)}
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
          {type === "model" && (
            <>
              <Grid item md={12}>
                <label>Deployment file(Optional)</label>
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
                    id="deployInput"
                    style={{ display: "none" }}
                    onClick={(e) => (e.target.value = null)}
                    onChange={(e) => setDeployFile(e.target.files[0])}
                  />
                </Button>
                {deployFile && (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    style={{ margin: "10px 0" }}>
                    <span>
                      <span>{deployFile.name}</span>
                      <span style={{ marginLeft: 20 }}>
                        {prettyBytes(deployFile.size)}
                      </span>
                    </span>
                    <Button
                      className="default-btn"
                      onClick={() => setDeployFile(null)}>
                      Clear
                    </Button>
                  </Stack>
                )}
              </Grid>
            </>
          )}
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
