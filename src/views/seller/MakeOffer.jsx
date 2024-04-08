import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { TextField, Grid, InputAdornment } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { getMachineDetail } from "../../services/machine";
import useSolanaMethod from "../../utils/useSolanaMethod";

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
  function handleChange(e) {
    const { name, value } = e.target;
    setFormValue((prevState) => ({ ...prevState, [name]: parseFloat(value) }));
  }
  async function onSubmit(e) {
    e.preventDefault();
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
        <Grid className="container" container spacing={2}>
          <Grid item md={12}>
            <label>Price(per hour)</label>
          </Grid>
          <Grid item md={12}>
            <TextField
              required
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
              onChange={handleChange}
            />
          </Grid>
          <Grid item md={12}>
            <label>Max duration</label>
          </Grid>
          <Grid item md={12}>
            <TextField
              required
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
              onChange={handleChange}
            />
          </Grid>
          <Grid item md={12}>
            <label>Max disk storage</label>
            <span style={{ color: "#e0c4bd" }}>
              Avail Disk Storage: {maxStorage}GB
            </span>
          </Grid>
          <Grid item md={12}>
            <TextField
              required
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
              onChange={handleChange}
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
  display: block;
  width: 1200px;
  margin: 0 auto;
  .container {
    width: 750px;
    label {
      font-size: 18px;
      font-weight: 600;
      display: block;
    }
    .union {
      p {
        color: white;
      }
    }
  }
`;
