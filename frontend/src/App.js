// App.js

import React, { useState } from 'react';
import axios from 'axios';
import './some.css';

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  const [openaiResponse, setOpenaiResponse] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleQueryChange = (event) => {
    setUserQuery(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('pdf_file', pdfFile);
    formData.append('user_query', userQuery);

    try {
      // Use your Flask backend URL
      const response = await axios.post('http://localhost:5000/process_pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newChatEntry = {
        userQuery: userQuery,
        openaiResponse: response.data.openai_response,
      };

      setChatHistory([...chatHistory, newChatEntry]);
      setUserQuery('');
      setOpenaiResponse('');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h1>PDF Upload</h1>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="pdfFile">Upload PDF File:</label>
            <input type="file" id="pdfFile" onChange={handleFileChange} accept=".pdf" required />
             <button type="submit">Submit</button>
          </div>
        </form>
      </div>

      <div className="content">
        <h1>Chatbot</h1>

        {chatHistory.map((entry, index) => (
          <div key={index} className="chat-entry">
            <div className='user-message'>{entry.userQuery}</div>
            <div className='bot-message'>{entry.openaiResponse}</div>
          </div>
        ))}
        <div className='input'>
          <input type="text" id="userQuery" value={userQuery} placeholder='Ask your query here' onChange={handleQueryChange} required />
          <button type="submit" onClick={handleFormSubmit}>Send Query</button>
        </div>
        
      </div>
    </div>
  );
}

export default App;
