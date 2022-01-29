import type { NextPage } from 'next'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
    [0, 0, 0, 0, 0, 0, 0, 3, 3, 3],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [0, 0, 0, 0, 0, 0, 0, 0, 4, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 4, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  ]
  const startTetromino = [
    [1, 1, 0],
    [0, 1, 1],
  ]

  const [board, setBoard] = useState(startBoard)
  const [tetromino, setTetromino] = useState(startTetromino)
  const [tetrominoX, setTetrominoX] = useState(0)
  const [tetrominoY, setTetrominoY] = useState(0)
  const [effect, setEffect] = useState(false)

  const viewBoard = useMemo(() => {
    const newBoard: number[][] = JSON.parse(JSON.stringify(board))
    for (let y = 0; y < tetromino.length; y++) {
      for (let x = 0; x < tetromino[y].length; x++) {
        if (tetromino[y][x]) {
          newBoard[y + tetrominoY][x + tetrominoX] = tetromino[y][x]
        }
      }
    }
    return newBoard
  }, [tetrominoX, tetrominoY])

  const checkCollision = (movedX: number, movedY: number) => {
    if (10 < movedX + tetromino[0].length || movedX < 0 || 20 < movedY + tetromino.length) {
      return true
    }
    const newBoard: number[][] = JSON.parse(JSON.stringify(board))
    for (let i = 0; i < tetromino.length; i++) {
      for (let j = 0; j < tetromino[i].length; j++) {
        if (tetromino[i][j] > 0 && newBoard[i + movedY][j + movedX] > 0) {
          return true
        }
      }
    }
    return false
  }

  const checkKeyDown = useCallback(
    (event: KeyboardEvent) => {
      console.log(111, event.key, tetrominoX, tetrominoY)
      switch (event.key) {
        case 'ArrowRight':
          setTetrominoX((e) => (checkCollision(e + 1, tetrominoY) ? e : e + 1))
          break
        case 'ArrowLeft':
          setTetrominoX((e) => (checkCollision(e - 1, tetrominoY) ? e : e - 1))
          break
      }
    },
    [effect]
  )

  useEffect(() => {
    document.addEventListener('keydown', checkKeyDown, false)
    return () => {
      document.removeEventListener('keydown', checkKeyDown, false)
    }
  }, [effect])

  useEffect(() => {
    const id = setInterval(() => {
      setEffect(!effect)
    }, 500)
    setTetrominoY((e) => (checkCollision(tetrominoX, e + 1) ? e : e + 1))
    return () => {
      clearInterval(id)
    }
  }, [effect])

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
