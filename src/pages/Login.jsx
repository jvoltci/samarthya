import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';
import NDRF from '../assets/ndrf_logo.png';
import LoadingSpinner from '../components/shared/LoadingSpinner';

// Neumorphism styles
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  borderRadius: '20px',
  background: '#e0e5ec',
  boxShadow: '8px 8px 16px #b8bec6, -8px -8px 16px #ffffff',
  maxWidth: 400,
  margin: 'auto',
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: '#e0e5ec',
    boxShadow: 'inset 4px 4px 8px #b8bec6, inset -4px -4px 8px #ffffff',
    '& fieldset': { border: 'none' },
    '&:hover fieldset': { border: 'none' },
    '&.Mui-focused fieldset': { border: 'none' },
  },
});

const StyledButton = styled(Button)({
  borderRadius: '12px',
  background: '#e0e5ec',
  boxShadow: '6px 6px 12px #b8bec6, -6px -6px 12px #ffffff',
  color: '#333',
  fontWeight: 'bold',
  '&:hover': {
    background: '#d1d9e6',
  },
  '&:active': {
    boxShadow: 'inset 4px 4px 8px #b8bec6, inset -4px -4px 8px #ffffff',
  },
});

const Login = () => {
  const [regimentalNo, setRegimentalNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login({ regimentalNo, password });
      if (loggedInUser?.isAdmin) {
        navigate('/admin');
      } else if (loggedInUser?.employeeId) {
        navigate(`/employee/${loggedInUser.employeeId}`);
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={12} sm={8} md={6}>
          <StyledPaper elevation={0}>
            <Box textAlign="center" mb={2}>
              <img src={NDRF} alt="Logo" style={{ width: 100, height: 100, objectFit: 'contain' }} />
              <Typography variant="h5" component="h1" sx={{ color: '#333', fontWeight: 'bold' }}>
                Samarthya
              </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Regimental No"
                    variant="outlined"
                    fullWidth
                    value={regimentalNo}
                    onChange={(e) => setRegimentalNo(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Grid>
                {error && (
                  <Grid item xs={12}>
                    <Typography color="error" variant="body2">
                      {error}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <StyledButton type="submit" variant="contained" fullWidth disabled={loading}>
                    {loading ? <LoadingSpinner size={24} /> : 'Login'}
                  </StyledButton>
                </Grid>
              </Grid>
            </form>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
