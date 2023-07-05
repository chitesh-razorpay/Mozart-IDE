import React, { useState } from "react";
import { Grid, Paper, Box, Typography, TextField, Button } from "@mui/material";
import Editor from "./Editor";

const ConfigPanel = () => {
  const [selectedConfig, setSelectedConfig] = useState("");

  const handleConfigSelect = (config) => {
    setSelectedConfig(config);
  };

  // Mock list of configs
  const configList = ["Config 1", "Config 2", "Config 3"];

  return (
    <Paper elevation={3} sx={{ height: "100%" }}>
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Config List
        </Typography>
        {configList.map((config, index) => (
          <Button
            key={index}
            variant="outlined"
            fullWidth
            onClick={() => handleConfigSelect(config)}
            sx={{ my: 1 }}
          >
            {config}
          </Button>
        ))}
      </Box>
    </Paper>
  );
};

const ConfigDetails = ({ selectedConfig }) => {
  return (
    <Paper elevation={3} sx={{ height: "100%" }}>
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Config Details
        </Typography>
        <Grid container >
          <Grid item xs={2} variant="body1" gutterBottom>
            Version: {selectedConfig.version}
          </Grid>
          <Grid item xs={3.5} variant="body1" gutterBottom>
            Namespace: {selectedConfig.namespace}
          </Grid>
          <Grid item xs={3.5} variant="body1" gutterBottom>
            Actions: {selectedConfig.actions}
          </Grid>
          <Grid item xs={3} variant="body1" gutterBottom>
            Gateway: {selectedConfig.gateway}
          </Grid>
        </Grid >
      </Box>
    </Paper>
  );
};

const ConfigEditor = ({ selectedConfig }) => {
  return (
    <Paper elevation={3} sx={{ height: "100%" }}>
      {/* <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Config Viewer
        </Typography>
        <JSONInput
          placeholder={selectedConfig.configData}
          theme="light_mitsuketa_tribute"
          locale={locale}
          height="200px"
        />
      </Box> */}
      <Editor/>
    </Paper>
  );
};

const ConfigInput = () => {
  const [configData, setConfigData] = useState("");

  const handleInputChange = (e) => {
    setConfigData(e.target.value);
  };

  const handleRunClick = () => {
    // Run logic here
  };

  const handleSaveClick = () => {
    // Save logic here
  };

  return (
    <Paper elevation={3} sx={{ height: "100%" }}>
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Config Input
        </Typography>
        <TextField
          label="Config Data"
          multiline
          rows={6}
          value={configData}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleRunClick} sx={{ mr: 2 }}>
          Run
        </Button>
        <Button variant="contained" onClick={handleSaveClick}>
          Save
        </Button>
      </Box>
    </Paper>
  );
};

const App = () => {
  // Mock selected config
  const selectedConfig = {
    namespace: "Namespace 1",
    version: "1.0",
    actions: ["Action 1", "Action 2"],
    gateway: "Gateway 1",
    configData: {
      key1: "value1",
      key2: "value2",
    },
  };

  return (
    <Grid container spacing={2} sx={{ height: "100vh" }}>
      <Grid item xs={3}>
        <ConfigPanel />
      </Grid>
      <Grid item xs={9}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ConfigDetails selectedConfig={selectedConfig} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
            <ConfigEditor selectedConfig={selectedConfig} />
          </Grid>
        <Grid item xs={12}>
          <ConfigInput />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default App;
