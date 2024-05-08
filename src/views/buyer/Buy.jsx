import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import React, { useState, useEffect, useMemo } from "react";
import { getOrderList } from "@/services/order.js";
import { PublicKey } from "@solana/web3.js";
import { useSnackbar } from "notistack";
import {
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { getItemList, checkDeployable } from "@/services/model.js";
import DurationToggle from "@/components/DurationToggle.jsx";
import FileList from "@/components/FileList.jsx";
import { getMachineDetail } from "@/services/machine.js";
import useSolanaMethod from "@/utils/useSolanaMethod.js";
import useIpfs from "@/utils/useIpfs.js";
import { getTotal } from "@/utils/index.js";
import { useKeepAliveContext } from "keepalive-for-react";

function Buy({ className }) {
  document.title = "Edit model";
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, search } = useLocation();
  const owner = new URLSearchParams(search).get("own");
  const { wallet, methods } = useSolanaMethod();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [balance, setBalance] = useState(0);
  const [formValue, setFormValue] = useState({
    duration: 0,
    taskName: "",
    usage: "train",
    model: "",
  });
  const [validateError, setValidateError] = useState({
    taskName: null,
  });
  const [filesToUpload, setFiles] = useState([]);
  const [deviceDetail, setDeviceDetail] = useState({});
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState({ Id: 0 });
  const [deployable, setDeployable] = useState(false);
  const { methods: ipfsMethods } = useIpfs();
  const { destroy } = useKeepAliveContext();
  const amount = useMemo(() => {
    if (deviceDetail.Price) {
      return getTotal(deviceDetail.Price, parseFloat(formValue.duration));
    }
    return 0;
  }, [formValue.duration, deviceDetail]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValue((prevState) => ({ ...prevState, [name]: value }));
    if (name === "taskName") {
      if (value.length <= 0) {
        return setValidateError((prev) => ({
          taskName: "Please input task name",
        }));
      }
      if (value.length < 4) {
        return setValidateError((prev) => ({
          taskName: "Task name should no shorter than 4 characters",
        }));
      }
      if (value.length > 45) {
        return setValidateError((prev) => ({
          taskName: "Task name should no longer than 45 characters",
        }));
      }
      setValidateError((prev) => ({
        taskName: null,
      }));
    }
  }
  function handleModelChange(e) {
    const selectedModel = models.find(
      (model) => model.Id === parseInt(e.target.value)
    );
    setFormValue((prevState) => ({
      ...prevState,
      model: `${selectedModel.Owner.slice(0, 4)}..${selectedModel.Owner.slice(
        -4
      )}/${selectedModel.Name}`,
    }));
    setSelectedModel(selectedModel);
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (validateError.taskName) return;
    const MachineInfo = {
      Uuid: deviceDetail.Uuid,
      Provider: deviceDetail.Provider,
      Region: deviceDetail.Region,
      GPU: deviceDetail.GPU,
      CPU: deviceDetail.CPU,
      Tflops: deviceDetail.Tflops,
      RAM: deviceDetail.RAM,
      AvailDiskStorage: deviceDetail.Disk,
      Reliability: deviceDetail.Reliability,
      CPS: deviceDetail.CPS,
      Speed: deviceDetail.Speed,
      MaxDuration: deviceDetail.MaxDuration,
      Price: deviceDetail.Price,
      IP: deviceDetail.IP,
      Port: deviceDetail.Port,
    };
    const OrderInfo = {
      Model: formValue.model,
      Intent: formValue.usage || "train",
      DownloadURL: [],
    };
    if (filesToUpload.length > 0) {
      const res = await ipfsMethods.jsonUpload(filesToUpload);
      OrderInfo.DownloadURL.push(res.cid.toString());
    }
    const machinePublicKey = methods.getMachinePublicKey(
      deviceDetail.Uuid,
      new PublicKey(deviceDetail.Metadata.Addr)
    );
    console.log({
      formData: {
        duration: formValue.duration,
        taskName: formValue.taskName,
      },
      MachineInfo,
      OrderInfo,
    });
    setSubmitting(true);
    try {
      await methods.placeOrder(machinePublicKey, formValue.duration, {
        formData: {
          duration: formValue.duration,
          taskName: formValue.taskName,
        },
        MachineInfo,
        OrderInfo,
      });
      enqueueSnackbar("Purchase success.", { variant: "success" });
      setTimeout(() => {
        destroy();
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setSubmitting(false);
  }
  useEffect(() => {
    async function init() {
      setLoading(true);
      const balance = await methods.getTokenBalance(wallet.publicKey);
      setBalance(balance);
      const res = await getOrderList(
        1,
        10,
        { Direction: "buy" },
        wallet.publicKey.toString()
      );
      setFormValue((prevState) => ({
        ...prevState,
        taskName: `Computing Task-${res.Total}`,
      }));
      const models = await getItemList("model", 1, 10);
      setModels(models.List);
      if (state?.model) {
        const selectedModel = models.List.find(
          (model) => model.Id === parseInt(state.model.modelId)
        );
        setFormValue((prevState) => ({
          ...prevState,
          usage: state.model.intent,
          model: `${selectedModel.Owner.slice(
            0,
            4
          )}..${selectedModel.Owner.slice(-4)}/${selectedModel.Name}`,
        }));
        setSelectedModel();
      }
      const device = await getMachineDetail(owner, id);
      setDeviceDetail(device);
      setLoading(false);
    }
    if (wallet?.publicKey) {
      init();
    }
    // eslint-disable-next-line
  }, [wallet, id]);
  useEffect(() => {
    const handleModelChange = async () => {
      if (JSON.stringify(selectedModel) !== "{}") {
        const deployable = await checkDeployable(selectedModel);
        setDeployable(deployable);
        if (!deployable) {
          setFormValue((prevState) => ({ ...prevState, usage: "train" }));
        }
        if (formValue.usage === "deploy" && deployable) {
          const { files } = await ipfsMethods.getFolderList(
            `/distri.ai/model/${selectedModel.Owner}/${selectedModel.Name}/deployment`
          );
          setFiles([
            {
              name: files[0].name,
              cid: files[0].cid.toString(),
            },
          ]);
        }
      }
    };
    handleModelChange();
  }, [selectedModel]);
  return (
    <div className={className}>
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="container">
          <h1>Purchase Computing Power</h1>
          <div>
            <h2>Configuration</h2>
            <div className="box">
              <span className="gpu">
                {deviceDetail.GpuCount}x{" "}
                <b>
                  {deviceDetail.Gpu} {deviceDetail.GPUMemory || ""}
                </b>
              </span>
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                style={{ paddingBottom: 24 }}>
                <span>{deviceDetail.Tflops}</span>
                <label>TFLOPS</label>
              </Stack>
              <Grid container spacing={2}>
                <Grid item md={4}>
                  <Stack spacing={1}>
                    <label>RAM</label>
                    <span>
                      <b>{deviceDetail.RAM}</b> GB
                    </span>
                  </Stack>
                </Grid>
                <Grid item md={4}>
                  <Stack spacing={1}>
                    <label>Avail Disk Storage</label>
                    <span>
                      <b>{deviceDetail.Disk}</b> GB
                    </span>
                  </Stack>
                </Grid>
                <Grid item md={4}>
                  <Stack spacing={1}>
                    <label>CPU</label>
                    <span>{deviceDetail.CPU}</span>
                  </Stack>
                </Grid>
                <Grid item md={4}>
                  <Stack spacing={1}>
                    <label>IP</label>
                    <span>{deviceDetail.IP}</span>
                  </Stack>
                </Grid>
                <Grid item md={4}>
                  <Stack spacing={1}>
                    <label>Available Ports</label>
                    <span>{deviceDetail.AvailPorts.join(", ")}</span>
                  </Stack>
                </Grid>
              </Grid>
            </div>
          </div>
          <div>
            <h2>Order Info</h2>
            <div className="box">
              <form onSubmit={onSubmit}>
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    <DurationToggle
                      duration={formValue.duration}
                      setDuration={(duration) =>
                        setFormValue((prevState) => ({
                          ...prevState,
                          duration,
                        }))
                      }
                      max={deviceDetail.MaxDuration}
                      title="Duration"
                    />
                  </Grid>
                  <Grid item md={12}>
                    <Stack direction="row" spacing={1}>
                      <label style={{ display: "block", width: 160 }}>
                        Max Duration
                      </label>
                      <span>
                        {deviceDetail.MaxDuration > 24
                          ? `${Math.floor(deviceDetail.MaxDuration / 24)}d ${
                              deviceDetail.MaxDuration % 24
                            }`
                          : deviceDetail.MaxDuration}
                        h
                      </span>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <label style={{ display: "block", width: 160 }}>
                        Price(per hour)
                      </label>
                      <span>{deviceDetail.Price} DIST</span>
                    </Stack>
                  </Grid>
                  <Grid item md={12}>
                    <label
                      style={{
                        fontWeight: 600,
                        fontSize: 24,
                        color: "white",
                        lineHeight: "34px",
                      }}>
                      Task Name
                    </label>
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      value={formValue.taskName}
                      name="taskName"
                      error={!!validateError.taskName}
                      helperText={validateError.taskName}
                      onChange={handleChange}
                      placeholder="Must be 4-45 characters"
                    />
                  </Grid>
                  {state?.model && (
                    <>
                      <Grid item md={6}>
                        <label>Model</label>
                      </Grid>
                      <Grid item md={6}>
                        <label>Usage</label>
                      </Grid>
                      <Grid item md={6}>
                        <Select
                          fullWidth
                          onChange={(e) => {
                            handleModelChange(e);
                            setFormValue((prevState) => ({
                              ...prevState,
                              downloadLinks: [],
                            }));
                          }}
                          value={selectedModel.Id}>
                          {models.map((model) => (
                            <MenuItem value={model.Id} key={model.Id}>
                              {model.Name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item md={6}>
                        <Select
                          disabled={!formValue.model}
                          required={Boolean(formValue.model)}
                          fullWidth
                          value={formValue.usage}
                          name="usage"
                          onChange={handleChange}>
                          <MenuItem value="train">Training</MenuItem>
                          <MenuItem disabled={!deployable} value="deploy">
                            Deploy
                          </MenuItem>
                        </Select>
                      </Grid>
                    </>
                  )}
                  {formValue.usage === "train" && formValue.model && (
                    <>
                      <Grid item md={12}>
                        <label>Data for trainning</label>
                      </Grid>
                      <Grid item md={12}>
                        {selectedModel && (
                          <FileList
                            item={selectedModel}
                            type="model"
                            onSelect={(files) => setFiles(files)}
                          />
                        )}
                      </Grid>
                    </>
                  )}
                  <Grid item md={8} />
                  <Grid item md={4}>
                    <span className="balance">Balance: {balance} DIST</span>
                  </Grid>
                  <Grid item md={12}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      className="total">
                      <span>Total</span>
                      <Stack className="amount">
                        <span>{amount || 0}</span>
                        <label>DIST</label>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item md={12}>
                    <Stack direction="row" justifyContent="center">
                      <LoadingButton
                        type="submit"
                        loading={submitting}
                        className="cbtn"
                        style={{ width: 160 }}>
                        <span
                          style={{
                            fontWeight: 500,
                            fontSize: 18,
                            lineHeight: "26px",
                          }}>
                          {!submitting && "Purchase"}
                        </span>
                      </LoadingButton>
                    </Stack>
                  </Grid>
                </Grid>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default styled(Buy)`
  .container {
    width: 100%;
    h1 {
      font-size: 32px;
      line-height: 44px;
      margin: 0;
    }
    h2 {
      font-weight: 600;
      font-size: 28px;
      line-height: 38px;
      margin: 0;
      padding-top: 40px;
      padding-bottom: 24px;
      border-bottom: 1px solid #898989;
    }
    .balance {
      text-align: right;
      line-height: 50px;
      font-size: 14px;
      color: rgb(224, 196, 189);
      margin: 0;
    }
    .box {
      padding: 24px 40px;
      .gpu {
        margin: 0;
        margin-bottom: 8px;
        font-size: 24px;
        line-height: 34px;
      }
      label {
        font-size: 16px;
        color: #898989;
        line-height: 22px;
      }
      span {
        font-size: 20px;
        line-height: 28px;
      }
    }
    .balance {
      display: block;
      width: 100%;
      font-weight: 400;
      font-size: 18px;
      color: #959da5;
      line-height: 26px;
      text-align: right;
    }
    .total {
      width: 1440px;
      height: 80px;
      padding: 40px;
      background: rgba(149, 157, 165, 0.16);
      border-radius: 12px;
      margin-top: 16px;
      margin-bottom: 64px;
      span {
        font-weight: 600;
        font-size: 24px;
        line-height: 34px;
      }
      .amount {
        span {
          font-size: 32px;
          line-height: 44px;
          text-align: right;
        }
        label {
          font-size: 18px;
          color: white;
          line-height: 26px;
        }
      }
    }
  }
`;
