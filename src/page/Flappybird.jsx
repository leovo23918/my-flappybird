import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import bottomBackground from '../asset/image/flappybird/bottom-background.png'
import fbGameBackground from '../asset/image/flappybird/fb-game-background.png'
import flappybirdPipe from '../asset/image/flappybird/flappybird-pipe.png'
import flappybird from '../asset/image/flappybird/flappy-bird.png'

const BIRD_SIZE = 40
const GAME_WIDTH = 500
const GAME_HEIGHT = 500
const GRAVITY = 6
const JUMP_HEIGHT = 100
const OBSTACLE_WIDTH = 60
const OBSTACLE_GAP = 200


const Flappybird = () => {
    const [birdPosition, setBirdPosition] = useState(250)
    const [birdPositionLeft, setbirdPositionLeft] = useState(0)
    const [gameHasStarted, setgameHasStarted] = useState(false)
    const [gameCurentRun, setgameCurentRun] = useState(true)
    const [obstacleHeight, setObstacleHeight] = useState(200)
    const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH-OBSTACLE_WIDTH)
    const [score, setScore] = useState(0)
    const [isCount, setIsCount] = useState(false)

    const bottomObstacleHeight  = GAME_HEIGHT-OBSTACLE_GAP-obstacleHeight

    // birdPosition
    useEffect(() => {
      let timeId
      if(gameHasStarted && birdPosition < GAME_HEIGHT-BIRD_SIZE){
          timeId = setInterval(()=>{
              setBirdPosition((birdPosition)=> birdPosition + GRAVITY)
          }, 24)
          return () => {
            clearInterval(timeId)
          }
      }
    }, [birdPosition, gameHasStarted])

   

    // obstacle
    useEffect(() => {
      let obstacleId
      if(gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH){
          obstacleId = setInterval(()=>{
              setObstacleLeft((obstacleLeft)=> obstacleLeft -10)
          }, 24)
          return () => {
            clearInterval(obstacleId)
          }
      }else if(!gameHasStarted && !gameCurentRun) {
        setIsCount(false)
      }else{
        setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH)
        setObstacleHeight(Math.floor(Math.random()*(GAME_HEIGHT-OBSTACLE_GAP)))
        setIsCount(true)
      }
    }, [gameHasStarted, obstacleLeft])
    


    // score
    useEffect(() => {
      if(isCount && obstacleLeft <= GAME_WIDTH/2-50 - OBSTACLE_WIDTH){
        setScore(score => score + 1)
        setIsCount(false)
      }
    }, [isCount, obstacleLeft])
    

    // Cham vao chuong ngai vat
    useEffect(() => {
      const hasCollideWithTopObstacle = birdPosition >= 0 && birdPosition < obstacleHeight
      const hasCollideWithBottomObstacle = birdPosition <= 500 && birdPosition >= 500 - bottomObstacleHeight
      if(obstacleLeft >= GAME_WIDTH/2-50 - OBSTACLE_WIDTH  && obstacleLeft <=   GAME_WIDTH/2 -50 + BIRD_SIZE - 5 && (hasCollideWithTopObstacle||hasCollideWithBottomObstacle)){
          setgameCurentRun(false)
          setgameHasStarted(false)
      }
    }, [birdPosition, obstacleHeight, bottomObstacleHeight, obstacleLeft])



    const handleClick = () =>{
        let newBirdPosition = birdPosition - JUMP_HEIGHT
        if(!gameCurentRun){
          setObstacleLeft(-OBSTACLE_WIDTH)
          setgameCurentRun(true)
        }
        if(!gameHasStarted){
          setgameHasStarted(true)
          setgameCurentRun(true)
          setScore(0)
          setBirdPosition(250)
      }
        else if(newBirdPosition<0){
            setBirdPosition(0)
        }
        else{
            setBirdPosition(newBirdPosition)
        }
    }
    
  return (
    <>
      <Div onClick={handleClick}>
        <GameBox height={GAME_HEIGHT} width={GAME_WIDTH} background={fbGameBackground}>
            <Obstacle 
                top={0} 
                width={OBSTACLE_WIDTH} 
                height={obstacleHeight} 
                left={obstacleLeft}
                angle={180}
                background={flappybirdPipe}
                />
            <Obstacle 
                top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)} 
                width={OBSTACLE_WIDTH} 
                height={bottomObstacleHeight} 
                left={obstacleLeft}
                angle={0}
                background={flappybirdPipe}
                />

            <Bird size={BIRD_SIZE} top={birdPosition} left={birdPositionLeft} background={flappybird}/>
        </GameBox>
        <span>{score}</span>
        
    </Div>
    <BottomDIV width={GAME_WIDTH} background={bottomBackground}/>
    </>
  )
}

export default Flappybird


const Bird = styled.div`
    position: absolute;
    background-image: url('${(props) => props.background}');
    background-size: contain;
    background-repeat: no-repeat;
    height: ${(props) => props.size}px;
    width: ${(props) => props.size}px;
    top: ${(props) => props.top}px;
    left: calc(50% - ${(props) => (props.left)?props.left:50}px);
`
const Div = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    & span{
        color:white;
        font-size: 24px;
        position: absolute;
    }
`
const GameBox = styled.div`
    position: relative;
    height: ${(props) => props.height}px;
    width: ${(props) => props.width}px;
    background-color: blue;
    overflow: hidden;
    background-image: url('${(props) => props.background}');
    background-repeat: no-repeat;
`
const Obstacle = styled.div`
    position: relative;
    top: ${(props) => props.top}px;
    background-image: url('${(props) => props.background}');
    background-size: cover;
    background-repeat: no-repeat;
    transform: rotate( ${(props) => props.angle}deg);
    height: ${(props) => props.height}px;
    width: ${(props) => props.width}px;
    left: ${(props) => props.left}px;
`
const BottomDIV = styled.div`
    margin: auto;
    height: 100px;
    width: ${(props) => props.width}px;
    background-image: url('${(props) => props.background}');
    background-repeat: repeat-x;
`


