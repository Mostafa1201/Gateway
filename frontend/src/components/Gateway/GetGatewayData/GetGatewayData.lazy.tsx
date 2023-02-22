import React, { lazy, Suspense } from 'react';

const LazyGetGatewayData = lazy(() => import('./GetGatewayData'));

const GetGatewayData = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyGetGatewayData {...props} />
  </Suspense>
);

export default GetGatewayData;
