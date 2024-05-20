import './Demo.css'; // Make sure to create this CSS file

import React, { useEffect, useState } from 'react';

import HighlightedWord from './HighlightedWord';
import OpenAI from 'openai';
import axios from 'axios';

const Demo = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [text, setText] = useState(`
    Once upon a time, there was a little cat named Whiskers. 
    Whiskers loved to play in the garden and chase butterflise. 
    One day, Whiskers saw a big, colerful butterfly and started to run after it. 
    The butterfly flew higher and higher, and Whiskers jumped and jumped but could not reech it. 
    Finally, Whiskers sat down on the grass, tired and happy, and watched the butterfly flote away into the sky.
  `);
  const [highlightedText, setHighlightedText] = useState([]);
  const [imageText, setImageText] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clickedWord, setClickedWord] = useState(null);
  const [showTextBox, setShowTextBox] = useState(false);
  const [lesson, setLesson] = useState('');
  const [openai, setOpenai] = useState();
  const [sentenceImages, setSentenceImages] = useState([]);

  useEffect(() => {
    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_API_KEY,
      dangerouslyAllowBrowser: true 
    });
    setOpenai(openai);
  }, []);

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
        console.log('API response:', data);
        const highlightedText = applyHighlights(text, data.corrections, handleWordClick);
        setHighlightedText(highlightedText);
        generateImages(text);
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

      const isIncorrect = true;

      result.push(text.slice(lastIndex, startIndex));
      result.push(
        <HighlightedWord
          key={i}
          word={originalText}
          startIndex={startIndex}
          onClick={onClick}
          isIncorrect={isIncorrect}
        />
      );
      lastIndex = endIndex;
    });

    result.push(text.slice(lastIndex));
    return result;
  };

  const handleWordClick = async (word, index) => { 
    setClickedWord({ word, index });
    setShowTextBox(true);

    try {
        const lessonPlan = await fetchLesson(word);
        const formattedLesson = formatLessonPlan(JSON.parse(lessonPlan));
        setLesson(formattedLesson);
    } catch (error) {
        console.error('Error fetching lesson:', error);
    }
  };

  const fetchLesson = async (word) => {
    setLoading(true);

    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_API_KEY,
      dangerouslyAllowBrowser: true 
    });

    console.log('GENERATING LESSON')
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
          Create a json object of lessons.
          Create three keys: phonology (P), the sounds in heard/spoken words; orthography (O), the letters in read/written words; and morphology (M).
          and in the values create the lesson plans for each category.
        
          Create the lesson plan in one paragraph.
          `,
        },
        { role: "user", content: `Create a lesson that can teach the student how to correctly spell ${word} in one paragraph` },
      ],
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
    });
    console.log(completion.choices[0].message.content);

    setLoading(false);
    return completion.choices[0].message.content;
  };

  const formatLessonPlan = (lessonPlan) => {
    return `
    <h2>Lesson Plan for Spelling</h2>
    <div>
      <h3>Phonology</h3>
      <p>${lessonPlan.phonology.lesson_plan}</p>
    </div>
    <div>
      <h3>Orthography</h3>
      <p>${lessonPlan.orthography.lesson_plan}</p>
    </div>
    <div>
      <h3>Morphology</h3>
      <p>${lessonPlan.morphology.lesson_plan}</p>
    </div>
    `;
  };

  const fetchImage = async (sentence) => {

    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_API_KEY,
      dangerouslyAllowBrowser: true 
    });

    setLoading(true);

    console.log('GENERATING IMAGE')
    const response = await openai.images.generate({
      model:"dall-e-3",
      prompt: `${sentence}`,
      n: 1,
      size: "1024x1024",
    });
    const image_url = response.data[0].url;

    setLoading(false);
    return image_url;
  };

  const generateImages = async (text) => {
    
    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_API_KEY,
      dangerouslyAllowBrowser: true 
    });
    
    const sentences = text.match(/[^.!?]+[.!?]/g);
    const imagePromises = sentences.map(sentence => fetchImage(sentence.trim()));
    console.log('imagePromises', imagePromises)
    const images = await Promise.all(imagePromises);
    const imageTextWithImages = [];

    sentences.forEach((sentence, i) => {
      imageTextWithImages.push(sentence);
      if (images[i]) {
        imageTextWithImages.push(<img src={images[i]} alt="sentence illustration" key={`img-${i}`} width={100} height={100} />);
      }
    });

    setImageText(imageTextWithImages);
  };

  return (
    <div>
      <div>
        <h1>Tap Lessons</h1>
        <em>Tap the Incorrect words to see Lesson Plans</em>
        <div id="image"></div>
        <p className="highlighted-paragraph">{highlightedText}</p>
        {showTextBox && clickedWord && (
          <div>
            <p>Tapped word: {clickedWord.word}</p>
            <div>{lesson}</div>
            <div>{loading ? <p>Loading...</p> : <p></p>}</div>
          </div>
        )}
      </div>
      <div>
        <h1>Inline Images</h1>
        <em>Correct sentences will have images illustrating the sentence. For incorrect sentences, you have to correct them first!</em>
        <p className="highlighted-paragraph">{imageText}</p>
      </div>
    </div>
  );
};

export default Demo;


// add final example with inline explanations for text instead of doing it as a block in the end
// format the text nicely 
// do more research on the lesson quality
