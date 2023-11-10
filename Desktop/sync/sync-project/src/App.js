import React, { useState, useRef } from 'react';
import axios from 'axios';
import FormData from 'form-data';
import './App.css';
import syncLogo from './Sync.png'; 
import uploadImage from './upload-video-1.png'; 

const OPENAI_API_KEY = process.env.REACT_APP_API_KEY;
const model = "whisper-1";

function App() {
  const [transcription, setTranscription] = useState("");
  const fileInputRef = useRef(null); 

  const transcribe = (file) => {
    const formData = new FormData();
    formData.append("model", model);
    formData.append("file", file);
    axios
      .post("https://api.openai.com/v1/audio/transcriptions", formData, {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setTranscription(response.data.text);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      transcribe(selectedFile);
    }
  }

  function refreshPage() {
    window.location.reload(false);
  }

  function handleClick() {
    console.log('Upload image clicked');
    fileInputRef.current.click();  }

  return (
    <div className="App">
      <header className="App-header">
        <span className="header-sync" onClick={refreshPage}>Sync</span>
        <span className="header-beta">Beta</span>
      </header>
      <div className="center-container">
        <img src={syncLogo} alt="Sync logo" className="sync-logo" onClick={refreshPage} />
        <img src={uploadImage} alt="Upload" className="upload-image" onClick={handleClick} />
        <input
          type="file"
          accept=".mp3,.mp4"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <div>{transcription}</div>
      </div>
    </div>
  );
}

export default App;
