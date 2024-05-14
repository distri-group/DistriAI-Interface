import {
  Grid,
  FormHelperText,
  TextField,
  MenuItem,
  Select,
  Stack,
  Button,
} from "@mui/material";
import { MuiChipsInput } from "mui-chips-input";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import types from "@/services/types.json";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { frameworks, licenses } from "@/services/model";
import useSolanaMethod from "@/utils/useSolanaMethod";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { getOrderDetail } from "@/services/order";

function FileUpload({ className }) {
  const { enqueueSnackbar } = useSnackbar();
  const wallet = useAnchorWallet();
  const [formValue, setFormValue] = useState({
    Name: "",
    Framework: 0,
    License: 0,
    Type1: 0,
    Type2: 0,
    Tags: [],
  });
  const [validateError, setValidateError] = useState({
    Name: null,
    Framework: null,
    License: null,
    Type1: null,
    Type2: null,
  });
  const [chips, setChips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const addr = useMemo(() => {
    if (orderDetail?.Metadata?.MachineInfo?.IP) {
      return `http://${orderDetail.Metadata.MachineInfo.IP}:${orderDetail.Metadata.MachineInfo.Port}`;
    }
  }, [orderDetail]);
  const { methods: solanaMethods } = useSolanaMethod();
  const { id } = useParams();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValue((prevState) => ({ ...prevState, [name]: value }));
    switch (name) {
      case "Name":
        if (value.length <= 0) {
          return setValidateError((prevState) => ({
            ...prevState,
            Name: `Please input model name`,
          }));
        }
        if (value.length > 100) {
          return setValidateError((prevState) => ({
            ...prevState,
            Name: `Model name should no longer than 100 words`,
          }));
        }
        return setValidateError((prevState) => ({
          ...prevState,
          Name: null,
        }));
      case "Type1":
        if (value) {
          setValidateError((prevState) => ({
            ...prevState,
            [name]: null,
          }));
          return setFormValue((prevState) => ({
            ...prevState,
            Type2: 0,
          }));
        }
        break;
      case "Framework":
      case "License":
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
        Name: `Please input model name`,
      }));
      validation = false;
    }

    if (!formValue.Framework) {
      setValidateError((prevState) => ({
        ...prevState,
        Framework: "Please select the framework",
      }));
      validation = false;
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
    if (!Object.values(validateError).every((value) => value === null)) {
      validation = false;
    }
    if (!validation) return;
    const model = {
      ...formValue,
      Tags: formValue.Tags.toString(),
    };
    try {
      setLoading(true);
      await solanaMethods.createModel(model, wallet.publicKey);
      const msg = `upload/file/${parseInt(
        Date.now() / 100000
      )}/${wallet?.publicKey.toString()}`;
      const encodeMsg = new TextEncoder().encode(msg);
      const sign = await window.phantom.solana.signMessage(encodeMsg, "utf8");
      const signature = anchor.utils.bytes.bs58.encode(sign.signature);
      window.open(
        `${addr}/uploadfiles?s=${signature}&n=${
          formValue.Name
        }&p=${wallet.publicKey.toString()}&t=${Date.now()}`
      );
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
      setLoading(false);
    }
  }
  useEffect(() => {
    async function loadDetail() {
      try {
        const res = await getOrderDetail(id);
        setOrderDetail(res);
      } catch (error) {}
    }
    if (wallet?.publicKey) {
      loadDetail();
    }
    // eslint-disable-next-line
  }, [id, wallet]);
  return (
    <div className={className}>
      <h1>Create a new model</h1>
      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <Stack spacing={2}>
              <label>Model Name</label>
              <TextField
                name="Name"
                error={!!validateError.Name}
                placeholder="Maximum 100 characters"
                onChange={handleChange}
              />
              {validateError.Name && (
                <FormHelperText style={{ color: "red" }}>
                  {validateError.Name}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
          <Grid item md={6}>
            <Stack spacing={2}>
              <label>Frameworks</label>
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
              {validateError.Framework && (
                <FormHelperText style={{ color: "red" }}>
                  {validateError.Framework}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
          <Grid item md={6}>
            <Stack spacing={2}>
              <label>License</label>
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
            </Stack>
          </Grid>
          <Grid item md={6}>
            <Stack spacing={2}>
              <label>Model Tag</label>
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
            </Stack>
          </Grid>
          <Grid item md={6}>
            <Stack spacing={2}>
              <label style={{ height: 28 }}> </label>
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
            </Stack>
          </Grid>
          <Grid item md={12}>
            <Stack spacing={2}>
              <label>Other Tags</label>
              <MuiChipsInput
                placeholder="Optional,such as the application domain of the model, the model libraries used, and the datasets involved"
                renderChip={(Component, key, props) => (
                  <Component {...props} key={key} color="success" />
                )}
                value={chips}
                onChange={handleChipsChange}
              />
            </Stack>
          </Grid>
          <Grid item md={12}>
            <Stack direction="row" justifyContent="center">
              <Button
                type="submit"
                className="cbtn"
                style={{
                  width: 160,
                }}>
                <span>Next Step</span>
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default styled(FileUpload)`
  label {
    display: block;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    padding: 16px 0;
  }
`;
