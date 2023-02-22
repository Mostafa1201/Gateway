import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import { useEffect, useReducer, useState } from 'react';
import styles from './AddDeviceToGateway.module.css';
import { Constants } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AddDeviceToGateway = () => {
  const client = axios.create({
    baseURL: Constants.BASEURL 
  });
  const navigate = useNavigate();
  //@ts-ignore
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }),
    {
      deviceId: "",
      gatewayId: ""
    });
  const [devices, setDevices] = useState([]);
  const [gateways, setGateways] = useState([]);
  
  const handleGatewayInput = (event :any) => {
    setFormInput({ gatewayId: event.target.value });
  };

  const handleDeviceInput = (event :any) => {
    setFormInput({ deviceId: event.target.value });
  };

  const handleSubmit = async (event :any) => {
    event.preventDefault();

    let data = { ...formInput };
    let response :any = await client.post(`${Constants.BASEURL}/device/addToGateway`,data);
    if(response.status === 200){
      navigate('/')
    }
  }
  const fetchGateways = async () => {
    let response :any = await client.get('/gateway');
    return response.data.gateways;
  }
  // Only fetched the devices that is not connected currently to a gateway
  const fetchDevices = async () => {
    let response :any = await client.get('/device/unconnectedDevices');
    return response.data.devices;
  }

  useEffect(() => {
    const setData = async () => {
      setGateways(gateways);
      setDevices(devices);
    }
    setData();
  },[devices,gateways]);

  useEffect(() => {
    const setData = async () => {
      setGateways(await fetchGateways());
      setDevices(await fetchDevices());
    }
    setData();
  },[]);

  let gatewaysItems = gateways.map((item :any, index) => {
    return (
      <MenuItem key={item._id} value={item._id} >{item.name}</MenuItem>
    )
  });

  let devicesItems = devices.map((item :any, index) => {
    return (
      <MenuItem key={item._id} value={item._id} >{`Device #${item.uid}`}</MenuItem>
    )
  });

  return (
    <div className={styles.AddDeviceToGateway}>
      <Paper className={styles.paper}>
        <Typography variant="h5" component="h3">
          Add Device To a Gateway
        </Typography>

        <FormControl sx={{ width: '50ch',height: '10ch' }}>
          
          <InputLabel id="demo-simple-select-label">Gateway</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={formInput.gatewayId}
            label="Gateway"
            onChange={handleGatewayInput}
            className="custom-form-select"
          >
            {gatewaysItems}
          </Select>
        </FormControl>
        <FormControl sx={{ width: '50ch',height: '10ch' }}>
          <InputLabel id="demo-simple-select-label">Device #uid</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formInput.deviceId}
              label="Device #uid"
              onChange={handleDeviceInput}
              className="custom-form-select"
            >
              {devicesItems}
            </Select>
        </FormControl>
        <FormControl sx={{ width: '50ch',height: '10ch' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={styles.button}
            onClick={handleSubmit}
          >
            Add
          </Button>
        </FormControl>
      </Paper>
    </div>
  );
}

export default AddDeviceToGateway;