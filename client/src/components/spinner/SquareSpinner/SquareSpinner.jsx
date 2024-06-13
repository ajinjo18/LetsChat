import React from 'react'

import Skeleton from '@mui/material/Skeleton';

const SquareSpinner = () => {
  return (
    <div>
        <Skeleton variant="rounded" width={60} height={60} />
    </div>
  )
}

export default SquareSpinner
