import './App.css'
import { useEffect, useState } from 'react'
import wordFile from './words.txt'
import questionMarkImage from './images/question-mark.jpg'
import { getWordDefinition } from './api'

// import words from './words.txt'

function App () {
  const [wordLetters, setWordLetters] = useState([])
  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  const [guessLetters, setGuessLetters] = useState([])
  const [isUpdated, setIsUpdated] = useState(false)
  // const wordList = ['balloon', 'dictionary', 'gamble']
  const [gameRound, setGameRound] = useState(0)
  const [gameIsComplete, setGameIsComplete] = useState(false)
  const [wordString, setWordString] = useState()
  const [newWordList, setNewWordList] = useState()
  const [newWord, setNewWord] = useState()
  const [wordHistory, setWordHistory] = useState([])

  fetch(wordFile)
    .then(response => response.text())
    .then(text => setWordString((JSON.stringify(text))))

  function randomWord (words) {
    return words[Math.floor(Math.random() * words.length)]
  }

  function updateDefinition (searchWord) {
    getWordDefinition(searchWord)
  }
  useEffect(createWordList, [wordString])
  function createWordList () {
    if (wordString) {
      const splitString = wordString.split('\\n')
      setNewWordList(splitString)
    }
  }
  useEffect(setWord, [newWordList])
  function setWord () {
    if (newWordList) {
      let wordIsSet = false
      while (wordIsSet === false) {
        const possibleWord = randomWord(newWordList)
        console.log(possibleWord)
        if (possibleWord.length < 9) {
          // getWordDefinition()
          const result = 'random string'
          if (result) {
            setNewWord(possibleWord)
            // setWordDefinition(result)
            wordIsSet = true
          }
        }
      }
    }
  }

  useEffect(displayWord, [newWord])
  function displayWord () {
    if (newWord) {
      const letterList = []
      const word = newWord.toLowerCase()
      for (const letter of word) {
        letterList.push(letter)
      }
      setWordLetters(letterList)
    }
  }

  function updateGame () {
    let index = 1
    if (newWord) {
      const word = newWord.toLowerCase()
      for (const letter of word) {
        if (guessLetters.includes(letter)) {
          if (index < word.length) {
            index += 1
            console.log(index)
          } else {
            setGameIsComplete(true)
          }
        } else {
          return
        }
      }
    }
  }

  function gameComplete () {
    setGameIsComplete(false)
    setGameRound(gameRound + 1)
    setGuessLetters([])
    const myHistory = wordHistory
    myHistory.push(newWord)
    setWordHistory(myHistory)
    setWord()
  }

  function handleGuessLetters (letter) {
    if (guessLetters) {
      const newGuesses = guessLetters
      newGuesses.push(letter)
      setGuessLetters(newGuesses)
      console.log(newGuesses)
      setIsUpdated(true)
      updateGame()
    }
  }
  useEffect(updateGuessLetters, [guessLetters, isUpdated])

  function updateGuessLetters () {
    if (isUpdated) {
      setGuessLetters(guessLetters)
      setIsUpdated(false)
    }
  }

  return (
    <div>
      <header className='header'>
        <div style={{ minWidth: '250px', height: '15vh', maxWidth: '30%', backgroundSize: 'cover', backgroundImage: `url(${questionMarkImage})` }} />
        <div>
          This will be Mystery Word
        </div>
        <div style={{ minWidth: '250px', height: '15vh', maxWidth: '30%', backgroundSize: 'cover', backgroundImage: `url(${questionMarkImage})` }} />

      </header>
      {wordLetters && alphabet && guessLetters && wordHistory && newWord && (
        <div className='game-container'>

          <div className='scoreboard' style={{ display: 'flex' }}>
            {wordLetters.map((letter, idx) => (
              <div key={idx}>
                <div className={guessLetters.includes(letter) ? 'letter-box-found' : 'letter-box'}><span className={guessLetters.includes(letter) ? 'show' : 'hide'}>{letter.toUpperCase()}</span></div>
              </div>
            ))}
          </div>
          <div style={{ width: '85%', display: 'flex', flexWrap: 'wrap' }}>
            {alphabet.map((letter, idx) =>
              <div value={letter} onClick={() => handleGuessLetters(letter)} className={guessLetters.includes(letter) ? 'guess-box-guessed' : 'guess-box'} key={idx}><span className={guessLetters.includes(letter) && !wordLetters.includes(letter) ? 'highlight' : null}>{letter.toUpperCase()}</span></div>)}
          </div>
          <div className='summary'>
            <div className='mini-board' style={{ flexBasis: '15%', display: 'flex', flexDirection: 'column' }}>
              <div onClick={() => gameComplete()}>{gameIsComplete ? 'Play Again' : 'Start New Round'}</div>
            </div>
            <div className='mini-board' style={{ flexBasis: '50%', display: 'flex', flexDirection: 'column' }}>
              <div onClick={() => updateDefinition(newWord)}>Lookup Word</div>
            </div>
            <div className='mini-board' style={{ flexBasis: '30%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>Word History</div>
              <div style={{ marginTop: '40px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {wordHistory.map((word, idx) =>
                  <div style={{ display: 'flex' }} key={idx}>{word.toUpperCase()}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
