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
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/system';
import NDRF from '../assets/ndrf_logo.png'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  borderRadius: theme.spacing(2),
  boxShadow: '0px 3px 6px rgba(0,0,0,0.16)',
  maxWidth: 400,
  margin: 'auto',
}));

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
      await login({ regimentalNo, password });
    
      if (user && user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={12} sm={8} md={6}>
          <StyledPaper>
            <Box textAlign="center" mb={2}>
              <img
                src={NDRF}
                alt="Logo"
                style={{ width: 100, height: 100, objectFit: 'contain' }}
              />
              <Typography variant="h5" component="h1">
                Samarthya
              </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Regimental No"
                    variant="outlined"
                    fullWidth
                    value={regimentalNo}
                    onChange={(e) => setRegimentalNo(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
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
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Login'}
                  </Button>
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
