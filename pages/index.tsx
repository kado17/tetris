import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

const COLORS = ['aqua', 'yellow', 'purple', 'blue', 'orange', 'green', 'red']

const ARROWSBTN = [
  ['', 'images/cached.svg', ''],
  ['images/arrow_back.svg', 'images/arrow_downward.svg', 'images/arrow_forward.svg'],
]

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url('images/background.png');
`
const Board = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: lightgray;
  border: 0.8vh solid;
  border-color: #ddd #666 #666 #ddd;
  @media screen and (max-width: 860px) {
    width: 54vh;
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
        ? 'border: 0.5px solid; border-color: #ddd #666 #666 #ddd;'
        : ''};
  }
  @media screen and (min-width: 861px) {
    width: 4vh;
    height: 4vh;
    ${(props) =>
      1 <= props.num && props.num <= 7
        ? 'border: 1px solid; border-color: #ddd #666 #666 #ddd;'
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
/*次のテトリミノを表示するエリア*/
const NextTetorominoArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0;
  background-color: powderblue;
  @media screen and (max-width: 860px) {
    width: 13vh;
    height: 14vh;
    margin: 1vh 0 13vh;
    border: 0.4vh solid #666;
  }
  @media screen and (min-width: 861px) {
    width: 25vh;
    height: 30vh;
    margin: 1vh 0 25vh;
    border: 0.5vh solid #666;
  }
`
const NextTetorominoText = styled.div`
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
/*スコアを表示するエリア*/
const ScoreTextArea = styled(NextTetorominoText)`
  display: flex;
  justify-content: center;
  text-align: left;
  background-color: powderblue;
  @media screen and (max-width: 860px) {
    width: 12vh;
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
/*ボタン*/
const ButtonTemplate = styled.div`
  color: #111;
  text-align: center;
  cursor: pointer;
  @media screen and (max-width: 860px) {
    font-size: 1.5vh;
  }
  @media screen and (min-width: 861px) {
    font-size: 3.4vh;
  }
`
const StartButton = styled(ButtonTemplate)<{ isGameStart: boolean }>`
  background-color: #aaa;
  border-radius: 4px;
  @media screen and (max-width: 860px) {
    width: 10vh;
    height: 4vh;
    margin-top: 16vh;
    line-height: 3.5vh;
    border: 0.2vh solid #666;
  }
  @media screen and (min-width: 861px) {
    width: 22vh;
    height: 8vh;
    margin-top: 32.5vh;
    line-height: 6.75vh;
    border: 0.3vh solid #666;
  }

  &:hover {
    opacity: 0.7;
    transition: 0.1s;
  }
`
/*操作ボタンの親要素*/
const Controller = styled.div`
  vertical-align: bottom;
  background-color: clear;
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
const PauseButton = styled(ButtonTemplate)`
  color: black;
  background-color: #999;
  @media screen and (max-width: 860px) {
    width: 12vh;
    height: 3vh;
    margin-bottom: 0.5vh;
    line-height: 2vh;
    border: 0.3vh solid lightgray;
  }
  @media screen and (min-width: 861px) {
    width: 24vh;
    height: 6vh;
    margin-bottom: 1vh;
    line-height: 4.5vh;
    border: 0.5vh solid lightgray;
  }

  &:hover {
    opacity: 0.8;
    transition: 0.1s;
  }
`
/*矢印ボタン*/
const ArrowButton = styled.img<{ c: string }>`
  display: inline-block;
  text-align: center;
  vertical-align: top;
  cursor: pointer;
  ${(props) => (props.c === '' ? 'visibility:hidden;' : 'background-color: #999;')}

  @media screen and (max-width: 860px) {
    width: 4vh;
    height: 4vh;
    ${(props) => (props.c === '' ? '' : 'border: 0.3vh solid lightgray;')}
  }
  @media screen and (min-width: 861px) {
    width: 8vh;
    height: 8vh;
    ${(props) => (props.c === '' ? '' : 'border: 0.5vh solid lightgray;')}
  }

  &:hover {
    opacity: 0.8;
    transition: 0.1s;
  }
`
const OpenManualButton = styled.div`
  position: fixed;
  top: 15px;
  right: 15px;
  padding: 15px 20px;
  font-family: bold;
  color: #fff;
  cursor: pointer;
  background-color: black;
  border-radius: 20%;

  &:hover {
    opacity: 0.8;
    transition: 0.1s;
  }
`
const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: none;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 70%);

  ${(props) => (props.isOpen ? `display:block;` : '')}
`
const Modal = styled.div`
  position: absolute;
  top: 10%;
  right: 10%;
  z-index: 2;
  display: flex;
  width: 80%;
  height: 80%;
  background-color: #fff;
  border-radius: 10px;
`
const Manual = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 3;
  width: 80%;
  cursor: pointer;
  border: 2px solid black;
  transform: translateY(-50%) translateX(-50%);

  &:hover {
    opacity: 0.8;
    transition: 0.1s;
  }
`
const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 3;
  font-size: 200%;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
    transition: 0.1s;
  }
`
const Home: NextPage = () => {
  const initGameBoard = [
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
  const GameBoardwidth = initGameBoard[0].length
  const GameBoardheight = initGameBoard.length
  const initNextTetrominoBoard: number[][] = Array.from(new Array(4), () => new Array(4).fill(0))
  // prettier-ignore
  const tetrominoBlocks = [
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
  const initX = 5
  const initY = 2
  const initFallSpeed = 600

  const createTetromino = () => {
    return { block: tetrominoBlocks[Math.floor(Math.random() * tetrominoBlocks.length)], angle: 0 }
  }

  const [board, setBoard] = useState(initGameBoard)
  const [nextTetrominoBoard, setNextTetrominoBoard] = useState(initNextTetrominoBoard)
  const [tetromino, setTetromino] = useState(createTetromino())
  const [nextTetromino, setNextTetromino] = useState(createTetromino())
  const [tetrominoX, setTetrominoX] = useState(initX)
  const [tetrominoY, setTetrominoY] = useState(initY)
  const [effect, setEffect] = useState(false)
  const [noOperationCount, setNoOperationCount] = useState(0)
  const [isOverlayProcessing, setIsOverlayProcessing] = useState(true)
  const [isGameStart, setIsGameStart] = useState(false)
  const [isGameOver, setIsGameover] = useState(false)
  const [isGamePause, setIsGamePause] = useState(false)
  const [score, setScore] = useState(0)
  const [isOpenModal, setIsOpenModal] = useState(false)

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
        .slice(4, GameBoardheight)
        .map((r) => r.filter((item) => item !== 9)),
    [tetromino, tetrominoX, tetrominoY]
  )
  //次のテトリミノを表示するエリアの二次元配列の生成
  const changeNextTetrominoBoard = useCallback(() => {
    const newBoard: number[][] = initNextTetrominoBoard
    const ntb = nextTetromino.block[nextTetromino.angle]
    for (let y = 0; y < ntb.length; y++) {
      for (let x = 0; x < ntb[y].length; x++) {
        newBoard[y][x] = ntb[y][x]
      }
    }
    setNextTetrominoBoard(newBoard)
  }, [nextTetromino])
  //テトリミノの衝突判定
  const checkCollision = (
    minoX: number,
    minoY: number,
    mino: number[][],
    isCheckOverheight = false,
    chackTargetBoard = board
  ) => {
    if (isCheckOverheight) {
      //テトリミノがy方向にgameBoardをはみ出していないかチェック
      if (GameBoardheight < minoY + mino.length) {
        return false
      }
    }
    //テトリミノがx方向にgameBoardをはみ出していないかチェック
    if (minoX < 0 || GameBoardwidth < minoX + mino[0].length) {
      return false
    }
    //テトリミノとgameBoardを重ねて問題がないかチェック
    const newBoard: number[][] = JSON.parse(JSON.stringify(chackTargetBoard))
    for (let y = 0; y < mino.length; y++) {
      for (let x = 0; x < mino[y].length; x++) {
        if (mino[y][x] > 0 && newBoard[y + minoY][x + minoX] > 0) {
          return false
        }
      }
    }
    return true
  }

  const rotateAngleRight = (angle: number) => (angle < 3 ? angle + 1 : 0)
  const rotateAngleLeft = (angle: number) => (0 < angle ? angle - 1 : 3)

  const rotate = () => {
    if (noOperationCount > 1) return

    let adjustX = 0
    const nowMino = tetromino.block[tetromino.angle]
    const rotatedAngle = rotateAngleRight(tetromino.angle)

    //回転に伴う位置調整の確認
    //長い棒のテトリミノのみ
    if (nowMino.flat().some((n) => n === 1) && tetromino.angle % 2 === 1) {
      if (!checkCollision(tetrominoX + 1, tetrominoY, nowMino)) {
        adjustX = tetromino.angle === 1 ? -1 : -2
      } else if (!checkCollision(tetrominoX - 1, tetrominoY, nowMino)) {
        adjustX = tetromino.angle === 1 ? 2 : 1
      }
    }
    //長い棒と正方形以外
    else if (nowMino.flat().some((n) => n !== 2)) {
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
    //回転後に問題がないか確認
    if (checkCollision(tetrominoX + adjustX, tetrominoY, tetromino.block[rotatedAngle], true)) {
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
        switchIsGamePause()
        return
      } else if (isGamePause) {
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
    [tetromino, tetrominoX, tetrominoY, isGamePause]
  )
  //キー入力を受け付ける処理
  useEffect(() => {
    if (!isOverlayProcessing || !isGameStart || isGameOver) {
      return
    }
    document.addEventListener('keydown', checkKeyDown, false)
    //テトリミノの回転処理で問題があった場合に修正する処理
    if (!checkCollision(tetrominoX, tetrominoY, tetromino.block[tetromino.angle])) {
      setTetromino({ ...tetromino, angle: rotateAngleLeft(tetromino.angle) })
    }
    return () => {
      document.removeEventListener('keydown', checkKeyDown, false)
    }
  }, [tetromino, tetrominoX, tetrominoY, isOverlayProcessing, isGameStart, isGameOver, isGamePause])
  //ボタンクリックで対応する関数を動作させる
  const onClickCbtn = (x: number, y: number) => {
    if (isGamePause || !isGameStart || isGameOver) {
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
    //行がそろった配列を消去してスコアに追加する処理
    for (let row = 0; row < ovelBoard.length; row++) {
      if (ovelBoard[row].every((r) => r > 0) && !ovelBoard[row].every((r) => r === 9)) {
        setScore((e) => e + 1)
        newBoard.unshift([9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9])
      } else {
        newBoard.push(ovelBoard[row])
      }
    }
    //GameOverかどうかをチェック
    if (!checkCollision(initX, initY, nextTetromino.block[0], false, newBoard) || tetrominoY < 3) {
      setIsGameover(true)
    } else {
      setTetromino(nextTetromino)
      setTetrominoX(initX)
      setTetrominoY(initY)
      setNextTetromino(createTetromino())
    }
    setBoard(newBoard)
  }
  //レベル確認
  const levelOfTetris = () => {
    const level = Math.floor(score / 5) + 1
    return level < 10 ? level : 10
  }
  //メインループ
  useEffect(() => {
    if (!isGameStart || isGameOver || isGamePause) {
      return
    }
    if (!isOverlayProcessing) {
      setIsOverlayProcessing(true)
      afterFall()
      setEffect(!effect)
    } else {
      changeNextTetrominoBoard()
      //落下処理
      if (checkCollision(tetrominoX, tetrominoY + 1, tetromino.block[tetromino.angle], true)) {
        setTetrominoY(tetrominoY + 1)
        setNoOperationCount(0)
      } else {
        //テトリミノが落下できない場合の処理
        if (noOperationCount > 1) {
          setNoOperationCount(0)
          setIsOverlayProcessing(false)
        } else {
          setNoOperationCount((e) => e + 1)
        }
      }
      setTimeout(() => {
        setEffect(!effect)
      }, initFallSpeed - (levelOfTetris() - 1) * 50)
    }
  }, [effect, isGameStart, isGamePause, score])

  const switchIsGamePause = () => {
    if (isGameStart) setIsGamePause(!isGamePause)
  }

  const startOrReset = () => {
    if (isGameStart) window.location.reload()
    else setIsGameStart(true)
  }

  return (
    <>
      <Head>
        <title>Pseudo-Tetris</title>
      </Head>
      <Container>
        <OpenManualButton onClick={() => setIsOpenModal(true)}>Manual</OpenManualButton>
        <Overlay isOpen={isOpenModal}>
          <Modal>
            <CloseButton onClick={() => setIsOpenModal(false)}>×</CloseButton>
            <Manual
              src="images/manual.png"
              loading="lazy"
              onClick={() => window.open('images/manual.png', '_blank', 'noreferrer')}
            ></Manual>
          </Modal>
        </Overlay>
        <Board>
          <SideArea>
            <ScoreTextArea>Score : {score}</ScoreTextArea>
            <ScoreTextArea>Level : {levelOfTetris()}</ScoreTextArea>
            <GameStateTextArea>
              {isGameOver ? 'GAMEOVER' : isGamePause ? 'PAUSE' : 'Playing!'}
            </GameStateTextArea>
            <StartButton isGameStart={isGameStart} onClick={() => startOrReset()}>
              {isGameStart ? 'Reset' : 'Game Start'}
            </StartButton>
          </SideArea>
          <GameBoard>
            {viewBoard.map((row, y) =>
              row.map((num, x) => <TetrominoBlock key={`${x}-${y}`} num={num}></TetrominoBlock>)
            )}
          </GameBoard>
          <SideArea>
            <NextTetorominoArea>
              <NextTetorominoText>Next :</NextTetorominoText>
              <NextTetrominoView>
                {nextTetrominoBoard.map((row, y) =>
                  row.map((num, x) => <TetrominoBlock key={`${x}-${y}`} num={num}></TetrominoBlock>)
                )}
              </NextTetrominoView>
            </NextTetorominoArea>
            <Controller>
              <PauseButton onClick={() => switchIsGamePause()}>
                {isGamePause ? '[X] : Resume' : '[X] : Pause'}
              </PauseButton>
              {ARROWSBTN.map((row, y) =>
                row.map((c, x) => (
                  <ArrowButton
                    key={`${x}-${y}`}
                    onClick={() => onClickCbtn(x, y)}
                    c={c}
                    src={c !== '' ? c : 'images/arrow_back.svg'}
                  ></ArrowButton>
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
