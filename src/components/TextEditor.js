import 'react-quill/dist/quill.snow.css';

// src/components/TextEditor.js
import React, { useState } from 'react';

import ReactQuill from 'react-quill';
import axios from 'axios';

const TextEditor = () => {
  const [content, setContent] = useState('');

  const handleChange = (value) => {
    setContent(value);
  };

  const handleSave = () => {
    axios.post('http://localhost:5000/save', { content })
      .then(response => {
        alert(response.data.status);
      })
      .catch(error => {
        console.error('There was an error saving the content!', error);
      });
  };

  return (
    <div>
      <ReactQuill value={content} onChange={handleChange} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default TextEditor;
