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
  background-color: lightsteelblue;
`
const Board = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: lightgray;
  border: 0.8vh solid;
  border-color: #ddd #666 #666 #ddd;
  @media screen and (max-width: 860px) {
    width: 50vh;
    height: 48vh;
  }
  @media screen and (min-width: 861px) {
    width: 100vh;
    height: 88vh;
  }
`
const GameBoard = styled.div`
  margin-top: 2vh;
  font-size: 0;
  background-color: black;
  border: 1vh solid;
  border-color: #666 #ddd #ddd #666;
  @media screen and (max-width: 860px) {
    width: 22vh;
    height: 42vh;
  }
  @media screen and (min-width: 861px) {
    width: 42vh;
    height: 82vh;
  }
`
const TetrominoBlock = styled.div<{ num: number }>`
  display: inline-block;
  vertical-align: bottom;
  background-color: ${(props) =>
    1 <= props.num && props.num <= 7 ? COLORS[props.num - 1] : '#111'};

  @media screen and (max-width: 860px) {
    width: 2vh;
    height: 2vh;
    ${(props) =>
      1 <= props.num && props.num <= 7
        ? 'border: 0.2vh solid; border-color: #ddd #666 #666 #ddd;'
        : ''};
  }
  @media screen and (min-width: 861px) {
    width: 4vh;
    height: 4vh;
    ${(props) =>
      1 <= props.num && props.num <= 7
        ? 'border: 0.3vh solid; border-color: #ddd #666 #666 #ddd;'
        : ''};
  }
`
const SideArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2vh;
  font-size: 0;
`
/*次のテトロミノを表示するエリア*/
const NextTBoard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0;
  background-color: powderblue;

  @media screen and (max-width: 860px) {
    width: 13vh;
    height: 14vh;
    margin-bottom: 7vh;
    border: 0.4vh solid #666;
  }
  @media screen and (min-width: 861px) {
    width: 25vh;
    height: 30vh;
    margin-bottom: 11vh;
    border: 0.5vh solid #666;
  }
`
const NextTBoardText = styled.div`
  display: flex;
  text-align: left;
  @media screen and (max-width: 860px) {
    width: 10vh;
    margin: 0.3vh 0;
    font-size: 1.5vh;
  }
  @media screen and (min-width: 861px) {
    width: 20vh;
    margin: 1vh 0;
    font-size: 3.4vh;
  }
`
/*スコアを表示するエリア*/
const ScoreTextArea = styled(NextTBoardText)`
  justify-content: center;
  background-color: powderblue;
  @media screen and (max-width: 860px) {
    width: 10vh;
    padding: 1vh;
    margin-bottom: 2vh;
    border: 0.4vh solid #666;
  }
  @media screen and (min-width: 861px) {
    width: 24vh;
    padding: 2vh;
    margin-bottom: 3vh;
    border: 0.5vh solid #666;
  }
`
const GameStateTextArea = styled(ScoreTextArea)`
  font-weight: bold;
`
const NextTetrominoView = styled.div`
  display: inline-block;
  background-color: black;
  @media screen and (max-width: 860px) {
    width: 10vh;
    height: 10vh;
    border: 1vh solid black;
  }
  @media screen and (min-width: 861px) {
    width: 20vh;
    height: 20vh;
    border: 2vh solid black;
  }
`
/*ボタン*/
const ButtonTemplate = styled.div`
  color: #111;
  text-align: center;
  @media screen and (max-width: 860px) {
    width: 12vh;
    height: 3vh;
    font-size: 1.5vh;
    line-height: 2vh;
  }
  @media screen and (min-width: 861px) {
    width: 24vh;
    height: 6vh;
    font-size: 3.4vh;
    line-height: 4.5vh;
  }
`
const PauseButton = styled(ButtonTemplate)`
  background-color: #999;
  @media screen and (max-width: 860px) {
    margin-bottom: 0.5vh;
    border: 0.3vh solid;
    border-color: #bbb #666 #666 #bbb;
  }
  @media screen and (min-width: 861px) {
    margin-bottom: 1vh;
    border: 0.5vh solid;
    border-color: #bbb #666 #666 #bbb;
  }
`
const StartButton = styled(ButtonTemplate)<{ isGameStart: boolean }>`
  ${(props) => (props.isGameStart ? '' : ' background-color: #aaa;')}
  @media screen and (max-width: 860px) {
    height: 5vh;
    margin: 1.5vh 0;
    line-height: 4vh;
    ${(props) =>
      props.isGameStart ? '' : 'border: 0.5vh solid;border-color: #bbb #666 #666 #bbb;'}
  }
  @media screen and (min-width: 861px) {
    height: 10vh;
    margin: 3vh 0;
    line-height: 8.5vh;
    ${(props) =>
      props.isGameStart ? '' : 'border: 0.5vh solid;border-color: #bbb #666 #666 #bbb;'}
  }
`
/*矢印ボタンの親要素*/
const Controller = styled.div`
  vertical-align: bottom;
  background-color: powderblue;
  @media screen and (max-width: 860px) {
    width: 13vh;
    height: 12.75vh;
    padding: 0.1vh;
    border: 0.4vh solid #666;
  }
  @media screen and (min-width: 861px) {
    width: 26vh;
    height: 25vh;
    padding: 0.5vh;
    border: 0.5vh solid #666;
  }
`
/*矢印ボタン*/
const ControllerButton = styled.div<{ c: string }>`
  display: inline-block;
  color: black;
  text-align: center;
  vertical-align: top;
  ${(props) => (props.c === '' ? '' : 'background-color: #999;')}

  @media screen and (max-width: 860px) {
    width: 4vh;
    height: 4vh;
    font-size: 2.7vh;
    line-height: ${(props) => (props.c === '←' || props.c === '→' ? '2.75vh' : '3vh')};
    ${(props) => (props.c === '' ? '' : 'border: 0.3vh solid; border-color: #bbb #666 #666 #bbb;')}
  }
  @media screen and (min-width: 861px) {
    width: 8vh;
    height: 8vh;
    font-size: 6.5vh;
    line-height: ${(props) => (props.c === '←' || props.c === '→' ? '6vh' : '6.75vh')};
    ${(props) => (props.c === '' ? '' : 'border: 0.5vh solid; border-color: #bbb #666 #666 #bbb;')}
  }
`

const Home: NextPage = () => {
  const startBoard = [
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    //ここから下が画面に表示
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    //ここまで
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
  ]
  const boardSizeX = startBoard[0].length
  const boardSizeY = startBoard.length
  const startNextTetrominoBoard = Array.from(new Array(4), () => new Array(4).fill(0))
  // prettier-ignore
  const tetrominoList = [
    [
      [[0, 0, 0, 0], [1, 1, 1, 1]],
      [[0, 0, 1],[0, 0, 1],[0, 0, 1],[0, 0, 1]],
      [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1]],
      [[0, 1],[0, 1],[0, 1],[0, 1]],
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
  const startTetrominoX = 5
  const startTetrominoY = 2
  const defaultFallSpeed = 600

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
  const [noOperationCount, setNoOperationCount] = useState(0)
  const [isOverlayProcessing, setIsOverlayProcessing] = useState(true)
  const [isGameStart, setIsGameStart] = useState(false)
  const [isGameover, setIsGameover] = useState(false)
  const [isGameStop, setIsGameStop] = useState(false)
  const [lineCount, setLineCount] = useState(0)

  //boardとtetrominoを重ねたものを返す
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
  //overlayBoardから表示する領域を切り取る
  const viewBoard = useMemo(
    () =>
      overlayBoard()
        .slice(4, boardSizeY)
        .map((r) => r.filter((item) => item !== 9)),
    [tetrominoX, tetrominoY, tetromino]
  )
  //次のテトロミノを表示する二次元配列の生成
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
  //テトロミノの衝突判定
  const checkCollision = (
    movedX: number,
    movedY: number,
    mino: number[][],
    isCallByY = false,
    chackTargetBoard = board
  ) => {
    if (isCallByY) {
      if (boardSizeY < movedY + mino.length) {
        return false
      }
    }
    if (movedX < 0 || boardSizeX < movedX + mino[0].length) {
      return false
    }
    const newBoard: number[][] = JSON.parse(JSON.stringify(chackTargetBoard))
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

  const rotate = () => {
    if (noOperationCount > 1) {
      return
    }
    let adjustX = 0
    const nowMino = tetromino.block[tetromino.angle]
    const rotatedAngle = rotateAngleRight(tetromino.angle)
    //回転に伴う位置調整の確認
    if (nowMino.flat().some((n) => n === 1) && tetromino.angle % 2 === 1) {
      if (!checkCollision(tetrominoX + 1, tetrominoY, nowMino)) {
        adjustX = tetromino.angle === 1 ? -1 : -2
      } else if (!checkCollision(tetrominoX - 1, tetrominoY, nowMino)) {
        adjustX = tetromino.angle === 1 ? 2 : 1
      }
    } else if (nowMino.flat().some((n) => n !== 2)) {
      //長い棒以外と正方形以外
      //現在のテトリミノの一番左列がすべて0(空欄)かどうか
      if (nowMino.map((item) => item[0]).every((value) => value === 0)) {
        if (!checkCollision(tetrominoX - 1, tetrominoY, nowMino)) {
          adjustX = 1
        }
      }
      //現在のテトリミノの一番右列がすべて0(空欄)かどうか
      else if (nowMino.map((item) => item.slice(-1)[0]).every((value) => value === 0)) {
        if (!checkCollision(tetrominoX + 1, tetrominoY, nowMino)) {
          adjustX = -1
        }
      }
    }
    if (checkCollision(tetrominoX + adjustX, tetrominoY, tetromino.block[rotatedAngle], true)) {
      console.log('R')
      setTetrominoX((e) => e + adjustX)
      setTetromino({ ...tetromino, angle: rotatedAngle })
    }
  }
  const fall = () => {
    let tmpY = tetrominoY
    while (checkCollision(tetrominoX, tmpY + 1, tetromino.block[tetromino.angle], true)) {
      tmpY++
    }
    setTetrominoY(tmpY)
  }
  const moveRight = () => {
    setTetrominoX((e) =>
      checkCollision(e + 1, tetrominoY, tetromino.block[tetromino.angle]) ? e + 1 : e
    )
  }
  const moveLeft = () => {
    setTetrominoX((e) =>
      checkCollision(e - 1, tetrominoY, tetromino.block[tetromino.angle]) ? e - 1 : e
    )
  }

  const checkKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'x') {
        gamePause()
        return
      } else if (isGameStop) {
        return
      }
      switch (event.key) {
        case 'ArrowUp':
          rotate()
          break
        case 'ArrowDown':
          fall()
          break
        case 'ArrowRight':
          moveRight()
          break
        case 'ArrowLeft':
          moveLeft()
          break
      }
    },
    [tetromino, tetrominoX, tetrominoY, isGameStop]
  )
  //キー入力を受け付ける処理
  useEffect(() => {
    if (!isOverlayProcessing || !isGameStart || isGameover) {
      return
    }
    document.addEventListener('keydown', checkKeyDown, false)
    if (!checkCollision(tetrominoX, tetrominoY, tetromino.block[tetromino.angle])) {
      setTetromino({ ...tetromino, angle: rotateAngleLeft(tetromino.angle) })
    }
    return () => {
      document.removeEventListener('keydown', checkKeyDown, false)
    }
  }, [tetromino, tetrominoX, tetrominoY, isOverlayProcessing, isGameStart, isGameover, isGameStop])
  //ボタンクリックで対応する関数を動作させる
  const onClickCbtn = (x: number, y: number) => {
    if (isGameStop) {
      return
    }
    switch ([y, x].toString()) {
      case [0, 1].toString():
        rotate()
        break
      case [1, 1].toString():
        fall()
        break
      case [1, 2].toString():
        moveRight()
        break
      case [1, 0].toString():
        moveLeft()
        break
    }
  }
  //テトリミノが完全に落ち切った後の処理
  const afterFall = () => {
    const ovelBoard = overlayBoard()
    const newBoard: number[][] = []
    for (let row = 0; row < ovelBoard.length; row++) {
      if (ovelBoard[row].every((r) => r > 0) && !ovelBoard[row].every((r) => r === 9)) {
        setLineCount((e) => e + 1)
        newBoard.unshift([9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9])
      } else {
        newBoard.push(ovelBoard[row])
      }
    }
    if (
      !checkCollision(startTetrominoX, startTetrominoY, nextTetromino.block[0], false, newBoard) ||
      tetrominoY < 3
    ) {
      setIsGameover(true)
    } else {
      setTetromino(nextTetromino)
      setTetrominoX(startTetrominoX)
      setTetrominoY(startTetrominoY)
      setNextTetromino(createTetromino())
    }
    setBoard(newBoard)
  }
  //レベル確認
  const levelOfTetris = () => {
    const level = Math.floor(lineCount / 5) + 1
    return level < 10 ? level : 10
  }
  //メインループ
  useEffect(() => {
    if (!isGameStart || isGameover || isGameStop) {
      return
    }
    if (!isOverlayProcessing) {
      setIsOverlayProcessing(true)
      afterFall()
      setEffect(!effect)
    } else {
      nextMinoBoard()
      if (checkCollision(tetrominoX, tetrominoY + 1, tetromino.block[tetromino.angle], true)) {
        setTetrominoY(tetrominoY + 1)
        setNoOperationCount(0)
      } else {
        if (noOperationCount > 1) {
          setNoOperationCount(0)
          setIsOverlayProcessing(false)
        } else {
          setNoOperationCount((e) => e + 1)
        }
      }
      setTimeout(() => {
        setEffect(!effect)
      }, defaultFallSpeed - (levelOfTetris() - 1) * 50)
    }
  }, [effect, isGameStart, isGameStop, lineCount])

  const gameStart = () => {
    setIsGameStart(true)
  }
  const gamePause = () => {
    if (isGameStart) {
      setIsGameStop(!isGameStop)
    }
  }

  return (
    <>
      <Head>
        <title>Pseudo-Tetris </title>
      </Head>
      <Container>
        <Board>
          <SideArea>
            <ScoreTextArea>Score : {lineCount}</ScoreTextArea>
            <ScoreTextArea>Level : {levelOfTetris()}</ScoreTextArea>
            <GameStateTextArea>
              {isGameover ? 'GAMEOVER' : isGameStop ? 'PAUSE' : 'Playing!'}
            </GameStateTextArea>
          </SideArea>

          <GameBoard>
            {viewBoard.map((row, y) =>
              row.map((num, x) => <TetrominoBlock key={`${x}-${y}`} num={num}></TetrominoBlock>)
            )}
          </GameBoard>

          <SideArea>
            <NextTBoard>
              <NextTBoardText>Next :</NextTBoardText>
              <NextTetrominoView>
                {nextTetrominoBoard.map((row, y) =>
                  row.map((num, x) => <TetrominoBlock key={`${x}-${y}`} num={num}></TetrominoBlock>)
                )}
              </NextTetrominoView>
            </NextTBoard>
            <StartButton isGameStart={isGameStart} onClick={() => gameStart()}>
              {isGameStart ? '' : 'Game Start'}
            </StartButton>
            <Controller>
              <PauseButton onClick={() => gamePause()}>
                {isGameStop ? '[X] : Resume' : '[X] : Pause'}
              </PauseButton>
              {[
                ['', '⤵', ''],
                ['←', '↓', '→'],
              ].map((row, y) =>
                row.map((c, x) => (
                  <ControllerButton key={`${x}-${y}`} onClick={() => onClickCbtn(x, y)} c={c}>
                    {c}
                  </ControllerButton>
                ))
              )}
            </Controller>
          </SideArea>
        </Board>
      </Container>
    </>
  )
}

export default Home
