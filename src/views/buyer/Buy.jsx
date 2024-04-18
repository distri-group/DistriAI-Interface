import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import React, { useState, useEffect } from "react";
import { getOrderList } from "@/services/order.js";
import { PublicKey } from "@solana/web3.js";
import { useSnackbar } from "notistack";
import {
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { getModelList, checkDeployable } from "@/services/model.js";
import DurationToggle from "@/components/DurationToggle.jsx";
import DeviceCard from "@/components/DeviceCard.jsx";
import FileList from "@/components/FileList.jsx";
import { getMachineDetail } from "@/services/machine.js";
import useSolanaMethod from "@/utils/useSolanaMethod.js";
import useIpfs from "@/utils/useIpfs.js";

function Buy({ className }) {
  document.title = "Edit model";
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { wallet, methods } = useSolanaMethod();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [formValue, setFormValue] = useState({
    duration: 0,
    taskName: "",
    usage: "train",
    model: "",
  });
  const [filesToUpload, setFiles] = useState([]);
  const [deviceDetail, setDeviceDetail] = useState({});
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState({});
  const [deployable, setDeployable] = useState(false);
  const { methods: ipfsMethods } = useIpfs();

  // form value changed. Get the model user selected to know if this model is deployable.
  function handleChange(e) {
    const { name, value } = e.target;
    setFormValue((prevState) => ({ ...prevState, [name]: value }));
    if (name === "model") {
      setFormValue((prevState) => ({ ...prevState, model: parseInt(value) }));
      setSelectedModel(models.find((model) => model.Id === parseInt(value)));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
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
    // generate files for client to donwload list json from filesToUpload.
    if (filesToUpload.length > 0) {
      const res = await ipfsMethods.jsonUpload(filesToUpload);
      OrderInfo.DownloadURL.push(res.cid.toString());
    }
    const machinePublicKey = methods.getMachinePublicKey(
      deviceDetail.Uuid,
      new PublicKey(deviceDetail.Metadata.Addr)
    );
    setSubmitting(true);
    console.log({
      formData: {
        duration: formValue.duration,
        taskName: formValue.taskName,
      },
      MachineInfo,
      OrderInfo,
    });
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
        navigate("/order");
      }, 500);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setSubmitting(false);
  }
  // update filesToUpload if order intent is deploy which includes the deployment scripts
  useEffect(() => {
    if (formValue.duration && deviceDetail.Price) {
      setAmount(parseFloat(formValue.duration) * deviceDetail.Price);
    }
  }, [formValue, deviceDetail]);
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
      const models = await getModelList(1, 10);
      setModels(models.List);
      if (state.model) {
        setFormValue((prevState) => ({
          ...prevState,
          usage: state.model.intent,
          model: state.model.modelId,
        }));
        setSelectedModel(
          models.List.find(
            (model) => model.Id === parseInt(state.model.modelId)
          )
        );
      }
      const device = await getMachineDetail(state.Owner, id);
      setDeviceDetail(device);
      setLoading(false);
    }
    if (wallet?.publicKey) {
      init();
    }
    // eslint-disable-next-line
  }, [wallet, id, state]);
  useEffect(() => {
    const handleModelChange = async () => {
      // Check if selectedModel is empty
      if (JSON.stringify(selectedModel) !== "{}") {
        // Check deployability
        const deployable = await checkDeployable(selectedModel);
        setDeployable(deployable);

        // Update formValue.usage if not deployable
        if (!deployable) {
          setFormValue((prevState) => ({ ...prevState, usage: "train" }));
        }

        // Fetch deployment files if usage is deploy
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
    // Dependency array: Only runs when selectedModel changes
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
            <DeviceCard device={deviceDetail} />
          </div>
          <div>
            <h2>Order Info</h2>
            <form onSubmit={onSubmit}>
              <Grid container spacing={2}>
                <Grid item md={12}>
                  <DurationToggle
                    duration={formValue.duration}
                    setDuration={(duration) =>
                      setFormValue((prevState) => ({ ...prevState, duration }))
                    }
                    max={deviceDetail.MaxDuration}
                    title="Duration"
                  />
                </Grid>
                <Grid item md={12}>
                  <div className="gray-item">
                    <label>Max Duration</label>
                    <span>
                      {deviceDetail.MaxDuration > 24
                        ? `${Math.floor(deviceDetail.MaxDuration / 24)}d ${
                            deviceDetail.MaxDuration % 24
                          }`
                        : deviceDetail.MaxDuration}
                      h
                    </span>
                  </div>
                  <div className="gray-item">
                    <label>Price(per hour)</label>
                    <span>{deviceDetail.Price} DIST</span>
                  </div>
                </Grid>
                <Grid item md={12}>
                  <label>Task Name</label>
                </Grid>
                <Grid item md={12}>
                  <TextField
                    required={true}
                    value={formValue.taskName}
                    name="taskName"
                    onChange={handleChange}
                    placeholder="Must be 4-45 characters"
                  />
                </Grid>
                {state.model && (
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
                          handleChange(e);
                          setFormValue((prevState) => ({
                            ...prevState,
                            downloadLinks: [],
                          }));
                        }}
                        name="model"
                        value={formValue.model}>
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
                  <p className="balance">Balance: {balance} DIST</p>
                </Grid>
                <Grid item md={12}>
                  <div className="box">
                    <div className="left">Total</div>
                    <div className="right">
                      <span style={{ fontSize: "28px" }}>{amount || 0}</span>
                      <label>DIST</label>
                    </div>
                  </div>
                </Grid>
                <Grid item md={12}>
                  <LoadingButton
                    type="submit"
                    loading={submitting}
                    className="cbtn"
                    style={{ width: 100 }}>
                    {!submitting && "Confirm"}
                  </LoadingButton>
                </Grid>
              </Grid>
            </form>
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
      font-weight: 700;
      font-style: normal;
      font-size: 28px;
      margin-top: 25px;
      line-height: 70px;
    }
    h2 {
      font-size: 20px;
      margin: 0;
      border-bottom: 1px solid rgb(121, 121, 121);
      line-height: 48px;
    }
    .balance {
      text-align: right;
      line-height: 50px;
      font-size: 14px;
      color: rgb(224, 196, 189);
      margin: 0;
    }
    .box {
      border-radius: 5px;
      background-color: rgb(21, 21, 21);
      display: flex;
      justify-content: space-between;
      padding: 20px;
      .left {
        display: flex;
        align-items: center;
      }
      .right {
        span,
        label {
          display: block;
          font-weight: 600;
          text-align: right;
        }
      }
    }
    .gray-item {
      display: flex;
      padding: 8px 0;
      color: #898989;
      label {
        display: block;
        width: 200px;
      }
    }
  }
`;
