import './App.css'
import { useEffect, useState } from 'react'
import wordFile from './words.txt'
import questionMarkImage from './images/question-mark.jpg'
// import grainyBlackBackground from './images/grainy-black-background.jpg'
import { getWordDefinition } from './api'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

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
  const [definition, setDefinition] = useState()
  const [show, setShow] = useState(false)
  const [showDefinition, setShowDefinition] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  fetch(wordFile)
    .then(response => response.text())
    .then(text => setWordString((JSON.stringify(text))))

  function randomWord (words) {
    return words[Math.floor(Math.random() * words.length)]
  }

  function updateDefinition (searchWord) {
    getWordDefinition(searchWord).then(shortdef => {
      console.log(shortdef)
      setDefinition(shortdef)
      setShowDefinition(!showDefinition)
    })
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
          // getWordDefinition(possibleWord).then(shortdef => {
          //   console.log(shortdef)
          //   setDefinition(shortdef)
          // })
          setNewWord(possibleWord)
          wordIsSet = true
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
    setDefinition()
    setShowDefinition(false)
    setShow(false)
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
    <Router>
      <Switch>

        <Route path='/'>
          <div style={{ width: '100%', height: '100vh' }}>
            <header className='header'>
              <div style={{ minWidth: '100%', height: '7vh', maxWidth: '30%', backgroundSize: 'contain', backgroundImage: `url(${questionMarkImage})` }} />

              {/* <div style={{ minWidth: '250px', height: '15vh', maxWidth: '30%', backgroundSize: 'cover', backgroundImage: `url(${questionMarkImage})` }} /> */}

            </header>
            {/* <div className='header' style={{ backgroundSize: 'cover', backgroundImage: `url(${questionMarkImage})`, color: 'white', fontSize: '50px', textAlign: 'center' }}>
              Mystery Word
            </div> */}
            {wordLetters && alphabet && guessLetters && wordHistory && newWord && (
              <div>
                <div className='game-container'>

                  <div className='scoreboard' style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ color: 'white', fontSize: '35px', textAlign: 'center' }}>Mystery Word</div>
                    <div style={{ display: 'flex' }}>
                      {wordLetters.map((letter, idx) => (
                        <div key={idx}>
                          <div className={guessLetters.includes(letter) ? 'letter-box-found' : 'letter-box'}><span className={guessLetters.includes(letter) ? 'show' : 'hide'}>{letter.toUpperCase()}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#00000061', width: '85%', display: 'flex', flexWrap: 'wrap' }}>
                    {alphabet.map((letter, idx) =>
                      <div value={letter} onClick={() => handleGuessLetters(letter)} className={guessLetters.includes(letter) ? 'guess-box-guessed' : 'guess-box'} key={idx}><span className={guessLetters.includes(letter) && !wordLetters.includes(letter) ? 'highlight' : null}>{letter.toUpperCase()}</span></div>)}
                  </div>
                  <div className='summary'>
                    <div className='mini-board' style={{ flexBasis: '18%', display: 'flex', flexDirection: 'column' }}>
                      <div className='button' onClick={() => gameComplete()}>{gameIsComplete ? 'Play Again' : 'Start New Round'}</div>
                    </div>
                    <div className='mini-board' style={{ flexBasis: '40%', display: 'flex', flexDirection: 'column' }}>
                      <div className='button' onClick={() => updateDefinition(newWord)}>Lookup Word</div>
                      <div style={{ marginTop: '25px' }}>{showDefinition && (
                        <div>
                          <div style={{ fontSize: '18px' }}>{definition || 'definition not available'}</div>
                          {/* <div style={{ marginTop: '20px' }} className='button' onClick={() => setShowDefinition(false)}>Hide Definition</div> */}
                          {/* <div>{definition}</div>
                  <div className='button' onClick={() => setShowDefinition(false)}>Hide Definition</div> */}
                        </div>
                      )}
                      </div>

                    </div>
                    <div className='mini-board' style={{ flexBasis: '18%' }}>
                      <div className='button' onClick={() => setShow(!show)}>{show ? 'Hide Word' : 'Show Word'}</div>
                      {show && <div style={{ marginTop: '25px' }}>{newWord}</div>}
                    </div>
                    <div className='mini-board' style={{ flexBasis: '30%', display: 'flex', flexDirection: 'column' }}>
                      <div className='button' onClick={() => setShowHistory(!showHistory)}>{showHistory ? 'Hide History' : 'Word History'}</div>
                      {showHistory && <div style={{ marginTop: '25px', display: 'flex', flexWrap: 'wrap' }}>
                        {wordHistory.map((word, idx) =>
                          <div style={{ display: 'flex', padding: '5px', fontSize: '20px' }} key={idx}>{word}</div>
                        )}
                                      </div>}
                    </div>
                  </div>
                </div>
                <div style={{ width: '20%' }} />
              </div>
            )}
            {/* <div style={{ minWidth: '100%', height: '7vh', maxWidth: '30%', backgroundSize: 'contain', backgroundImage: `url(${questionMarkImage})` }} /> */}

          </div>
        </Route>
        {/* <Route path='/'>
          <div style={{ minWidth: '100%', height: '100vh', backgroundSize: 'cover', backgroundImage: `url(${questionMarkImage})` }}>
            <Link to='/game' className='button'>Ready to Play</Link>
          </div>
        </Route> */}
      </Switch>
    </Router>
  )
}

export default App
