import type { NextPage } from 'next'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

const COLORS = ['aqua', 'yellow', 'purple', 'blue', 'orange', 'green']

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #008080;
`
const Board = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-around;
  width: 80vh;
  height: 96vh;
  background-color: #ccc;
  border: 0.8vh solid;
  border-color: #ddd #666 #666 #ddd;
`
const GameBoard = styled.div`
  width: 42vh;
  height: 82vh;
  margin-bottom: 2vh;
  background-color: #888;
  border: 1vh solid;
  border-color: #666 #ddd #ddd #666;
`
const StateBoard = styled.div`
  width: 30vh;
  height: 90vh;
  margin-bottom: 2vh;
  background-color: #aaa;
  border: 1vh solid #666;
`
const TetrominoSquare = styled.div<{ num: number }>`
  display: inline-block;
  width: 4vh;
  height: 4vh;
  vertical-align: bottom;
  background-color: ${(props) =>
    1 <= props.num && props.num <= 6 ? COLORS[props.num - 1] : '#111'};
  border: 0.05vh solid #999;
`

const Home: NextPage = () => {
  const startBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]
  const startTetromino = {
    left: 1,
    top: 1,
    block: [
      [0, 1, 0],
      [1, 1, 1],
    ],
  }
  const [board, setBoard] = useState(startBoard)
  const [tetromino, setTetromino] = useState(startTetromino)
  const [pressKey, setPressKey] = useState(0)
  const [timer, setTimer] = useState(0)

  const viewBoard = useMemo(() => {
    const newBoard: number[][] = JSON.parse(JSON.stringify(board))
    for (let y = 0; y < tetromino.block.length; y++) {
      for (let x = 0; x < tetromino.block[y].length; x++) {
        newBoard[y + tetromino.top][x + tetromino.left] = tetromino.block[y][x]
      }
    }
    return newBoard
  }, [timer])

  const checkKeyDown = (event: KeyboardEvent) => {
    console.log(111, event.key)
    if (event.key === 'ArrowRight') {
      setPressKey(1)
    } else {
      setPressKey(0)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', checkKeyDown, false)
    return () => {
      document.removeEventListener('keydown', checkKeyDown, false)
    }
  }, [timer])

  useEffect(() => {
    const id = setInterval(() => {
      setTimer((t) => t + 1)
      const newTetromino = tetromino
      if (pressKey !== 0) {
        if (pressKey === 1 && tetromino.left + tetromino.block[0].length < 10) {
          newTetromino.left++
        }
        setPressKey(0)
      } else {
        if (tetromino.top + tetromino.block.length < 20) {
          newTetromino.top++
        }
      }
      console.log(pressKey)

      setTetromino(newTetromino)
    }, 700)
    return () => {
      clearInterval(id)
    }
  }, [viewBoard])

  return (
    <Container>
      <Board>
        <GameBoard>
          {viewBoard.map((row, y) =>
            row.map((num, x) => <TetrominoSquare key={`${x}-${y}`} num={num}></TetrominoSquare>)
          )}
        </GameBoard>
        <StateBoard></StateBoard>
      </Board>
    </Container>
  )
}

export default Home
