import { useEffect, useState } from 'react';
import styles from './GetGatewayData.module.css';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import axios from "axios";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Constants } from '../../../utils/constants';
import { useParams } from 'react-router-dom';
import moment from 'moment'

interface DeviceData {
  _id: string;
  uid: number;
  vendor: string;
  createdAt: Date;
  status: string;
}

interface DataGridRowParams {
  columns: GridColDef;
  id: string;
  row: {
    id: string;
    uid: number;
    vendor: string;
    status: string;
    createdAt: Date;
  };
}
const client = axios.create({
  baseURL: Constants.BASEURL 
});

const GetGatewayData = () => {
  const { gatewayId } = useParams();
  const [rows, setRows] = useState([]);
  const [devices, setDevices] = useState([]);

  const columns: any[] = [
    { field: 'uid', headerName: 'UID', width: 50 },
    { field: 'id', headerName: 'ID', width: 250 },
    { field: 'vendor', headerName: 'Vendor', width: 200 },
    { field: 'status', headerName: 'Status', width: 100 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200 ,
      valueFormatter: (params : any) => 
      moment(params?.value).format("YYYY-MM-DD hh:mm:ss"),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 180,
      cellClassName: 'actions',
      getActions: (params: DataGridRowParams) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(params.id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  
  const fetchGatewayDevices = async () => {
    let response :any = await client.get(`/gateway/${gatewayId}`);
    return response.data.gateway.devices;
  }
  
  const removeDeviceFromGateway = async (deviceId:string) => {
    let response :any = await client.delete(`/device/${deviceId}/gateway/${gatewayId}`)
    return response.data.device;
  }
  
  const handleDeleteClick = (deviceId: string) => async () => {
    await removeDeviceFromGateway(deviceId);
    setDevices(await fetchGatewayDevices());
  };

  useEffect(() => {
    const setData = async () => {
      setDevices(devices);
      const tableRows :any = devices.map((device: DeviceData) => ({
        uid: device.uid,
        id: device._id,
        vendor: device.vendor,
        status: device.status,
        createdAt: device.createdAt
      }))
      setRows(tableRows);
    }
    setData();
  },[devices]);

  useEffect(() => {
    const setData = async () => {
      setDevices(await fetchGatewayDevices());
    }
    setData();
  },[]);

  return (
    <div className={styles.GetGatewayData}>
      <div style={{ flex: 1 }}></div>
      <div style={{ flex: 8 }}>
        <DataGrid 
          className={styles.datagrid}
          rows={rows}
          columns={columns}
          editMode="row"
        />
      </div>
      <div style={{ flex: 1 }}></div>
    </div>
  );
}

export default GetGatewayData;
