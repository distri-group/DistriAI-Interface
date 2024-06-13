import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { TextField, Grid, InputAdornment, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useSolanaMethod from "@/utils/useSolanaMethod.js";

function MakeOffer({ className }) {
  document.title = "Make Offer";
  const { id } = useParams();
  const { search } = useLocation();
  const maxStorage = parseInt(new URLSearchParams(search).get("max"));
  const navigate = useNavigate();
  const { methods } = useSolanaMethod();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
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

  return (
    <div className={className}>
      <h1>Make Offer</h1>
      <form onSubmit={onSubmit}>
        <Grid container spacing={4}>
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
              value={parseFloat(formValue.price)}
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
              value={parseFloat(formValue.duration)}
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
              value={parseFloat(formValue.disk)}
              onChange={handleChange}
              error={!!validateError.disk}
              helperText={validateError.disk}
            />
          </Grid>
          <Grid item md={12}>
            <Stack direction="row" spacing={3} alignItems="center">
              <span className="dist" />
              <span className="num">{formValue.price || 0}</span>
              <span>DIST</span>
            </Stack>
          </Grid>
          <Grid item md={12}>
            <Stack alignItems="center">
              <LoadingButton
                loading={loading}
                type="submit"
                className="cbtn"
                style={{ width: 160 }}>
                {!loading && (
                  <span
                    style={{
                      fontWeight: 500,
                      fontSize: 18,
                      lineHeight: "26px",
                    }}>
                    Confirm
                  </span>
                )}
              </LoadingButton>
            </Stack>
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
  .num {
    font-weight: 600;
    font-size: 32px;
    line-height: 44px;
  }
`;
