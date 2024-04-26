import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { TextField, Grid, InputAdornment } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { getMachineDetail } from "@/services/machine.js";
import useSolanaMethod from "@/utils/useSolanaMethod.js";

function MakeOffer({ className }) {
  document.title = "Make Offer";
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { wallet, methods } = useSolanaMethod();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [maxStorage, setMaxStorage] = useState(0);
  const [formValue, setFormValue] = useState({
    price: 0,
    duration: 0,
    disk: 0,
  });
  const [validateError, setValidateError] = useState({
    price: null,
    duration: null,
    disk: null,
  });
  function handleChange(e) {
    let { name, value } = e.target;
    value = parseFloat(value);
    setFormValue((prevState) => ({ ...prevState, [name]: value }));
    switch (name) {
      case "price":
        if (!value) {
          return setValidateError((prevState) => ({
            ...prevState,
            price: "Please input device price",
          }));
        }
        if (value < 0) {
          return setValidateError((prevState) => ({
            ...prevState,
            price: "Price should not lower than 0",
          }));
        }
        setValidateError((prevState) => ({
          ...prevState,
          price: null,
        }));
        break;
      case "duration":
        if (!value) {
          return setValidateError((prevState) => ({
            ...prevState,
            duration: "Please input max duration",
          }));
        }
        if (value < 0) {
          return setValidateError((prevState) => ({
            ...prevState,
            duration: "Max duration should not lower than 0",
          }));
        }
        setValidateError((prevState) => ({
          ...prevState,
          duration: null,
        }));
        break;
      case "disk":
        if (!value) {
          return setValidateError((prevState) => ({
            ...prevState,
            disk: "Please input max disk storage",
          }));
        }
        if (value < 0) {
          return setValidateError((prevState) => ({
            ...prevState,
            disk: "Max disk storage should not lower than 0",
          }));
        }
        if (value > maxStorage) {
          return setValidateError((prevState) => ({
            ...prevState,
            disk: "Max disk storage should not bigger than available disk storage",
          }));
        }
        setValidateError((prevState) => ({
          ...prevState,
          disk: null,
        }));
        break;
      default:
        break;
    }
  }
  async function onSubmit(e) {
    e.preventDefault();
    if (validateError.disk || validateError.duration || validateError.price)
      return;
    setLoading(true);
    try {
      await methods.makeOffer({
        uuid: id,
        ...formValue,
      });
      enqueueSnackbar("Make offer success.", { variant: "success" });
      setTimeout(() => {
        navigate("/device");
      }, 300);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setLoading(false);
  }
  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const detail = await getMachineDetail(state.Owner, id);
        if (detail) {
          setMaxStorage(parseInt(detail.Metadata?.DiskInfo?.TotalSpace));
        }
      } catch (error) {}
      setLoading(false);
    }
    if (wallet?.publicKey) {
      init();
    }
  }, [id, wallet?.publicKey, state]);

  return (
    <div className={className}>
      <h1>Make Offer</h1>
      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <label>Price(per hour)</label>
          </Grid>
          <Grid item md={12}>
            <TextField
              name="price"
              InputProps={{
                type: "number",
                inputProps: {
                  max: 999999,
                  min: 0.01,
                  step: 0.01,
                },
                endAdornment: (
                  <InputAdornment className="union" position="end">
                    DIST
                  </InputAdornment>
                ),
              }}
              value={formValue.price}
              onChange={handleChange}
              error={!!validateError.price}
              helperText={validateError.price}
            />
          </Grid>
          <Grid item md={12}>
            <label>Max duration</label>
          </Grid>
          <Grid item md={12}>
            <TextField
              name="duration"
              InputProps={{
                type: "number",
                inputProps: {
                  max: 999999,
                  min: 1,
                },
                endAdornment: (
                  <InputAdornment className="union" position="end">
                    Hour
                  </InputAdornment>
                ),
              }}
              value={formValue.duration}
              onChange={handleChange}
              error={!!validateError.duration}
              helperText={validateError.duration}
            />
          </Grid>
          <Grid item md={12}>
            <label>Max disk storage</label>
          </Grid>
          <Grid item md={12}>
            <span style={{ color: "#898989" }}>
              Avail Disk Storage: {maxStorage}GB
            </span>
          </Grid>
          <Grid item md={12}>
            <TextField
              name="disk"
              InputProps={{
                type: "number",
                inputProps: {
                  max: maxStorage,
                  min: 1,
                },
                endAdornment: (
                  <InputAdornment className="union" position="end">
                    GB
                  </InputAdornment>
                ),
              }}
              value={formValue.disk}
              onChange={handleChange}
              error={!!validateError.disk}
              helperText={validateError.disk}
            />
          </Grid>
          <Grid item md={12}>
            <span className="num" style={{ fontSize: 28, margin: "0 10px" }}>
              {formValue.price || 0}
            </span>
            <span>DIST</span>
          </Grid>
          <Grid item md={12}>
            <LoadingButton
              loading={loading}
              type="submit"
              className="cbtn"
              style={{ width: 100 }}>
              {!loading && "Confirm"}
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default styled(MakeOffer)`
  h1 {
    margin: 40px 0;
  }
  label {
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
  }
  .union {
    p {
      font-size: 18px;
      color: #ffffff;
      line-height: 28px;
    }
  }
`;
