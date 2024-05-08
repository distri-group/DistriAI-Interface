import {
  Select,
  TextField,
  Button,
  Grid,
  MenuItem,
  Stack,
  FormHelperText,
} from "@mui/material";
import styled from "styled-components";
import types from "@/services/types.json";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MuiChipsInput } from "mui-chips-input";
import { licenses, frameworks, scales } from "@/services/model.js";
import { useSnackbar } from "notistack";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { LoadingButton } from "@mui/lab";
import { capitalize } from "lodash";
import useIpfs from "@/utils/useIpfs.js";
import useSolanaMethod from "@/utils/useSolanaMethod";
import { useKeepAliveContext } from "keepalive-for-react";

function Create({ className, type }) {
  document.title = `Create ${capitalize(type)}`;
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const { methods: solanaMethods } = useSolanaMethod();
  const { methods } = useIpfs();
  const { destroy } = useKeepAliveContext();
  const { enqueueSnackbar } = useSnackbar();
  const [formValue, setFormValue] = useState({
    Name: "",
    License: 0,
    Type1: 0,
    Type2: 0,
    Tags: [],
  });
  const [validateError, setValidateError] = useState({
    Framework: null,
    Scale: null,
    Name: null,
    License: null,
    Type1: null,
    Type2: null,
  });
  const [chips, setChips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [deployFile, setDeployFile] = useState(null);
  const readmeRef = useRef(null);
  const deployRef = useRef(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValue((prevState) => ({ ...prevState, [name]: value }));
    switch (name) {
      case "Name":
        if (value.length <= 0) {
          return setValidateError((prevState) => ({
            ...prevState,
            Name: `Please input ${type} name`,
          }));
        }
        if (value.length > 100) {
          return setValidateError((prevState) => ({
            ...prevState,
            Name: `${type} name should no longer than 100 words`,
          }));
        }
        return setValidateError((prevState) => ({
          ...prevState,
          Name: null,
        }));
      case "Framework":
      case "Scale":
      case "License":
      case "Type1":
      case "Type2":
        if (value) {
          return setValidateError((prevState) => ({
            ...prevState,
            [name]: null,
          }));
        }
        break;
      default:
        break;
    }
  }
  function handleChipsChange(newChips) {
    const uniqueArr = Array.from(new Set(newChips));
    setChips(uniqueArr);
    setFormValue((prevState) => ({ ...prevState, Tags: newChips }));
  }
  async function onSubmit(e) {
    e.preventDefault();
    let validation = true;
    if (!formValue.Name) {
      setValidateError((prevState) => ({
        ...prevState,
        Name: `Please input ${type} name`,
      }));
      validation = false;
    }
    if (type === "model") {
      if (!formValue.Framework) {
        setValidateError((prevState) => ({
          ...prevState,
          Framework: "Please select the framework",
        }));
        validation = false;
      }
    } else {
      if (!formValue.Scale) {
        setValidateError((prevState) => ({
          ...prevState,
          Scale: "Please select the dataset size",
        }));
        validation = false;
      }
    }
    if (!formValue.License) {
      setValidateError((prevState) => ({
        ...prevState,
        License: "Please select the license",
      }));
      validation = false;
    }
    if (!formValue.Type1) {
      setValidateError((prevState) => ({
        ...prevState,
        Type1: "Please select the main type",
      }));
      validation = false;
    }
    if (!formValue.Type2) {
      setValidateError((prevState) => ({
        ...prevState,
        Type2: "Please select the sub type",
      }));
      validation = false;
    }
    if (selectedFile && selectedFile.name !== "README.md") validation = false;
    if (!Object.values(validateError).every((value) => value === null)) {
      validation = false;
    }
    if (!validation) return;
    setLoading(true);
    try {
      if (type === "model") {
        await solanaMethods.createModel(
          {
            ...formValue,
            Tags: formValue.Tags.toString(),
          },
          wallet.publicKey
        );
      } else {
        await solanaMethods.createDataset(
          {
            ...formValue,
            Tags: formValue.Tags.toString(),
          },
          wallet.publicKey
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
        destroy();
        navigate(`/${type}`);
      }, 300);
    } catch (error) {
      console.log(error);
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
              name="Name"
              error={!!validateError.Name}
              helperText={validateError.Name}
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
                error={!!validateError.Framework}
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
                error={!!validateError.Scale}
                helperText={validateError.Scale}
                onChange={handleChange}
                fullWidth>
                {scales.map((scale, index) => (
                  <MenuItem key={scale} value={index + 1}>
                    {scale}
                  </MenuItem>
                ))}
              </Select>
            )}
            {(validateError.Framework || validateError.Scale) && (
              <FormHelperText style={{ color: "red" }}>
                {validateError.Framework || validateError.Scale}
              </FormHelperText>
            )}
          </Grid>
          <Grid item md={6}>
            <Select
              name="License"
              defaultValue=""
              error={!!validateError.License}
              onChange={handleChange}
              fullWidth>
              {licenses.map((license, index) => (
                <MenuItem key={license} value={index + 1}>
                  {license}
                </MenuItem>
              ))}
            </Select>
            {validateError.License && (
              <FormHelperText style={{ color: "red" }}>
                {validateError.License}
              </FormHelperText>
            )}
          </Grid>
          <Grid item md={12}>
            <label>{capitalize(type)} tag</label>
          </Grid>
          <Grid item md={6}>
            <Select
              name="Type1"
              defaultValue=""
              error={!!validateError.Type1}
              onChange={handleChange}
              fullWidth>
              {types.map((type, index) => (
                <MenuItem key={type.title} value={index + 1}>
                  {type.title}
                </MenuItem>
              ))}
            </Select>
            {validateError.Type1 && (
              <FormHelperText style={{ color: "red" }}>
                {validateError.Type1}
              </FormHelperText>
            )}
          </Grid>
          <Grid item md={6}>
            <Select
              name="Type2"
              defaultValue=""
              disabled={!formValue.Type1}
              error={!!validateError.Type2}
              helperText={validateError.Type2}
              onChange={handleChange}
              fullWidth>
              {formValue.Type1 &&
                types[formValue.Type1 - 1].items.map((item, index) => (
                  <MenuItem key={item} value={index + 1}>
                    {item}
                  </MenuItem>
                ))}
            </Select>
            {validateError.Type2 && (
              <FormHelperText style={{ color: "red" }}>
                {validateError.Type2}
              </FormHelperText>
            )}
          </Grid>
          <Grid item md={12}>
            <label>Other Tags</label>
          </Grid>
          <Grid item md={12}>
            <MuiChipsInput
              placeholder="Optional,such as the application domain of the model, the model libraries used, and the datasets involved"
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
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              className="upload-box"
              onClick={() => readmeRef.current.click()}>
              <input
                type="file"
                ref={readmeRef}
                style={{ display: "none" }}
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <span>
                {selectedFile
                  ? selectedFile.name === "README.md"
                    ? selectedFile.name
                    : "Not README.md. Please upload again"
                  : "Please click here to upload the README.md file. You can also add it later"}
              </span>
            </Stack>
          </Grid>
          {type === "model" && (
            <>
              <Grid item md={12}>
                <label>Deployment file(Optional)</label>
              </Grid>
              <Grid item md={12}>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  className="upload-box"
                  onClick={() => deployRef.current.click()}>
                  <input
                    type="file"
                    ref={deployRef}
                    style={{ display: "none" }}
                    onChange={(e) => setDeployFile(e.target.files[0])}
                  />
                  <span>
                    {deployFile
                      ? deployFile.name
                      : "Please click here to upload deployment file. You can also add it later"}
                  </span>
                </Stack>
              </Grid>
            </>
          )}
        </Grid>
        <Stack
          spacing={2}
          direction="row"
          justifyContent="center"
          style={{ paddingTop: 64 }}>
          <LoadingButton
            loading={loading}
            style={{ width: 160 }}
            className="cbtn"
            type="submit">
            {!loading && "Submit"}
          </LoadingButton>
          <Button
            disabled={loading}
            style={{ width: 160 }}
            className="white-btn"
            onClick={() => {
              setFormValue({});
              navigate(`/${type}`);
            }}>
            Cancel
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default styled(Create)`
  h1 {
    font-weight: 600;
    font-size: 32px;
    line-height: 44px;
  }
  label {
    display: block;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    padding: 16px 0;
  }
  .right {
    display: flex;
    justify-content: right;
  }
  .upload-box {
    width: 100%;
    height: 160px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #898989;
    span {
      color: #898989;
    }
  }
`;
