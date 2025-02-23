import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import NDRF from '../../assets/ndrf_logo.png'

const Layout = ({ children }) => (
  <>
    <AppBar color='secondary' position="static">
      <Toolbar>
        <Box textAlign="center" mr={2}>
          <img
            src={NDRF}
            alt="Logo"
            style={{ width: 30, height: 30, objectFit: 'contain' }}
          />
        </Box>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          NDRF
        </Typography>
        <Typography variant="h8" component="div" sx={{ fontFamily: "italic" }}>
          Samarthya
        </Typography>
      </Toolbar>
    </AppBar>
    <Container maxWidth="lg" sx={{ marginTop: 1 }}>
      {children}
    </Container>
  </>
);

export default Layout;
