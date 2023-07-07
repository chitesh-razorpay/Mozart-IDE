import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Grid,
  Snackbar,
  Paper,
  Divider,
} from '@mui/material';
import Editor from '../../Editor';
import locale from 'react-json-editor-ajrm/locale/en';

const BLANK_DATA = { json: {}, text: {} }
export default function ConfigPage({ data = [], handleAddInput, updateInputData }) {

  const [newConfigNamespace, setNewConfigNamespace] = useState('demoNamespace');
  const [newConfigVersion, setNewConfigVersion] = useState('v1');
  const [newConfigGateway, setNewConfigGateway] = useState('demoGateway');
  const [newConfigAction, setNewConfigAction] = useState('demoAction');
  const [newInputData, setNewInputData] = useState(BLANK_DATA);
  const [selectedInput, setSelectedInput] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("")

  const handleInputChange = (e, field) => {
    switch (field) {
      case "namespace": setNewConfigNamespace(e.target.value); break;
      case "action": setNewConfigAction(e.target.value); break;
      case "gateway": setNewConfigGateway(e.target.value); break;
      case "version": setNewConfigVersion(e.target.value); break;
    }
  };

  const resetData = () => {
    setNewConfigAction("")
    setNewConfigGateway("")
    setNewConfigNamespace("")
    setNewConfigVersion("")
  }
  const handleInputDataChange = (newdata) => {
    console.log("handleinptudatachange", newdata)
    if (selectedInput != null) {
      data[selectedInput].data = newdata
      return
    }
    setNewInputData(newdata);
  };

  const handleOnSave = () => {
    // if (newInputName.trim() === '') {
    //   setSnackbarMsg("Config name can't be empty")
    //   setIsSnackbarOpen(true)
    //   return;
    // }

    const newInput = {
      namespace: newConfigNamespace.trim(),
      action: newConfigAction.trim(),
      gateway: newConfigGateway.trim(),
      version: newConfigVersion.trim(),
      data: newInputData,
    };

    resetData()
    setNewInputData(BLANK_DATA);
    handleAddInput(newInput)
    setSnackbarMsg("Config Created Successfully")
    setIsSnackbarOpen(true);
  };

  const handleOnSaveChanges = () => {
    updateInputData(data)
    setSelectedInput(null)
    setSnackbarMsg("Config Updated Successfully")
    setIsSnackbarOpen(true);
  }
  const handleInputClick = (input) => {
    setSelectedInput(input);
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Paper sx={{ height: '100%', padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              Configs
            </Typography>
            <List>
              {data.map((input, index) => (
                <React.Fragment key={index}>
                  <ListItem disablePadding button onClick={() => handleInputClick(index)}>
                    <ListItemText primary={input.namespace} />
                  </ListItem>
                  {index !== data?.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button variant="outlined" color="primary" fullWidth onClick={() => setSelectedInput(null)}>
              Add New Config
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper sx={{ height: '100%', padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              {selectedInput != null ? 'Edit Config' : 'Create New Config'}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <TextField
                sx={{ mt: 1, mb: 1 }}
                label="Namespace"
                variant="outlined"
                value={selectedInput != null ? data[selectedInput].namespace : newConfigNamespace}
                onChange={(e) => handleInputChange(e, "namespace")}
                fullWidth
              />
              <TextField
                sx={{ mt: 1, mb: 1 }}
                label="Gateway"
                variant="outlined"
                value={selectedInput != null ? data[selectedInput].gateway : newConfigGateway}
                onChange={(e) => handleInputChange(e, "gateway")}
                fullWidth
              />
              <TextField
                sx={{ mt: 1, mb: 1 }}
                label="Version"
                variant="outlined"
                value={selectedInput != null ? data[selectedInput].version : newConfigVersion}
                onChange={(e) => handleInputChange(e, "version")}
                fullWidth
              />

              <TextField
                sx={{ mt: 1, mb: 1 }}
                label="Action"
                variant="outlined"
                value={selectedInput != null ? data[selectedInput].action : newConfigAction}
                onChange={(e) => handleInputChange(e, "action")}
                fullWidth
              />
            </Box>
            {console.log("data in configs", data, data[selectedInput], selectedInput)}
            <Box sx={{ mt: 2 }}>
              <Editor
                data={selectedInput != null ? data[selectedInput].data : newInputData}
                onChange={handleInputDataChange}
                locale={locale}
                height="300px"
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={selectedInput != null ? handleOnSaveChanges : handleOnSave} sx={{ m: 1 }}>
                {selectedInput != null ? 'Save Changes' : 'Save'}
              </Button>
              <Button
                variant="outlined"
                onClick={
                  resetData
                }
                sx={{ m: 1 }}
              >
                {selectedInput != null ? 'Cancel' : 'Reset'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMsg}
      />
    </Box>
  );
};

