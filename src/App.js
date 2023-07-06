import React, { useState } from "react";
import { Grid, Paper, Box, TextField, Button,AppBar, Tab, Tabs, Typography,ThemeProvider,createTheme } from "@mui/material";
import LearnIcon from '@mui/icons-material/EmojiObjectsOutlined';
import InputIcon from '@mui/icons-material/KeyboardOutlined';
import ConfigIcon from '@mui/icons-material/SettingsOutlined';
import ExecuteIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import Learn from "./pages/learn";
import InputPage from "./pages/input";
import ConfigPage from "./pages/config";
import ExecutionPage from "./pages/execution";
import SettingsPage from "./pages/settings";

const theme = createTheme()


const App = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return <ThemeProvider theme={theme}><Learn/></ThemeProvider>
      case 1:
        return <InputPage/>;
      case 2:
        return <ConfigPage/>;
      case 3:
        return <ExecutionPage/>;
      case 4:
        return <SettingsPage/>;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="inherit"
        indicatorColor="primary"
      >
        <Tab label="Learn" icon={<LearnIcon />} />
        <Tab label="Input" icon={<InputIcon />} />
        <Tab label="Config" icon={<ConfigIcon />} />
        <Tab label="Execute" icon={<ExecuteIcon />} />
        <Tab label="Settings" icon={<SettingsIcon />} />
      </Tabs>
    </AppBar>
    <Box p={3}>
      {renderContent()}
    </Box>
  </Box>
  );

};

export default App;
