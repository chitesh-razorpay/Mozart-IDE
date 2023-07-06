import React from 'react';
import { Button,Modal,TextField } from '@mui/material';

const Setting = ({ showModal, closeModalHandler }) => {
  const [mozartUrl, setMozartUrl] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Perform submit logic or call a submit function here
    console.log('Form submitted:', { mozartUrl, username, password });
  };

  const handleCloseModal = () => {
    // Handle closing the modal
    closeModalHandler();
  };

  return (
    <Modal open={showModal} onClose={handleCloseModal}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          padding: '20px',
          outline: 'none',
        }}
      >
        <form onSubmit={handleFormSubmit}>
          <TextField
            label="Mozart URL"
            variant="outlined"
            value={mozartUrl}
            onChange={(e) => setMozartUrl(e.target.value)}
            fullWidth
            style={{ marginBottom: '20px' }}
          />
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            style={{ marginBottom: '20px' }}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            style={{ marginBottom: '20px' }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Submit
          </Button>
        </form>
        <Button onClick={handleCloseModal} color="secondary" fullWidth>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default Setting;
