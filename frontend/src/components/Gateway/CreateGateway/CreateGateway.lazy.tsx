import React, { lazy, Suspense } from 'react';

const LazyCreateGateway = lazy(() => import('./CreateGateway'));

const CreateGateway = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyCreateGateway {...props} />
  </Suspense>
);

export default CreateGateway;
