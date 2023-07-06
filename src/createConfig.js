import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Editor from './Editor';

const CreateConfigModal = ({ open, onClose, onSave }) => {
  const [configName, setConfigName] = useState('');
  const [namespace, setNamespace] = useState('');
  const [version, setVersion] = useState('');
  const [action, setAction] = useState('');
  const [gateway, setGateway] = useState('');
  const [configData, setConfigData] = useState(null);

  const handleSave = () => {
    // Perform save logic or call a save function here
    onSave({
      name: configName,
      data: {
        namespace,
        version,
        action,
        gateway,
        ...configData,
      },
    });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Create Config</DialogTitle>
      <DialogContent>
        <TextField
          label="Config Name"
          variant="outlined"
          value={configName}
          onChange={(e) => setConfigName(e.target.value)}
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Namespace"
          variant="outlined"
          value={namespace}
          onChange={(e) => setNamespace(e.target.value)}
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Version"
          variant="outlined"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Action"
          variant="outlined"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Gateway"
          variant="outlined"
          value={gateway}
          onChange={(e) => setGateway(e.target.value)}
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
        <Editor onChange={setConfigData} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateConfigModal;
