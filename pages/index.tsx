import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
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
const TetrominoSquare = styled.div`
  display: inline-block;
  width: 4vh;
  height: 4vh;
  vertical-align: bottom;
  background-color: #111;
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
    color: COLORS[2],
  }
  const [board, setBoard] = useState(startBoard)
  const [tetromino, setTetromino] = useState(startTetromino)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setTimer((t) => t + 1)
    }, 1000)
    return () => {
      clearInterval(id)
    }
  }, [])
  return (
    <Container>
      <Board>
        <GameBoard>
          {board.map((row, y) =>
            row.map((num, x) => <TetrominoSquare key={`${x}-${y}`}></TetrominoSquare>)
          )}
        </GameBoard>
        <StateBoard></StateBoard>
      </Board>
    </Container>
  )
}

export default Home
