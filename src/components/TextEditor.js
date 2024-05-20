import 'react-quill/dist/quill.snow.css';

// src/components/TextEditor.js
import React, { useState } from 'react';

import ReactQuill from 'react-quill';

// set up grammar detection pi 
const TextEditor = () => {
  const [content, setContent] = useState('');

  const handleChange = (value) => {
    setContent(value);
  };

  const handleSave = () => {
    
  };

  return (
    <div>
      <ReactQuill value={content} onChange={handleChange} />
        <div className="drawing-canvas">
        </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default TextEditor;
