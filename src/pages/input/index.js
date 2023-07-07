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
import Editor from '../../components/editor/Editor';
import locale from 'react-json-editor-ajrm/locale/en';

const BLANK_DATA = {json:{},text:{}}
export default function InputPage({data=[],handleAddInput,updateInputData}) {

  const [newInputName, setNewInputName] = useState('');
  const [newInputData, setNewInputData] = useState(BLANK_DATA);
  const [selectedInput, setSelectedInput] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMsg,setSnackbarMsg] = useState("")
  const handleInputChange = (e) => {
    setNewInputName(e.target.value);
  };

  const handleInputDataChange = (newdata) => {
    console.log("input data change",selectedInput,newdata)
    if (selectedInput!=null){
        data[selectedInput].data = newdata
        return 
    }
    setNewInputData(newdata);
  };

  const handleOnSave = () => {
    if (newInputName.trim() === '') {
      setSnackbarMsg("Input name can't be empty")
      setIsSnackbarOpen(true)
      return;
    }

    const newInput = {
      name: newInputName.trim(),
      data: newInputData,
    };

    setNewInputName('');
    setNewInputData(BLANK_DATA);
    handleAddInput(newInput)
    setSnackbarMsg("Input Created Successfully")
    setIsSnackbarOpen(true);
  };

  const handleOnSaveChanges = ()=>{
      updateInputData(data)
      setSelectedInput(null)
      setSnackbarMsg("Input Updated Successfully")
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
              Inputs
            </Typography>
            <List>
              {data.map((input, index) => (
                <React.Fragment key={index}>
                  <ListItem disablePadding button onClick={() => handleInputClick(index)}>
                    <ListItemText primary={input.name} />
                  </ListItem>
                  {index !== data?.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button variant="outlined" color="primary" fullWidth onClick={()=>setSelectedInput(null)}>
              Add New Input
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper sx={{ height: '100%', padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              {selectedInput !=null? 'Edit Input' : 'Create New Input'}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Name"
                variant="outlined"
                value={selectedInput!=null ? data[selectedInput].name: newInputName}
                onChange={handleInputChange}
                fullWidth
              />
            </Box>
            {console.log("data",data,data[selectedInput],selectedInput)}
            <Box sx={{ mt: 2 }}>
              <Editor
                data={selectedInput!=null ? data[selectedInput].data : newInputData}
                onChange={handleInputDataChange}
                locale={locale}
                height="300px"
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={selectedInput!=null ? handleOnSaveChanges :handleOnSave} sx={{m:1}}>
                {selectedInput!=null ? 'Save Changes' : 'Save'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedInput(null);
                  setNewInputName('');
                  setNewInputData({});
                }}
                sx={{m:1}}
              >
                {selectedInput!=null ? 'Cancel' : 'Reset'}
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

