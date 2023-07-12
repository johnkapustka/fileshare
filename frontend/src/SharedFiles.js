import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SharedFiles = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    axios.get('http://localhost:8000/shared-with-me/', {
      headers: {
        'Authorization': `Token ${authToken}` 
      },
    })
    .then(response => {
      setFiles(response.data);
    })
    .catch(error => {
      setError('There was an error fetching shared files.');
    });
  }, []);

  return (
    <div>
      <h1>Shared Files</h1>
      {error && <p>{error}</p>}
      {files.length > 0 ? (
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              <a href={`/download/${file.id}`}>{file.original_file_name}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No files shared with you yet.</p>
      )}
    </div>
  );
};

export default SharedFiles;

