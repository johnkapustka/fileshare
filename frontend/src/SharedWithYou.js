import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FileDownload from './FileDownload';
import './SharedWithYou.css';
import './App.css';

const SharedWithYou = () => {
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    axios.get('http://localhost:8000/shared-with-me/', {
      headers: {
        'Authorization': `Token ${authToken}`
      }
    })
    .then((response) => {
      setFiles(response.data);
    })
    .catch((error) => {
      setError('Error loading shared files. Please try again.');
    });
  }, []);

  return (
    <div className="sharedWithYou">
      <h1>Shared With You</h1>
      {error && <p>{error}</p>}
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            {file.original_file_name} - shared by {file.user.username}
            <button onClick={() => setSelectedFileId(file.id)}>Download</button>
          </li>
        ))}
      </ul>
      {selectedFileId && <FileDownload fileId={selectedFileId} />}
    </div>
  );
};

export default SharedWithYou;

