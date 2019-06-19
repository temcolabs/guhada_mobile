import React from 'react';
import Alert from './Alert';

export default function Confirm({ isConfirm, ...rest }) {
  return <Alert isConfirm={true} {...rest} />;
}
