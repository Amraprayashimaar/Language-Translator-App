You said:
import React, { useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import TextInput from './TextInput';
import { useSpeechSynthesis } from 'react-speech-kit';
import './Translator.css'
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

const Translator = () => {
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState(null);
  const [voices, setVoices] = useState([]);
  const { speak } = useSpeechSynthesis();
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Load available voices when the component mounts
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // In some browsers, the voices are not available immediately
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleTranslate = async () => {
    setError(null); // Reset error before each translation attempt
    try {
      const response = await fetch(
        https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=${sourceLanguage}|${targetLanguage}
      );

      if (!response.ok) {
        throw new Error(Error: ${response.status} - ${response.statusText});
      }

      const data = await response.json();
      if (data.responseData.translatedText) {
        setTranslatedText(data.responseData.translatedText);
      } else {
        setError('Translation failed. Please try again.');
      }
    } catch (err) {
      setError(Translation error: ${err.message});
    }
  };

  const handleTextToSpeech = () => {
    // Find a voice that matches the target language
    const voice = voices.find((v) => v.lang.startsWith(targetLanguage));

    if (!voice) {
      setError(Sorry, no voice is available for the language: ${targetLanguage});
      return;
    }

    speak({ text: translatedText, voice, lang: targetLanguage });
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Sorry, your browser doesn't support speech recognition.");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = sourceLanguage;
    recognitionInstance.interimResults = false;
    recognitionInstance.maxAlternatives = 1;

    recognitionInstance.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setText(speechResult);
    };

    recognitionInstance.onerror = (event) => {
      setError(Speech recognition error: ${event.error});
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.start();
    setRecognition(recognitionInstance);
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className='fullbody'>
      <h1 style={{fontSize:'50px'}}>Language Translator with Voice</h1>
      <h2 style={{color:'blueviolet', fontFamily:'fantasy', fontWeight:'bold'}}>
  Translate your language here! <span style={{ fontSize: '34px' }}>{"\u{1F4E3}"}</span> Enjoy translating! <span style={{ fontSize: '35px' }}>{"\u{1F50A}"}</span>
</h2>
<h2 style={{textAlign:'left', textDecoration:'underline'}}>Select Language.....</h2>
      <div className='Selector'>
       
      <LanguageSelector
        label="From:"
        value={sourceLanguage}
        onChange={(e) => setSourceLanguage(e.target.value)}
        languages={languages}
      />
      <LanguageSelector 
        label="To:"
        value={targetLanguage}
        onChange={(e) => setTargetLanguage(e.target.value)}
        languages={languages}
      />
      </div>
      <TextInput
        label="Text to translate:"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleTranslate} style={{ marginRight: "10px" }}>
          Translate
        </button>
        <button
          onClick={isListening ? stopListening : startListening}
          style={{ marginRight: "10px" }}
        >
          {isListening ? "Listening... Click to stop" : "Start Listening"}
        </button>
        <button onClick={handleTextToSpeech}>Play Translation</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <TextInput
        label="Translated Text:"
        value={translatedText}
        disabled
      />
    </div>
  );
};

export default Translator;

 
 
  
     
    
