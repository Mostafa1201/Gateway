import { useEffect, useState } from 'react';
import styles from './Gateways.module.css';
import { DataGrid, GridColDef, GridToolbarContainer, GridActionsCellItem } from '@mui/x-data-grid';
import axios from "axios";
import { Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Constants } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

interface GatewayData {
  _id: string;
  name: string;
  ipv4: string;
  devices: any[];
}

interface DataGridRowParams {
  columns: GridColDef;
  id: number;
  row: {
    index: number;
    id: string;
    name: string;
    ipv4: string;
  };
}
const client = axios.create({
  baseURL: Constants.BASEURL 
});

const Gateways = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [gateways, setGateways] = useState([]);

  const columns: any[] = [
    { field: 'index', headerName: '#', width: 150 },
    { field: 'id', headerName: 'ID', width: 250 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'ipv4', headerName: 'IPV4', width: 150 },
    { field: 'devicesCount', headerName: 'Number of Devices', width: 150 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 180,
      cellClassName: 'actions',
      getActions: (params: DataGridRowParams) => {
        return [
          <GridActionsCellItem
            icon={<VisibilityIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleViewClick(params.row.id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(params.row.id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  
  const fetchGateways = async () => {
    let response :any = await client.get('/gateway');
    return response.data.gateways;
  }
  
  const deleteGateway = async (gatewayId: string) => {
    let response :any = await client.delete(`/gateway/${gatewayId}`)
    return response.data.deletedGateway;
  }
  
  function ActionButtons() {
  
    const handleCreateGatewayClick = () => {
      navigate('/gateway/create');
    };

    const handleCreateDeviceClick = () => {
      navigate('/device/create');
    };
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleCreateGatewayClick}>
          Create Gateway
        </Button>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleCreateDeviceClick}>
          Add Device To Gateway
        </Button>
      </GridToolbarContainer>
    );
  }
  
  const handleViewClick = (id: any) => () => {
    navigate(`/gateway/${id}`,{state: {id}});
  };
  
  const handleDeleteClick = (gatewayId: string) => async () => {
    await deleteGateway(gatewayId);
    setGateways(await fetchGateways());
  };

  useEffect(() => {
    const setData = async () => {
      setGateways(gateways);
      const tableRows :any = gateways.map((gateway: GatewayData , index) => ({
        index: index + 1,
        id: gateway._id,
        name: gateway.name,
        ipv4: gateway.ipv4,
        devicesCount: gateway.devices.length
      }))
      setRows(tableRows);
    }
    setData();
  },[gateways]);

  useEffect(() => {
    const setData = async () => {
      setGateways(await fetchGateways());
    }
    setData();
  },[]);

  return (
    <div className={styles.Gateways}>
      <div style={{ flex: 1 }}></div>
      <div style={{ flex: 8 }}>
        <Typography variant="h5" component="h3">
          Gateways
        </Typography>
        <DataGrid 
          className={styles.datagrid}
          rows={rows}
          columns={columns}
          components={{
            Toolbar: ActionButtons,
          }}
          editMode="row"
        />
      </div>
      <div style={{ flex: 1 }}></div>
    </div>
  );
}

export default Gateways;
