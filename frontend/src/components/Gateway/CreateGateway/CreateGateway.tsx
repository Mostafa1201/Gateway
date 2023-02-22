import { Button, FormControl, Paper, TextField, Typography } from '@mui/material';
import { useReducer } from 'react';
import styles from './CreateGateway.module.css';
import { Constants } from '../../../utils/constants';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const CreateGateway = () => {
  const client = axios.create({
    baseURL: Constants.BASEURL 
  });
  const navigate = useNavigate();
  //@ts-ignore
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }),
    {
      name: "",
      ipv4: ""
    });
  //@ts-ignore
  const [ipv4ValidationObject, setIpv4ValidationObject] = useReducer((state, newState) => ({ ...state, ...newState }),
    {
      error: false,
      helperText: Constants.FORM_INPUTS.DEFAULT_IPV4_TEXT
    });
  
  const handleInput = (event :any) => {
    const name = event.target.name;
    const newValue = event.target.value;
    setFormInput({ [name]: newValue });
  };

  const validateIPaddress = (inputText: any) => {
    var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return inputText.match(ipformat) ? true : false;
  }

  const handleIpv4Input = (event :any) => {
    handleInput(event);
    const valid = validateIPaddress(event.target.value);
    setIpv4ValidationObject({
      error : !valid,
      helperText: valid ? "" : Constants.FORM_INPUTS.INVALID_IPV4_MESSAGE
    });
    
  };

  const handleSubmit = async (event :any) => {
    event.preventDefault();

    let data = { ...formInput };

    let response :any = await client.post(`${Constants.BASEURL}/gateway`,data);
    if(response.data.newGateway){
      navigate('/')
    }
  };

  return (
    <div className={styles.CreateGateway}>
      <Paper className={styles.paper}>
        <Typography variant="h5" component="h3">
          Create Gateway
        </Typography>

        <FormControl sx={{ width: '50ch',height: '25ch' }}>
          <TextField
            label="Name"
            id="margin-normal"
            name="name"
            defaultValue={formInput.name}
            className={styles.textField}
            helperText={Constants.FORM_INPUTS.ENTER_GATEWAY_NAME}
            onChange={handleInput}
          />
          <TextField
            error={ipv4ValidationObject.error}
            label="IPV4"
            id="margin-normal"
            name="ipv4"
            defaultValue={formInput.ipv4}
            className={styles.textField}
            helperText={ipv4ValidationObject.helperText}
            onChange={handleIpv4Input}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={styles.button}
            onClick={handleSubmit}
            disabled={ipv4ValidationObject.error}
          >
            Create
          </Button>
        </FormControl>
      </Paper>
    </div>
  );
}

export default CreateGateway;