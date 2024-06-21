import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

const Image = styled('img')({
  width: '100%',
});

const SkeletonChildrenDemo = () => (
  <div>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ margin: 1 }}>
        <Skeleton variant="circular">
          <Avatar />
        </Skeleton>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Skeleton width="100%">
          <div style={{ visibility: 'hidden' }}>.</div>
        </Skeleton>
      </Box>
    </Box>
    <Skeleton variant="rectangular" width="100%">
      <div style={{ paddingTop: '57%' }} />
    </Skeleton>
  </div>
);

const SkeletonPostSpinner = () => (
  <Grid container spacing={8}>
    <Grid item xs>
      <SkeletonChildrenDemo />
    </Grid>
  </Grid>
);

export default SkeletonPostSpinner;
