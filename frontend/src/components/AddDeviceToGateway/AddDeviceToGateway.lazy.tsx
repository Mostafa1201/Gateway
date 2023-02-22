import React, { lazy, Suspense } from 'react';

const LazyAddDeviceToGateway = lazy(() => import('./AddDeviceToGateway'));

const AddDeviceToGateway = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyAddDeviceToGateway {...props} />
  </Suspense>
);

export default AddDeviceToGateway;
