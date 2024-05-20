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
