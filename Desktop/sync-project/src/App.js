import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState('');

  async function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        const response = await fetch('http://localhost:3001/transcribe', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          setTranscription(data.transcription);
        } else {
          const data = await response.json();
          console.error("Error from server:", data.message);
        }
      } catch (error) {
        console.error("Error processing file:", error);
      }
    }
  }

  function downloadTranscription() {
    const element = document.createElement("a");
    const file = new Blob([transcription], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "transcription.txt";
    document.body.appendChild(element);
    element.click();
  }

  return (
    <div className="App">
      <div className="center-container">
        <h1 className="sync-title">Sync</h1>
        <div className="search-bar">
          <input type="file" accept=".mp3,.mp4" onChange={handleFileChange} />
          {file && <p>Selected file: {file.name}</p>}
          {transcription && (
            <div>
              <button onClick={downloadTranscription}>Download Transcription</button>
              <pre>{transcription}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;