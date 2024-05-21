import React, { useState } from 'react';

const HighlightedWord = ({ word, startIndex, correctword, onClick, isIncorrect }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onClick(word, startIndex);
    setTimeout(() => setIsClicked(false), 1000); // Reset after animation duration
  };

  return (
    <span
      style={{ color: isIncorrect ? 'red' : 'yellow', cursor: 'pointer' }}
      className={isClicked ? 'shake-click' : ''}
      onClick={handleClick}
    >
      {word}
    </span>
  );
};

export default HighlightedWord;
