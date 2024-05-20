import React, { useEffect, useState } from 'react';

const HighlightedWord = ({ word, startIndex, onClick }) => {
  return (
    <span
      style={{ backgroundColor: 'yellow', cursor: 'pointer' }}
      onClick={() => onClick(word, startIndex)}
    >
      {word}
    </span>
  );
};

const Demo = () => {
  const [text, setText] = useState(`
    Once upon a time, there was a little cat named Whiskers. 
    Whiskers loved to play in the garden and chase butterflise. 
    One day, Whiskers saw a big, colerful butterfly and started to run after it. 
    The butterfly flew higher and higher, and Whiskers jumped and jumped but could not reech it. 
    Finally, Whiskers sat down on the grass, tired and happy, and watched the butterfly flote away into the sky.
  `);
  const [highlightedText, setHighlightedText] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clickedWord, setClickedWord] = useState(null);
  const [showTextBox, setShowTextBox] = useState(false);

  useEffect(() => {
    setLoading(true);
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer GzEiUAgBjzJqBUOooHifDpN0WY55a5l7'
      },
      body: JSON.stringify({ text: text })
    };

    fetch('https://api.ai21.com/studio/v1/gec', options)
      .then(response => response.json())
      .then(data => {
        console.log('API response:', data); // Log the entire response for debugging
        setHighlightedText(applyHighlights(text, data.corrections, handleWordClick));
        setLoading(false);
      })
      .catch(err => {
        console.error('API error:', err);
        setLoading(false);
      });
  }, [text]);

  const applyHighlights = (text, corrections, onClick) => {
    let result = [];
    let lastIndex = 0;

    corrections.forEach((correction, i) => {
      let { originalText, startIndex, endIndex } = correction;

      if (originalText.endsWith('.')) {
        originalText = originalText.slice(0, -1);
        endIndex -= 1;
      }

      result.push(text.slice(lastIndex, startIndex));
      result.push(
        <HighlightedWord
          key={i}
          word={originalText}
          startIndex={startIndex}
          onClick={onClick}
        />
      );
      lastIndex = endIndex;
    });

    result.push(text.slice(lastIndex));
    return result;
  };

  const handleWordClick = (word, index) => {
    setClickedWord({ word, index });
    setShowTextBox(!showTextBox);
  };

  return (
    <div>
      <h1>Corrected Text</h1>
      {loading ? <p>Loading...</p> : <p>{highlightedText}</p>}
      {showTextBox && clickedWord && (
        <div>
          <p>Tapped word: {clickedWord.word}</p>
        </div>
      )}
    </div>
  );
};

export default Demo;
