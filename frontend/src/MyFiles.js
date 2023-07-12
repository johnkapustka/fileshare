import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './MyFiles.css'
import './App.css'

Modal.setAppElement('#root')

const MyFiles = () => {
  const [files, setFiles] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [currentFileId, setCurrentFileId] = useState('');
  const [usernameToShareWith, setUsernameToShareWith] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    axios.get('http://localhost:8000/my-files/', {
      headers: {
        'Authorization': `Token ${authToken}` 
      },
    })
    .then(response => {
      setFiles(response.data);  
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  }, []);

  const openModal = (fileId) => {
    setIsOpen(true);
    setCurrentFileId(fileId);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    const authToken = localStorage.getItem('authToken');

    axios.post('http://localhost:8000/share/', {
      file_id: currentFileId,
      username_to_share_with: usernameToShareWith
    }, {
      headers: {
        'Authorization': `Token ${authToken}` 
      },
    })
    .then(response => {
      setMessage('File successfully shared!');
      setIsOpen(false);
      setUsernameToShareWith('');
    })
    .catch(error => {
      setError('There was an error sharing the file.');
    });
  };

  return (
    <div className="myFiles">
      <h1>My Files</h1>
      {files.map(file => (
        <div key={file.id} className="fileItem">
          <h4>{file.original_file_name}</h4>
          <button onClick={() => openModal(file.id)}>Share</button>
        </div>
      ))}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Share File Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <button className="modal-close" onClick={closeModal}>Close</button>
        <form onSubmit={handleSubmit}>
          <input type="text" value={usernameToShareWith} onChange={(e) => setUsernameToShareWith(e.target.value)} placeholder="Username to share with" />
          <button type="submit">Share File</button>
        </form>
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
      </Modal>
    </div>
  );
};

export default MyFiles;

