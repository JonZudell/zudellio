import React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import Paths from './Paths';


const Root: React.FC<{ path: string }> = ({ path }) => (
  <StaticRouter location={path}>
    <Paths />
  </StaticRouter>
);

export default Root;
