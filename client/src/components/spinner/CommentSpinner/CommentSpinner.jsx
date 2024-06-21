import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const CommentSpinner = () => {
  return (
    <Stack spacing={1} style={{padding:'20px'}}>
      <Skeleton variant="circular" width={40} height={40} />
      <div style={{marginTop:'-30px', width:'80%', marginLeft:'50px'}}>
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      </div>
    </Stack>
  );
}

export default CommentSpinner
