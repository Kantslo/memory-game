import { LogoLight } from "./LogoLight"
import { Link } from "react-router-dom"
import { useState } from "react"


export const NewGame = () => {

  const [gameType, setGameType] = useState<string>('numbers')
  const [playerNumber, setPlayerNumber] = useState<number>(1)
  const [boardSize, setBoardSize] = useState<string>('4')

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-[#152938] min-h-screen">
        <LogoLight />
        <main className="font-atkinson bg-[#FCFCFC] px-6 py-6 md:px-14 md:py-14 rounded-lg md:rounded-3xl">
          <div>
            <p className="text-[15px] text-[#7191A5] font-bold md:text-[20px]">Select Theme</p>
            <div className="flex items-center gap-3 mt-3 md:mt-4 md:gap-[30px]">
              <button onClick={() => {
                setGameType('numbers')
              }} 
              className={`${gameType === 'numbers' ? 'bg-[#152938]' : 'bg-[#BCCED9]'} w-[134px] md:w-[256px] h-10 md:h-[52px] text-[#FCFCFC] text-[16px] font-bold rounded-3xl md:text-[26px] hover:bg-[#6395B8]`}>Numbers</button>
              <button onClick={() => {
                setGameType('icons')
              }} className={`${gameType === 'icons' ? 'bg-[#152938]' : 'bg-[#BCCED9]'} w-[134px] md:w-[256px] h-10 md:h-[52px] text-[#FCFCFC] text-[16px] font-bold rounded-3xl md:text-[26px] hover:bg-[#6395B8]`}>Icons</button>
            </div>
          </div>
          <div>
            <p className="text-[15px] text-[#7191A5] font-bold mt-6 md:mt-8 md:text-[20px]">Numbers of Players</p>
            <div className="flex items-center gap-[10px] md:gap-[22px] mt-3 md:mt-4">
              <button onClick={() => {setPlayerNumber(1)}} className={`w-[62px] md:w-[119px] md:h-[52px] md:text-[26px] h-10 text-[#FCFCFC] text-[16px] font-bold rounded-3xl ${playerNumber === 1 ? 'bg-[#152938]' : 'bg-[#BCCED9] hover:bg-[#6395B8]'}`}>1</button>
              <button onClick={() => {setPlayerNumber(2)}} className={`w-[62px] md:w-[119px] md:h-[52px] md:text-[26px] h-10 text-[#FCFCFC] text-[16px] font-bold rounded-3xl ${playerNumber === 2 ? 'bg-[#152938]' : 'bg-[#BCCED9] hover:bg-[#6395B8]'}`}>2</button>
              <button onClick={() => {setPlayerNumber(3)}} className={`w-[62px] md:w-[119px] md:h-[52px] md:text-[26px] h-10 text-[#FCFCFC] text-[16px] font-bold rounded-3xl ${playerNumber === 3 ? 'bg-[#152938]' : 'bg-[#BCCED9] hover:bg-[#6395B8]'}`}>3</button>
              <button onClick={() => {setPlayerNumber(4)}} className={`w-[62px] md:w-[119px] md:h-[52px] md:text-[26px] h-10 text-[#FCFCFC] text-[16px] font-bold rounded-3xl ${playerNumber === 4 ? 'bg-[#152938]' : 'bg-[#BCCED9] hover:bg-[#6395B8]'}`}>4</button>
            </div>
          </div>
          <div>
            <p className="text-[15px] text-[#7191A5] font-bold mt-6 md:mt-8 md:text-[20px]">Grid Size</p>
            <div className="flex items-center gap-3 mt-3 md:mt-4 md:gap-[30px]">
              <button onClick={() => {setBoardSize("4")}} className={`w-[134px] md:w-[256px] md:h-[52px] h-10 md:text-[26px] text-[#FCFCFC] text-[16px] font-bold rounded-3xl ${boardSize === "4" ? 'bg-[#152938]' : 'bg-[#BCCED9] hover:bg-[#6395B8]'}`}>4x4</button>
              <button onClick={() => {setBoardSize("6")}} className={`w-[134px] md:w-[256px] md:h-[52px] h-10 md:text-[26px] text-[#FCFCFC] text-[16px] font-bold rounded-3xl ${boardSize === "6" ? 'bg-[#152938]' : 'bg-[#BCCED9] hover:bg-[#6395B8]'}`}>6x6</button>
            </div>
          </div>
          <Link to={`/game/${gameType}/${playerNumber.toString()}/${boardSize}`}>
            <button className="w-[279px] h-12 md:w-[541px] md:h-[70px] md:text-[36px] md:rounded-[35px] bg-[#FDA214] text-[#FCFCFC] text-[18px] font-bold rounded-3xl mt-8">Start Game</button>
          </Link>
        </main>
      </div>
    </>
  )
}




