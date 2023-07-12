import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './FileUpload.css'
import './App.css'

const FileUpload = () => {
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setError('');
    setUploadSuccess(false);
    
    const file = acceptedFiles[0];
    const authToken = localStorage.getItem('authToken');
    const formData = new FormData();

    formData.append('file', file);

    axios.post('http://localhost:8000/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Token ${authToken}` 
      },
    })
    .then(response => {
      setUploadSuccess(true);
    })
    .catch(error => {
      setError('There was an error uploading your file!');
      console.error('There was an error!', error);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="file-upload">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop some files here, or click to select files</p>
        )}
      </div>
      {error && <p className="error">{error}</p>}
      {uploadSuccess && <p className="success">Your file has been uploaded successfully.</p>}
    </div>
  );
};

export default FileUpload;



