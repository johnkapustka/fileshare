import React, { useState } from 'react';
import axios from 'axios';

const FileShare = () => {
  const [fileId, setFileId] = useState('');
  const [usernameToShareWith, setUsernameToShareWith] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    const authToken = localStorage.getItem('authToken');

    axios.post('http://localhost:8000/share/', {
      file_id: fileId,
      username_to_share_with: usernameToShareWith
    }, {
      headers: {
        'Authorization': `Token ${authToken}` 
      },
    })
    .then(response => {
      setMessage('File successfully shared!');
    })
    .catch(error => {
      setError('There was an error sharing the file.');
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={fileId} onChange={(e) => setFileId(e.target.value)} placeholder="File ID" />
      <input type="text" value={usernameToShareWith} onChange={(e) => setUsernameToShareWith(e.target.value)} placeholder="Username to share with" />
      <button type="submit">Share File</button>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </form>
  );
};

export default FileShare;

