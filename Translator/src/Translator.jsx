import React, { useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import TextInput from './TextInput';
import { useSpeechSynthesis } from 'react-speech-kit';
import './Translator.css';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ja', name: 'Japanese' },
  { code: 'it', name: 'Italian' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ne', name: 'Nepali' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'bn', name: 'Bengali' },
  { code: 'th', name: 'Thai' },
];

const randomWords = ['Hello', 'World', 'React', 'Translate', 'Game', 'Challenge', 'Victory', 'Random'];

const Translator = () => {
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState(null);
  const { speak } = useSpeechSynthesis();
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [quizOptions, setQuizOptions] = useState([]);
  const [scrambledWord, setScrambledWord] = useState('');
  const [userScrambleAnswer, setUserScrambleAnswer] = useState('');
  const [timer, setTimer] = useState(30);
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    if (gameActive && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [gameActive, timer]);

  const handleTranslate = async () => {
    setError(null);
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`
      );
      const data = await response.json();
      if (data.responseData.translatedText) {
        setTranslatedText(data.responseData.translatedText);
      } else {
        setError('Translation failed.');
      }
    } catch (err) {
      setError(`Translation error: ${err.message}`);
    }
  };

  const handleTextToSpeech = () => {
    speak({ text: translatedText, lang: targetLanguage });
  };

  const startQuiz = () => {
    const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
    setQuizQuestion(randomWord);
    setQuizOptions(['Bonjour', 'Hola', 'Hallo']);
    setGameActive(true);
    setTimer(30);
  };

  const handleQuizAnswer = (answer) => {
    if (answer === 'Hola') {
      setScore((prev) => prev + 10);
    }
    setGameActive(false);
  };

  const startScrambleGame = () => {
    const word = randomWords[Math.floor(Math.random() * randomWords.length)];
    setScrambledWord(word.split('').sort(() => Math.random() - 0.5).join(''));
    setGameActive(true);
    setTimer(30);
  };

  const checkScrambleAnswer = () => {
    if (userScrambleAnswer === scrambledWord.split('').sort().join('')) {
      setScore((prev) => prev + 15);
    }
    setGameActive(false);
  };

  return (
    <div className='fullbody'>
      <h1>Language Translator with Games</h1>
      <LanguageSelector label='From:' value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)} languages={languages} />
      <LanguageSelector label='To:' value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} languages={languages} />
      <TextInput label='Text to translate:' value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleTranslate}>Translate</button>
      <button onClick={handleTextToSpeech}>Play Translation</button>
      <TextInput label='Translated Text:' value={translatedText} disabled />
      
      <h2>Games</h2>
      <button onClick={startQuiz}>Start Quiz</button>
      <button onClick={startScrambleGame}>Start Scramble</button>

      {gameActive && quizQuestion && (
        <div>
          <h3>{quizQuestion}</h3>
          {quizOptions.map((option, index) => (
            <button key={index} onClick={() => handleQuizAnswer(option)}>{option}</button>
          ))}
          <p>Time Left: {timer} sec</p>
        </div>
      )}

      {gameActive && scrambledWord && (
        <div>
          <h3>Unscramble: {scrambledWord}</h3>
          <input type='text' value={userScrambleAnswer} onChange={(e) => setUserScrambleAnswer(e.target.value)} />
          <button onClick={checkScrambleAnswer}>Submit</button>
          <p>Time Left: {timer} sec</p>
        </div>
      )}

      <p>Score: {score}</p>
    </div>
  );
};

export default Translator;

