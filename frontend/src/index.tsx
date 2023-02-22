import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Error from './components/Error/Error';
import CreateGateway from './components/Gateway/CreateGateway/CreateGateway';
import GetGatewayData from './components/Gateway/GetGatewayData/GetGatewayData';
import AddDeviceToGateway from './components/AddDeviceToGateway/AddDeviceToGateway';
import Gateways from './components/Gateway/Gateways';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Gateways/>,
    errorElement: <Error />,
  },
  {
    path: '/gateway/create',
    element: <CreateGateway />,
  },
  {
    path: '/gateway/:gatewayId',
    element: <GetGatewayData />,
  },
  {
    path: '/device/create',
    element: <AddDeviceToGateway />,
  },
]);
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
