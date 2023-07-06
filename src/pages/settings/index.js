import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
} from '@mui/material';
import { Cancel, Edit, Save } from '@mui/icons-material';

const SettingsPage = ({settings,onSave}) => {
  const [mozartUrl, setMozartUrl] = useState('default_url');
  const [username, setUsername] = useState('default_username');
  const [password, setPassword] = useState('default_password');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log("data in set",settings)
   setMozartUrl(settings.mozartUrl)
   setUsername(settings.username)
   setPassword(settings.password)
  }, []);

  const handleEdit = () => {
    setIsEditMode(true);
    setIsError(false);
    setErrorMessage('');
  };

  const handleCancel = ()=>{
    setIsEditMode(false)
    setIsError(false)
    setErrorMessage("")
  }

  const handleSave = () => {
    if (!mozartUrl.trim() || !username.trim() || !password.trim()) {
      setIsError(true);
      setErrorMessage('Please fill in all fields.');
      return;
    }

    // Save settings to localStorage
    
    onSave({mozartUrl:mozartUrl,username:username,password:password})
    setIsEditMode(false);
    setIsSnackbarOpen(true);
    setIsError(false);
    setErrorMessage('');
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Mozart URL"
            variant="outlined"
            value={mozartUrl}
            onChange={(e) => setMozartUrl(e.target.value)}
            fullWidth
            disabled={!isEditMode}
            error={isError}
            helperText={isError && errorMessage}
            
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            disabled={!isEditMode}
            error={isError}
            helperText={isError && errorMessage}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            disabled={!isEditMode}
            error={isError}
            helperText={isError && errorMessage}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          {isEditMode ? (
            <>
         <Button variant="contained" startIcon={<Save />} onClick={handleSave} sx={{m:1}} >
              Save
            </Button>
            <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel} sx={{m:1}}>
              Cancel
            </Button></>
          ) : (
            <Button variant="outlined" startIcon={<Edit />} onClick={handleEdit}>
              Edit
            </Button>
          )}
        </Box>
      </Paper>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Settings saved"
      />
    </Box>
  );
};

export default SettingsPage;
