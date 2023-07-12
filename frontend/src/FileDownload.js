import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FileDownload = ({ fileId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const authToken = localStorage.getItem('authToken');

    axios({
      method: 'get',
      url: `http://localhost:8000/download/${fileId}/`,
      responseType: 'blob',
      headers: {
        'Authorization': `Token ${authToken}`
      }
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
      setError('Error downloading file. Please try again.');
    })
    .finally(() => {
      setLoading(false);
    });
  }, [fileId]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default FileDownload;

