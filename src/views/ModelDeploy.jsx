import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Button, Grid, MenuItem, Select, Stack } from "@mui/material";
import { getOrderList } from "../services/order";
import DeviceCard from "../components/DeviceCard";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import Countdown from "../components/Countdown";

function ModelDeploy({ className }) {
  const wallet = useAnchorWallet();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formValue, setFormValue] = useState({
    version: "master",
    task: {},
    model: id,
  });
  const [availTasks, setAvailTasks] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prevState) => ({ ...prevState, [name]: value }));
  };
  const onSubmit = (e) => {
    console.log(formValue);
    e.preventDefault();
  };
  useEffect(() => {
    const loadOrder = async () => {
      const res = await getOrderList(1, [], wallet.publicKey.toString());
      const filter = res.list.filter((item) => item.Status === 0);
      console.log(filter);
      setAvailTasks(filter);
    };
    if (wallet?.publicKey) {
      loadOrder();
    }
  }, [wallet]);
  return (
    <div className={className}>
      <div className="container">
        <h1>Deploy Service</h1>
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <label>Model Version</label>
            </Grid>
            <Grid item md={12}>
              <Select name="version" defaultValue="master" disabled fullWidth>
                <MenuItem value="master">Master</MenuItem>
              </Select>
            </Grid>
            <Grid item md={12}>
              <label>Device Selection</label>
            </Grid>
            <Grid item md={12}>
              <Select
                name="task"
                fullWidth
                disabled={!availTasks.length}
                onChange={handleChange}>
                {availTasks.map((task) => (
                  <MenuItem key={task.Id} value={task.Uuid}>
                    {task.Metadata.formData.taskName}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item md={12}>
              <label>Configuration</label>
            </Grid>
            {formValue.task.MachineInfo && (
              <Grid item md={12}>
                <DeviceCard />
              </Grid>
            )}
            {formValue.task.EndTime && (
              <Grid item md={12}>
                <label>Remain Time</label>
                <Countdown
                  deadlineTime={new Date(formValue.task.EndTime).getTime()}
                />
              </Grid>
            )}
            <Grid item md={12}>
              <Stack direction="row-reverse" spacing={2}>
                <Button className="cbtn" style={{ width: 100 }}>
                  Deploy
                </Button>
                <Button
                  onClick={() => navigate(`/models/${id}`)}
                  className="cbtn"
                  style={{ width: 100 }}>
                  Cancel
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
}

export default styled(ModelDeploy)`
  width: 1200px;
  margin: 0 auto;
  .container {
    width: 720px;
  }
`;
