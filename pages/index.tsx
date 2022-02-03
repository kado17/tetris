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
    [0, 1, 0],
    [1, 1, 1],
  ]

  const tetrominoList = [[], 0]

  const [board, setBoard] = useState(startBoard)
  const [tetromino, setTetromino] = useState(startTetromino)
  const [tetrominoX, setTetrominoX] = useState(0)
  const [tetrominoY, setTetrominoY] = useState(0)
  const [effect, setEffect] = useState(false)
  const [isMovingTetromino, setIsMovingTetromino] = useState(true)
  const [restCount, setRestCount] = useState(0)

  const overlayBoard = () => {
    const newBoard: number[][] = JSON.parse(JSON.stringify(board))
    for (let y = 0; y < tetromino.length; y++) {
      for (let x = 0; x < tetromino[y].length; x++) {
        if (tetromino[y][x]) {
          newBoard[y + tetrominoY][x + tetrominoX] = tetromino[y][x]
        }
      }
    }
    return newBoard
  }

  const viewBoard = useMemo(() => {
    return overlayBoard()
  }, [tetrominoX, tetrominoY, tetromino])

  const checkCollision = (movedX: number, movedY: number, mino: number[][], isCallByY = false) => {
    if (isCallByY) {
      if (19 < tetrominoY + mino.length) {
        return false
      }
    }
    if (10 < movedX + mino[0].length || movedX < 0) {
      return false
    }
    const newBoard: number[][] = JSON.parse(JSON.stringify(board))
    for (let y = 0; y < mino.length; y++) {
      for (let x = 0; x < mino[y].length; x++) {
        if (mino[y][x] > 0 && newBoard[y + movedY][x + movedX] > 0) {
          return false
        }
      }
    }
    return true
  }

  const rotateRight = (mino: number[][]) => {
    const newMino = mino[0].map((_, c) => mino.map((r) => r[c]).reverse())
    const result = {
      newMino: newMino,
      heightAdjust: newMino.length > mino.length ? newMino.length - mino.length : 0,
    }
    console.log(newMino, result)
    return result
  }

  const afterFall = () => {
    setBoard(overlayBoard())
    setTetromino([[1, 1, 1, 1]])
    setTetrominoX(0)
    setTetrominoY(0)
    setIsMovingTetromino(true)
  }

  const checkKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp': {
          console.log('UP')
          const rotatedMino = rotateRight(tetromino)
          console.log(rotatedMino)
          if (
            checkCollision(
              tetrominoX,
              tetrominoY - rotatedMino.heightAdjust,
              rotatedMino.newMino,
              true
            )
          ) {
            console.log('TRUE', rotatedMino.newMino)
            //setTetrominoY((e) => e - rotatedMino.heightAdjust)
            setTetromino(rotatedMino.newMino)
          }
          break
        }
        case 'ArrowRight':
          setTetrominoX((e) => (checkCollision(e + 1, tetrominoY, tetromino) ? e + 1 : e))
          break
        case 'ArrowLeft':
          setTetrominoX((e) => (checkCollision(e - 1, tetrominoY, tetromino) ? e - 1 : e))
          break
      }
    },
    [tetrominoY]
  )

  useEffect(() => {
    document.addEventListener('keydown', checkKeyDown, false)
    return () => {
      document.removeEventListener('keydown', checkKeyDown, false)
    }
  }, [tetrominoY])

  useEffect(() => {
    if (checkCollision(tetrominoX, tetrominoY + 1, tetromino, true)) {
      setTetrominoY(tetrominoY + 1)
      setRestCount(0)
    } else {
      if (restCount > 1) {
        console.log('HELP')
        setRestCount(0)
        afterFall()
      }
      setRestCount((e) => e + 1)
    }
    const id = setInterval(() => {
      setEffect(!effect)
    }, 300)

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
