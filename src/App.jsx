// src/App.js
import React from 'react';
import { Container, Box } from '@mui/material';

import SIPCalculator from './Component/SipCalculator';

function App() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <SIPCalculator />
      </Box>
    </Container>
  );
}

export default App;
