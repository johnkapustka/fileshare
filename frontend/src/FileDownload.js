import React, { useState } from 'react';
import axios from 'axios';

const FileDownload = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    axios({
      method: 'get',
      url: `http://localhost:8000/download/?code=${code}`,
      responseType: 'blob',
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const fileName = response.headers['content-disposition'].split('filename=')[1];
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => {
      setError('Error downloading file. Please check the download code and try again.');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter download code" />
      <button type="submit" disabled={loading}>Download</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </form>
  );
};

export default FileDownload;

