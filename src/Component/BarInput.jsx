// src/components/BarInput.js
import React from 'react';
import { Slider, Input, Typography, Box } from '@mui/material';

const BarInput = ({ label, min, max, step, value, onChange }) => {
  const handleSliderChange = (event, newValue) => {
    onChange(newValue);
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value === '' ? '' : Number(event.target.value);
    onChange(newValue);
  };

  const handleBlur = () => {
    if (value < min) {
      onChange(min);
    } else if (value > max) {
      onChange(max);
    }
  };

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        {label}: <strong>{value}</strong>
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Slider
          value={typeof value === 'number' ? value : 0}
          onChange={handleSliderChange}
          aria-labelledby="input-slider"
          min={min}
          max={max}
          step={step}
          valueLabelDisplay="auto"
          sx={{ flexGrow: 1 }}
        />
        <Input
          value={value}
          size="small"
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            step: step,
            min: min,
            max: max,
            type: 'number',
            'aria-labelledby': 'input-slider',
          }}
          sx={{ width: '80px' }}
        />
      </Box>
    </Box>
  );
};

export default BarInput;
