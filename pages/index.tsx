import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

const COLORS = ['aqua', 'yellow', 'purple', 'blue', 'orange', 'green', 'red']

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
  width: 74vh;
  height: 88vh;
  background-color: #ccc;
  border: 0.8vh solid;
  border-color: #ddd #666 #666 #ddd;
`
const GameBoard = styled.div`
  width: 42vh;
  height: 82vh;
  margin-bottom: 2vh;
  background-color: black;
  border: 1vh solid;
  border-color: #666 #ddd #ddd #666;
`
const TetrominoBlock = styled.div<{ num: number }>`
  display: inline-block;
  width: 4vh;
  height: 4vh;
  vertical-align: bottom;
  background-color: ${(props) =>
    1 <= props.num && props.num <= 7 ? COLORS[props.num - 1] : '#111'};
  ${(props) =>
    1 <= props.num && props.num <= 7
      ? 'border: 0.3vh solid; border-color: #ddd #666 #666 #ddd;'
      : ''};
`
const StateBoard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24vh;
  height: 82vh;
  margin-bottom: 2vh;
  background-color: #bbb;
  border: 0.5vh solid #666;
`
const TextArea = styled.div`
  display: flex;
  width: 20vh;
  margin-top: 2vh;
  font-size: 3vh;
`
const GameoverTextArea = styled(TextArea)`
  justify-content: center;
  font-size: 3.4vh;
  font-weight: bold;
`
const NextTetrominoView = styled.div`
  display: inline-block;
  width: 20vh;
  height: 20vh;
  background-color: black;
  border: 2vh solid black;
`
const Home: NextPage = () => {
  const startBoard = [
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    //ここから下が画面に表示
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    //ここまで
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
  ]
  const boardSizeX = startBoard[0].length
  const boardSizeY = startBoard.length
  const startNextTetrominoBoard = Array.from(new Array(4), () => new Array(4).fill(0))
  // prettier-ignore
  const tetrominoList = [
    [
      [[0, 0, 0, 0], [1, 1, 1, 1],],
      [[0, 1],[0, 1],[0, 1],[0, 1],],
      [[0, 0, 0, 0], [1, 1, 1, 1],],
      [[0, 1],[0, 1],[0, 1],[0, 1],],
    ],
    [
      [[0, 2, 2],[0, 2, 2]],
      [[0, 2, 2],[0, 2, 2]],
      [[0, 2, 2],[0, 2, 2]],
      [[0, 2, 2],[0, 2, 2]],
    ],
    [
      [[0, 3, 0],[3, 3, 3],[0, 0, 0]],
      [[0, 3, 0],[0, 3, 3],[0, 3, 0]],
      [[0, 0, 0],[3, 3, 3],[0, 3, 0]],
      [[0, 3, 0],[3, 3, 0],[0, 3, 0]],
    ],
    [
      [[4, 0, 0],[4, 4, 4],[0, 0, 0]],
      [[0, 4, 4],[0, 4, 0],[0, 4, 0]],
      [[0, 0, 0],[4, 4, 4],[0, 0, 4]],
      [[0, 0, 4],[0, 0, 4],[0, 4, 4]],
    ],
    [
      [[0, 0, 5],[5, 5, 5],[0, 0, 0]],
      [[0, 5, 0],[0, 5, 0],[0, 5, 5]],
      [[0, 0, 0],[5, 5, 5],[5, 0, 0]],
      [[5, 5, 0],[0, 5, 0],[0, 5, 0]],
    ],
    [
      [[0, 6, 6],[6, 6, 0],[0, 0, 0]],
      [[6, 0, 0],[6, 6, 0],[0, 6, 0]],
      [[0, 6, 6],[6, 6, 0],[0, 0, 0]],
      [[6, 0, 0],[6, 6, 0],[0, 6, 0]],
    ],
    [
      [[7, 7, 0],[0, 7, 7],[0, 0, 0]],
      [[0, 7, 0],[7, 7, 0],[7, 0, 0]],
      [[7, 7, 0],[0, 7, 7],[0, 0, 0]],
      [[0, 7, 0],[7, 7, 0],[7, 0, 0]],
    ],
  ]
  const startTetrominoX = 4
  const startTetrominoY = 1

  const createTetromino = () => {
    return { block: tetrominoList[Math.floor(Math.random() * tetrominoList.length)], angle: 0 }
  }

  const [board, setBoard] = useState(startBoard)
  const [nextTetrominoBoard, setNextTetrominoBoard] = useState(startNextTetrominoBoard)
  const [tetromino, setTetromino] = useState(createTetromino())
  const [nextTetromino, setNextTetromino] = useState(createTetromino())
  const [tetrominoX, setTetrominoX] = useState(startTetrominoX)
  const [tetrominoY, setTetrominoY] = useState(startTetrominoY)
  const [effect, setEffect] = useState(false)
  const [restCount, setRestCount] = useState(0)
  const [isOverlayProcessing, setIsOverlayProcessing] = useState(true)
  const [isGameover, setIsGameover] = useState(false)
  const [lineCount, setLineCount] = useState(0)

  const overlayBoard = () => {
    const newBoard: number[][] = JSON.parse(JSON.stringify(board))
    const tb = tetromino.block[tetromino.angle]
    for (let y = 0; y < tb.length; y++) {
      for (let x = 0; x < tb[y].length; x++) {
        if (tb[y][x]) {
          newBoard[y + tetrominoY][x + tetrominoX] = tb[y][x]
        }
      }
    }
    return newBoard
  }
  const viewBoard = useMemo(
    () =>
      overlayBoard()
        .slice(4, boardSizeY)
        .map((r) => r.filter((item) => item !== 9)),
    [tetrominoX, tetrominoY, tetromino]
  )
  const nextMinoBoard = useCallback(() => {
    const newBoard: number[][] = startNextTetrominoBoard
    const ntb = nextTetromino.block[nextTetromino.angle]
    for (let y = 0; y < ntb.length; y++) {
      for (let x = 0; x < ntb[y].length; x++) {
        newBoard[y][x] = ntb[y][x]
      }
    }
    setNextTetrominoBoard(newBoard)
  }, [nextTetromino])

  const checkCollision = (movedX: number, movedY: number, mino: number[][], isCallByY = false) => {
    if (isCallByY) {
      if (boardSizeY < movedY + mino.length) {
        return false
      }
    }
    if (movedX < 0 || boardSizeX < movedX + mino[0].length) {
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

  const rotateAngleRight = (angle: number) => (angle < 3 ? angle + 1 : 0)
  const rotateAngleLeft = (angle: number) => (0 < angle ? angle - 1 : 3)

  const checkKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp': {
          if (restCount > 1) {
            return
          }
          const rotatedAngle = rotateAngleRight(tetromino.angle)
          if (checkCollision(tetrominoX, tetrominoY, tetromino.block[rotatedAngle], true)) {
            setTetromino({ ...tetromino, angle: rotatedAngle })
          }
          break
        }
        case 'ArrowDown': {
          let tmpY = tetrominoY
          while (checkCollision(tetrominoX, tmpY + 1, tetromino.block[tetromino.angle], true)) {
            tmpY++
          }
          setTetrominoY(tmpY)
          setRestCount(99)
          break
        }
        case 'ArrowRight':
          setTetrominoX((e) =>
            checkCollision(e + 1, tetrominoY, tetromino.block[tetromino.angle]) ? e + 1 : e
          )
          break
        case 'ArrowLeft':
          setTetrominoX((e) =>
            checkCollision(e - 1, tetrominoY, tetromino.block[tetromino.angle]) ? e - 1 : e
          )
          break
      }
    },
    [tetromino, tetrominoX, tetrominoY]
  )

  useEffect(() => {
    if (!isOverlayProcessing || isGameover) {
      return
    }
    document.addEventListener('keydown', checkKeyDown, false)
    if (!checkCollision(tetrominoX, tetrominoY, tetromino.block[tetromino.angle])) {
      setTetromino({ ...tetromino, angle: rotateAngleLeft(tetromino.angle) })
    }
    return () => {
      document.removeEventListener('keydown', checkKeyDown, false)
    }
  }, [tetromino, tetrominoX, tetrominoY, isOverlayProcessing, isGameover])

  const afterFall = () => {
    const ovelBoard = overlayBoard()
    const newBoard: number[][] = []
    for (let row = 0; row < ovelBoard.length; row++) {
      if (ovelBoard[row].every((r) => r > 0) && !ovelBoard[row].every((r) => r === 9)) {
        setLineCount((e) => e + 1)
        newBoard.unshift([9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9])
      } else {
        newBoard.push(ovelBoard[row])
      }
    }
    if (
      !checkCollision(startTetrominoX, startTetrominoY, nextTetromino.block[0]) ||
      tetrominoY < 3
    ) {
      setIsGameover(true)
    }
    setBoard(newBoard)
    setTetromino(nextTetromino)
    setTetrominoX(startTetrominoX)
    setTetrominoY(startTetrominoY)
    setNextTetromino(createTetromino())
  }

  useEffect(() => {
    if (isGameover) {
      return
    }
    if (!isOverlayProcessing) {
      afterFall()
      setIsOverlayProcessing(true)
      setEffect(!effect)
    } else {
      nextMinoBoard()
      if (checkCollision(tetrominoX, tetrominoY + 1, tetromino.block[tetromino.angle], true)) {
        setTetrominoY(tetrominoY + 1)
        setRestCount(0)
      } else {
        if (restCount > 1) {
          setRestCount(0)
          setIsOverlayProcessing(false)
        } else {
          setRestCount((e) => e + 1)
        }
      }
      setTimeout(() => {
        setEffect(!effect)
      }, 300)
    }
  }, [effect])

  return (
    <>
      <Head>
        <title>Pseudo-Tetris </title>
      </Head>
      <Container>
        <Board>
          <GameBoard>
            {viewBoard.map((row, y) =>
              row.map((num, x) => <TetrominoBlock key={`${x}-${y}`} num={num}></TetrominoBlock>)
            )}
          </GameBoard>
          <StateBoard>
            <TextArea>Next:</TextArea>
            <NextTetrominoView>
              {nextTetrominoBoard.map((row, y) =>
                row.map((num, x) => <TetrominoBlock key={`${x}-${y}`} num={num}></TetrominoBlock>)
              )}
            </NextTetrominoView>
            <TextArea>Points: {lineCount}</TextArea>
            <GameoverTextArea>{isGameover ? 'GAME OVER' : ''}</GameoverTextArea>
          </StateBoard>
        </Board>
      </Container>
    </>
  )
}

export default Home
