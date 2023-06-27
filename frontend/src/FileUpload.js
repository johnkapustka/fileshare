import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const FileUpload = () => {
  const [error, setError] = useState('');
  const [downloadCode, setDownloadCode] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    setError('');
    const file = acceptedFiles[0];

    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:8000/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      setDownloadCode(response.data.download_code);
    })
    .catch(error => {
      setError('Error uploading file. Please try again.');
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(downloadCode);
  };

  return (
    <div>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {error && <p>{error}</p>}
      {downloadCode && (
        <div>
          <p>Download code: {downloadCode}</p>
          <button onClick={copyToClipboard}>Copy to clipboard</button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

