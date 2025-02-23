import React from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedButton = ({ onClick, label }) => {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Button variant="contained" color="primary" onClick={onClick}>
        {label}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;
