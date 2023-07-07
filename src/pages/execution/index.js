import React, { useEffect, useState } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Editor from '../../Editor';

const ExecutionPage = ({executionHistory,onExecute,
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
  // const [executionHistory, setExecutionHistory] = useState([]);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [outputResponses, setOutputResponses] = useState([]);
  console.log(executionHistory,"history")
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
      headers.append('Authorization', 'Basic ' + btoa('api:api'));

      let url = `http://localhost:8000/${config.namespace}/${config.gateway}/${config.version}/${config.action}`;

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
          setOutputResponses((prevResponses) => [...prevResponses, JSON.stringify(data)]);
        })
        .catch((error) => {
          let newExecution = {
            config:selectedConfig,
            input:selectedInput,
            response:JSON.stringify({"error":"Api called failed"})
          }
          onExecute(newExecution)
          console.error('API error:', error);
        });

      setSelectedConfig(null);
      setSelectedInput(null);
      setIsSnackbarOpen(true);
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
              {executionHistory && executionHistory?.map((execution, index) => (
                <React.Fragment key={index}>
                  <ListItem disablePadding sx={{ padding: '10px 0' }}>
                    <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ width: '100%' }}>
                        <Grid container spacing={7} alignItems="center" justifyItems={"space-evenly"}>
                          <Grid item >
                            <Typography variant="subtitle1" color="primary">
                              Config: {execution.config}
                            </Typography>
                          </Grid>
                          <Grid item >
                            <Typography variant="subtitle1">
                              Input: {execution.input}
                            </Typography>
                          </Grid>
                        </Grid>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                           {execution.response}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
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
                  <Editor
                    data={configs.find((config) => config.id === selectedConfig)?.data}
                  />
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
                    <Editor
                      data={inputs.find((input) => input.id === selectedInput)?.data}
                    />
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
    </Box>
  );
};

export default ExecutionPage;
