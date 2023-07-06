import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Button,
  Paper,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,CardContent
} from '@mui/material';
import Editor from '../../Editor';
import SelectInput from '@mui/material/Select/SelectInput';

const ExecutionPage = ({ configs = [
    { id:1,name: 'config 1', data: { value: 'Data 1' } },
    { id:2,name: 'config 2', data: { value: 'Data 2' } },
  ], inputs = [
    { id:1,name: 'Input 1', data: { value: 'Data 1' } },
    { id:2,name: 'Input 2', data: { value: 'Data 2' } },
  ] }) => {
  const [selectedConfig, setSelectedConfig] = useState('');
  const [selectedInput, setSelectedInput] = useState('');
  const [executionHistory, setExecutionHistory] = useState([]);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleConfigChange = (event) => {
    setSelectedConfig(event.target.value);
  };

  const handleInputChange = (event) => {
    console.log(event.target.value)
    setSelectedInput(event.target.value);
  };

  const handleExecution = () => {
    if (selectedConfig && selectedInput) {
      const execution = {
        config: selectedConfig,
        input: selectedInput,
      };

      setExecutionHistory((prevHistory) => [...prevHistory, execution]);
      setSelectedConfig('');
      setSelectedInput('');
      setIsSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Paper sx={{ height: '100%', padding: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ backgroundColor: '#f3f3f3', color: '#333', padding: '10px' }}>
        Execution History
        </Typography>
            <List>
            {executionHistory.map((execution, index) => (
                <React.Fragment key={index}>
                <ListItem disablePadding sx={{ padding: '10px 0' }}>
                    <Card sx={{ width:'100%',boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <CardContent>
                        <Typography variant="subtitle1" color="primary">
                        Config: {execution.config}
                        </Typography>
                        <Typography variant="body2">
                        Input: {execution.input}
                        </Typography>
                    </CardContent>
                    </Card>
                </ListItem>
                {index !== executionHistory.length - 1 && <Divider />}
                </React.Fragment>
            ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper sx={{ height: '100%', padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              New Execution
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Select Config:
              </Typography>
              <Select
                value={selectedConfig}
                onChange={handleConfigChange}
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value="">None</MenuItem>
                {configs.map((config) => (
                  <MenuItem key={config.id} value={config.id}>
                    {config.name}
                  </MenuItem>
                ))}
              </Select>
             {selectedConfig &&  <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Config Data:
                  </Typography>
                  <Editor data={configs.find((config) => config.id === selectedConfig)?.data} />
                </Box>}
            </Box>
            {selectedConfig && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Select Input:
                </Typography>
                <Select
                  value={selectedInput}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="">None</MenuItem>
                  {inputs.map((input) => (
                    <MenuItem key={input.id} value={input.id}>
                      {input.name}
                    </MenuItem>
                  ))}
                </Select>
                {selectedInput && (<Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Input Data:
                  </Typography>
                  <Editor data={inputs.find((input) => input.id === selectedInput)?.id} />
                </Box>)}
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleExecution}>
                Execute
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="New execution added"
      />
    </Box>
  );
};

export default ExecutionPage;
