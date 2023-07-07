import React, { useState,useEffect } from "react";
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

const DEFAUTL_SETTINGS = {mozartUrl:"default_url",username:"default_user",password:"password"}
const App = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [configs,setConfigs] = useState([])
  const [inputs,setInputs] = useState([])
  const [settings ,setSettings] = useState()
  const [executionHistory,setExecutionHistory] = useState([])
  // Load data from local storage on initial render
  useEffect(() => {
    const storedConfigs = localStorage.getItem("configs");
    if (storedConfigs) {
      setConfigs(JSON.parse(storedConfigs));
    }

    const storedInputs = localStorage.getItem("inputs");
    if (storedInputs) {
      setInputs(JSON.parse(storedInputs));
    }
    const storedExe = localStorage.getItem("executions");
    if (storedExe) {
      setExecutionHistory(JSON.parse(storedExe));
    }

    const storedSetting = localStorage.getItem("settings")
    if(storedSetting){
      setSettings(JSON.parse(storedSetting))
    }else{
      setSettings(DEFAUTL_SETTINGS)
      localStorage.setItem("settings",JSON.stringify(DEFAUTL_SETTINGS))
    }
  }, []);


  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAddInput = (newInput)=>{
    let newData = [...inputs,newInput]
    setInputs(newData);
    storeInputs(newData)
  }

  const updateInputData  = (data)=>{
    setInputs([...data])
    storeInputs([...data])
  }

  const storeInputs = (data)=>{
    localStorage.setItem("inputs", JSON.stringify(data));
  }
  const storeConfigs = (data)=>{
    localStorage.setItem("configs", JSON.stringify(data));
  }
  const storeExecutionHistory = (data)=>{
    localStorage.setItem("executions", JSON.stringify(data));
  }
  const handleAddConfig = (newConfig)=>{
    let newData = [...configs,newConfig]
    setConfigs(newData)
    storeConfigs(newData)
    
  }
  const handleAddExecution = (newExe)=>{
    let newData = [...executionHistory,newExe]
    setExecutionHistory(newData)
    storeExecutionHistory(newData)
  }

  const updateConfigData  = (data)=>{
    setConfigs([...data])
    storeConfigs([...data])

  }

  const handleSettingSave = (data)=>{
    setSettings(data)
    localStorage.setItem("settings",JSON.stringify(data))
  }
  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return <ThemeProvider theme={theme}><Learn/></ThemeProvider>
      case 1:
        return <InputPage data={inputs} handleAddInput={handleAddInput} updateInputData={updateInputData}/>;
      case 2:
        return <ConfigPage data={configs} handleAddInput={handleAddConfig} updateInputData={updateConfigData}/>;
      case 3:
        return <ExecutionPage executionHistory={executionHistory} onExecute={handleAddExecution} inputs={inputs.map((inp,idx)=>{return {id:idx,...inp}})} configs={configs.map((cfg,idx)=>{return {id:idx,...cfg}})}/>;
      case 4:
        return <SettingsPage settings={settings} onSave={handleSettingSave}/>;
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
