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

const InputPage = () => {
  const [inputs, setInputs] = useState([
    { name: 'config 1', data: { value: 'Data 1' } },
    { name: 'config 2', data: { value: 'Data 2' } },
  ]);
  const [newInputName, setNewInputName] = useState('');
  const [newInputData, setNewInputData] = useState({});
  const [selectedInput, setSelectedInput] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage,setsnackBarMessage] = useState("")
  const handleInputChange = (e) => {
    setNewInputName(e.target.value);
  };

  const handleInputDataChange = (data) => {
    console.log("config data change",selectedInput,data)
    if (selectedInput!=null){
        inputs[selectedInput].data = data
        return 
    }
    setNewInputData(data);
  };

  const handleAddInput = () => {
    if (newInputName.trim() === '') {
        setsnackBarMessage("Config Name not defind")
        setIsSnackbarOpen(true)
      return;
    }

    const newInput = {
      name: newInputName.trim(),
      data: newInputData,
    };

    setInputs((prevInputs) => [...prevInputs, newInput]);
    setNewInputName('');
    setNewInputData({});
    setsnackBarMessage("New config created")
    setIsSnackbarOpen(true);
  };

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
              Config
            </Typography>
            <List>
              {inputs.map((input, index) => (
                <React.Fragment key={index}>
                  <ListItem disablePadding button onClick={() => handleInputClick(index)}>
                    <ListItemText primary={input.name} />
                  </ListItem>
                  {index !== inputs.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button variant="outlined" color="primary" fullWidth onClick={()=>setSelectedInput(null)}>
              Add New Config
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper sx={{ height: '100%', padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              {selectedInput !=null? 'Edit Config' : 'Create New Config'}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Name"
                variant="outlined"
                value={selectedInput!=null ? inputs[selectedInput].name: newInputName}
                onChange={handleInputChange}
                fullWidth
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Editor
                data={selectedInput!=null ? inputs[selectedInput].data : newInputData}
                onChange={handleInputDataChange}
                locale={locale}
                height="300px"
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleAddInput} sx={{m:1}}>
                {selectedInput ? 'Save Changes' : 'Save'}
              </Button>
              <Button
              sx={{m:1}}
                variant="outlined"
                onClick={() => {
                  setSelectedInput(null);
                  setNewInputName('');
                  setNewInputData({});
                }}
              >
                {selectedInput ? 'Cancel' : 'Reset'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default InputPage;
