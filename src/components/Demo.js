import React, { useEffect, useState } from 'react';

const Demo = () => {
  const [text, setText] = useState(`
    Once upon a time, there was a littel cat named Whiskers. 
    Whiskers loved to play in the garden and chase butterflise. 
    One day, Whiskers saw a big, colerful butterfly and started to run after it. 
    The butterfly flew higher and higher, and Whiskers jumped and jumped but could not reech it. 
    Finally, Whiskers sat down on the grass, tired and happy, and watched the butterfly flote away into the sky.
  `);
  const [highlightedText, setHighlightedText] = useState('');
  const [loading, setLoading] = useState(false);

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
        setHighlightedText(applyHighlights(text, data.corrections));
        setLoading(false);
      })
      .catch(err => {
        console.error('API error:', err);
        setLoading(false);
      });
  }, [text]);

  const applyHighlights = (text, corrections) => {
    let result = text;
    let offset = 0; // To adjust for added HTML tags

    corrections.forEach(correction => {
      console.log('data', correction);
      let { originalText, startIndex, endIndex } = correction;

      // Check if the originalText ends with a period and remove it
      if (originalText.endsWith('.')) {
        originalText = originalText.slice(0, -1);
        endIndex -= 1;
      }

      console.log('origin', originalText, startIndex, endIndex);
      const highlighted = `<span style="background-color: yellow;">${originalText}</span>`;
      const before = result.slice(0, startIndex + offset);
      const after = result.slice(endIndex + offset);
      result = before + highlighted + after;
      offset += highlighted.length - (endIndex - startIndex);
    });

    return result;
  };

  return (
    <div>
      <h1>Original Text</h1>
      <p>{text}</p>
      <h1>Corrected Text</h1>
      {loading ? <p>Loading...</p> : <p dangerouslySetInnerHTML={{ __html: highlightedText }} />}
    </div>
  );
};

export default Demo;
