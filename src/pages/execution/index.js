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
  Card,CardContent
} from '@mui/material';
import Editor from '../../Editor';
import SelectInput from '@mui/material/Select/SelectInput';
import { NetworkCellRounded } from '@mui/icons-material';

const ExecutionPage = ({ configs = [
    { id:1,name: 'config 1', data: { json:{value: 'Data 1'} } },
    { id:2,name: 'config 2', data: { json:{value: 'Data 1'} }},
  ], inputs = [
    { id:1,name: 'Input 1', data: { json:{value: 'Data 1'} } },
    { id:2,name: 'Input 2', data: { json:{value: 'Data 1'} }},
  ] }) => {
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [selectedInput, setSelectedInput] = useState(null);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);


  const handleConfigChange = (event) => {
    console.log("config chagne",event.target)
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

  const  handleOnExecute= () => {
    // {input,"config":{}}
    if (selectedConfig && selectedInput) {
      console.log(configs[selectedConfig],selectedConfig,configs)
      let inputData = inputs[selectedInput].data.text
      let config = configs[selectedConfig]
      let configData = configs[selectedConfig].data.text
      let data = {
       ...JSON.parse(inputData),
        config:JSON.parse(configData)
      }

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Basic ' + btoa('api:api'));

      let url = `http://localhost:8000/${config.namespace}/${config.gateway}/${config.version}/${config.action}`
      // Make the API call here using the execution details
      // Example code:
      console.log(data,JSON.stringify(data))
      fetch(url, {
        method: 'POST',
        headers:headers,
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response data
          console.log('API response:', data);
        })
        .catch((error) => {
          // Handle the error
          console.error('API error:', error);
        });
  
      setExecutionHistory((prevHistory) => [...prevHistory, {config:selectedConfig,input:selectedInput}]);
      setSelectedConfig('');
      setSelectedInput('');
      setIsSnackbarOpen(true);
    }
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
                {/* <MenuItem value="">None</MenuItem> */}
                {configs.map((config) => (
                  <MenuItem key={config.id} value={config.id}>
                    {config.namespace}
                  </MenuItem>
                ))}
              </Select>
              {console.log("selected config",selectedConfig,configs)}
             {selectedConfig &&  <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Config Data:
                  </Typography>
                  <Editor data={configs.find((config) => config.id == selectedConfig)?.data} />
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
                  <Editor data={inputs.find((input) => input.id === selectedInput)?.data} />
                </Box>)}
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
