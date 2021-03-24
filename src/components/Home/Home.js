import React, { useState, useRef, useEffect } from 'react'
import wordsArray from '../../utils/words.json'
import { shuffle, get } from 'lodash'
import { formatTime } from '../../utils/formatTime'
import './Home.scss'

const Home = () => {
  const[words] = useState(shuffle(wordsArray))
  const[chars, setChars] = useState('')
  const[error, setError] = useState(false)
  const[hits, setHits] = useState(0)
  const[score, setScore] = useState(0)
  const[timer, setTimer] = useState(0)
  const[errors, setErrors] = useState(0)
  const[pause, setPause] = useState(false)
  const[first, setFirst] = useState(0)
  const[end, setEnd] = useState(false)
  const countRef = useRef(null)

  useEffect(() => {
    if(timer === 60){
      clearInterval(countRef.current)
      setEnd(true)
      setPause(true)
    }
  }, [timer])

  const handleInput = (e) => {
    if(first === 0){handleTimer()}
    setFirst(1)
    const char = e.target.value
    setChars(char.trim())
    if(char.trim() === ''){return}
    const slicedWord = get(words, '[0]', '').slice(0, char.length)
    const erro = slicedWord === char.trim()
    erro ? setError(false) :  setError(true)
  }

  const passWord = () => {
    setScore(score+1)
    if(error){
      setChars('')
      words.splice(0, 1)
      setError(false)
      setErrors(errors+1)
      return
    }
    words.splice(0, 1)
    setChars('')
    setHits(hits+1)
  }

  const handleTimer = () => {
    if(!pause){
      countRef.current = setInterval(() => {
        setTimer((timer) => timer + 1)
      }, 1000)
    }
  }

  const reset = () => {
    setHits(0)
    setScore(0)
    setTimer(0)
    setFirst(0)
    setError(false)
    setChars('')
    setEnd(false)
    setPause(false)
  }

  return(
    <div className="home-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-4">
            <div className="clock">
              <span className="clock-font">{formatTime(timer)}</span>
            </div>
          </div>
        </div>
        {end ?
          <div className="row justify-content-center">
            <div className="col-8">
              <div className="card">
                <span>Quantidade de erros: {errors}</span>
                <br/>
                <span>Quantidade de acertos: {hits}</span>
                <br/>
                <span>Palavras por minuto: {score}</span>
                <br/>
                <span className="material-icons icon" onClick={() => reset()}> 
                  restart_alt
                </span>
              </div>
            </div>
          </div>
        : 
        <div>
          <div className="row">
            <div className="col-12 justify-content-center border">
              <span className={error ? "error" : ""}>{words[0]}</span>  <span>{words[1]}</span>  <span>{words[2]}</span>  <span>{words[3]}</span>  <span>{words[4]} </span>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <input className={error ? "" : ""} type="text" name="name" value={chars} onChange={(e) => handleInput(e)}
                onKeyPress={event => event.key === "Spacebar" || event.key  === " " ? passWord() : null}/>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  )
}

export default Home