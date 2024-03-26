import {
  Select,
  TextField,
  Button,
  Grid,
  MenuItem,
  Stack,
} from "@mui/material";
import styled from "styled-components";
import types from "../services/types.json";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MuiChipsInput } from "mui-chips-input";
import { licenses, frameworks, createModel } from "../services/model";
import { useSnackbar } from "notistack";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

function CreateModel({ className }) {
  document.title = "Create Model";
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleChipsChange = (newChips) => {
    const uniqueArr = Array.from(new Set(newChips));
    setChips(uniqueArr);
    setFormValue((prevState) => ({ ...prevState, Tags: newChips }));
  };
  const onSubmit = async (e) => {
    console.log(formValue);
    e.preventDefault();
    try {
      const res = await createModel(
        {
          ...formValue,
          Tags: formValue.Tags.toString(),
        },
        wallet.publicKey.toString()
      );
      if (res.Msg === "success") {
        enqueueSnackbar("Create Model Success.");
        setTimeout(() => {
          navigate("/models");
        }, 300);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className={className}>
      <h1>Create a new model</h1>
      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <label>Model name</label>
          </Grid>
          <Grid item md={12}>
            <TextField
              name="Name"
              placeholder="Maximum 50 characters"
              onChange={handleChange}
            />
          </Grid>
          <Grid item md={6}>
            <label>Frameworks</label>
          </Grid>
          <Grid item md={6}>
            <label>License</label>
          </Grid>
          <Grid item md={6}>
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
            <label>Model tag</label>
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
          {/* <Grid item md={12}>
            <label>README</label>
          </Grid>
          <Grid item md={12}>
            <TextField
              name="readme"
              onChange={handleChange}
              placeholder="Please click here to upload the README.md file. You can also add it later."
            />
          </Grid> */}
          <Grid item md={8} />
          <Grid item md={4}>
            <Stack spacing={2} direction="row">
              <Button style={{ width: 100 }} className="cbtn" type="submit">
                Submit
              </Button>
              <Button
                style={{ width: 100 }}
                className="cbtn"
                onClick={() => {
                  setFormValue({});
                  navigate("/models");
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

export default styled(CreateModel)`
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
