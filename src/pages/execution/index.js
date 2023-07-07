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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import Editor from '../../components/editor/Editor';
import { CheckCircle, Cancel } from '@mui/icons-material';


const ExecutionPage = ({
  settings,
  executionHistory,
  onExecute,
  configs = [
    { id: 1, name: 'config 1', data: { json: { value: 'Data 1' } } },
    { id: 2, name: 'config 2', data: { json: { value: 'Data 1' } } },
  ],
  inputs = [
    { id: 1, name: 'Input 1', data: { json: { value: 'Data 1' } } },
    { id: 2, name: 'Input 2', data: { json: { value: 'Data 1' } } },
  ],
}) => {
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [selectedInput, setSelectedInput] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  // const [outputResponses, setOutputResponses] = useState([]);
  const [selectedExecution, setSelectedExecution] = useState(null);

  const handleConfigChange = (event) => {
    setSelectedConfig(event.target.value);
  };

  const handleInputChange = (event) => {
    setSelectedInput(event.target.value);
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const handleOnExecute = () => {
    if (selectedConfig !== null && selectedInput !== null) {
      let inputData = inputs[selectedInput]?.data?.text;
      let config = configs[selectedConfig];
      let configData = configs[selectedConfig]?.data?.text;
      console.log(inputData,configData)
      let data = {
        ...JSON.parse(inputData),
        config: configData ? JSON.parse(configData):{},
      };

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Basic ' + btoa(`${settings.username}:${settings.password}`));

      let url = `${settings.mozartUrl}${config.namespace}/${config.gateway}/${config.version}/${config.action}`;

      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('API response:', data);
          let newExecution = {
            config:selectedConfig,
            input:selectedInput,
            response:JSON.stringify(data)
          }
          onExecute(newExecution)
          handleExecutionClick(newExecution)
        })
        .catch((error) => {
          let newExecution = {
            config:selectedConfig,
            input:selectedInput,
            error:JSON.stringify({"error":error.message})
          }
          onExecute(newExecution)
          handleExecutionClick(newExecution)
          console.error('API error:', error);
        });

      setSelectedConfig(null);
      setSelectedInput(null);
      setIsSnackbarOpen(true);
    }
  };

  const handleExecutionClick = (execution) => {
    setSelectedExecution(execution);
  };

  const handleModalClose = () => {
    setSelectedExecution(null);
  };

  const getStatusIcon = (execution) => {
    if (execution.response) {
      return <CheckCircle style={{ color: 'green' }} />;
    } else if (execution.error) {
      return <Cancel style={{ color: 'red' }} />;
    } else {
      return null;
    }
  };
  

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Paper sx={{ height: '100%', padding: 2 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ backgroundColor: '#f3f3f3', color: '#333', padding: '10px' }}
            >
              Execution History
            </Typography>
            <List>
              {executionHistory &&
                executionHistory.map((execution, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                          sx={{
                            padding: '10px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            borderRadius: '4px',
                            '&:hover': {
                              backgroundColor: '#f5f5f5',
                              cursor: 'pointer',
                            },
                          }}
                          onClick={() => handleExecutionClick(execution)}
                        >
                          <Box sx={{ width: '100%' }}>
                            <Grid container spacing={7} alignItems="center" justifyItems={'space-evenly'}>
                              <Grid item>
                                <Typography variant="subtitle1" color="primary">
                                  Config: {execution.config}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography variant="subtitle1">Input: {execution.input}</Typography>
                              </Grid>
                              <Grid item>{getStatusIcon(execution)}</Grid>
                            </Grid>
                          </Box>
                        </ListItem>
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
                {configs.map((config) => (
                  <MenuItem key={config.id} value={config.id}>
                    {config.namespace}
                  </MenuItem>
                ))}
              </Select>
              {selectedConfig != null && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Config Data:
                  </Typography>
                  <Editor data={configs.find((config) => config.id === selectedConfig)?.data} />
                </Box>
              )}
            </Box>
            {selectedConfig != null && (
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
                  {inputs.map((input) => (
                    <MenuItem key={input.id} value={input.id}>
                      {input.name}
                    </MenuItem>
                  ))}
                </Select>
                {selectedInput != null && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Input Data:
                    </Typography>
                    <Editor data={inputs.find((input) => input.id === selectedInput)?.data} />
                  </Box>
                )}
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleOnExecute}>
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
      {selectedExecution && <Dialog
        open={selectedExecution !== null}
        onClose={handleModalClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle >Execution Details</DialogTitle>
        <DialogContent>
        <DialogContentText>
          <Typography variant="subtitle1" gutterBottom>
            Response:
          </Typography>
          <pre>{JSON.stringify(JSON.parse(selectedExecution?.response?selectedExecution?.response:selectedExecution?.error), null, 2)}</pre>
        </DialogContentText>

          <DialogContentText>
            <Typography variant="subtitle1" gutterBottom>
              Config:
            </Typography>
            <Editor data={configs.find((config) => config.id === selectedExecution?.config)?.data} />
          </DialogContentText>
          <Divider sx={{ my: 2 }} />
          <DialogContentText>
            <Typography variant="subtitle1" gutterBottom>
              Input:
            </Typography>
            <Editor data={inputs.find((input) => input.id === selectedExecution?.input)?.data} />
          </DialogContentText>
          <Divider sx={{ my: 2 }} />
        
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Close</Button>
        </DialogActions>
      </Dialog>}
    </Box>
  );
};

export default ExecutionPage;
