import React, { lazy, Suspense } from 'react';

const LazyGateway = lazy(() => import('./Gateways'));

const Gateway = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyGateway {...props} />
  </Suspense>
);

export default Gateway;
